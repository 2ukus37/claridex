import { Message } from '../components/Chat';
import { supabase } from './supabase';

interface DBMessage {
  id: number;
  sender_id: string;
  receiver_id: string;
  text: string;
  file_name: string | null;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
}

export interface OnlineUser {
  userId: string;
  role: string;
  name: string;
}

// Single shared presence channel
let presenceChannel: any = null;

class MessageService {
  // Get messages strictly between two users
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return (data || []).map((msg: DBMessage) => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender_id === userId ? 'me' : 'other',
      file: msg.file_name ? {
        name: msg.file_name,
        url: msg.file_url!,
        type: msg.file_type!,
      } : undefined,
    }));
  }

  // Send a message to a specific user
  async sendMessage(senderId: string, receiverId: string, text: string, file?: File): Promise<void> {
    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${senderId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('chat-files').upload(filePath, file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('chat-files').getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileType = file.type;
      }
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, text, file_name: fileName, file_url: fileUrl, file_type: fileType }]);

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Subscribe to new incoming messages from a specific user
  subscribeToConversation(userId: string, otherUserId: string, callback: () => void) {
    const channel = supabase
      .channel(`conv:${[userId, otherUserId].sort().join('-')}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      }, (payload: any) => {
        if (payload.new.sender_id === otherUserId) {
          callback();
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  // Join the shared presence channel and track this user
  joinPresence(userId: string, role: string, name: string, onUpdate: (users: OnlineUser[]) => void) {
    // Remove existing channel if any
    if (presenceChannel) {
      supabase.removeChannel(presenceChannel);
    }

    presenceChannel = supabase.channel('presence:claridx', {
      config: { presence: { key: userId } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: OnlineUser[] = Object.values(state)
          .flat()
          .map((u: any) => ({ userId: u.userId, role: u.role, name: u.name }));
        console.log('Online users:', users);
        onUpdate(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }: any) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status: string) => {
        console.log('Presence status:', status);
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ userId, role, name });
          console.log('Tracking presence for:', { userId, role, name });
        }
      });

    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
        presenceChannel = null;
      }
    };
  }
}

export const messageService = new MessageService();
