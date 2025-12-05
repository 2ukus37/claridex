import { Message } from '../components/Chat';
import { supabase } from './supabase';

interface DBMessage {
  id: number;
  patient_id: string;
  doctor_id: string | null;
  sender_id: string;
  text: string;
  file_name: string | null;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
}

class MessageService {
  async getMessages(patientId: string, viewerRole: 'doctor' | 'patient', viewerId: string): Promise<Message[]> {
    console.log('Fetching messages for:', { patientId, viewerRole, viewerId });
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    console.log('Fetched messages:', data);

    // Transform messages based on viewer's perspective
    return (data || []).map((msg: DBMessage) => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender_id === viewerId ? 'me' : 'other',
      file: msg.file_name ? {
        name: msg.file_name,
        url: msg.file_url!,
        type: msg.file_type!,
      } : undefined,
    }));
  }

  async addMessage(
    patientId: string,
    doctorId: string | null,
    senderId: string,
    text: string,
    file?: File
  ): Promise<void> {
    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (file) {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${senderId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileType = file.type;
      }
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          sender_id: senderId,
          text,
          file_name: fileName,
          file_url: fileUrl,
          file_type: fileType,
        },
      ]);

    if (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  subscribeToMessages(patientId: string, callback: () => void) {
    const channel = supabase
      .channel(`messages:${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `patient_id=eq.${patientId}`,
        },
        (payload) => {
          console.log('Realtime message received:', payload);
          callback();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from messages');
      supabase.removeChannel(channel);
    };
  }
}

export const messageService = new MessageService();
