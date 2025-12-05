import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { UserGroupIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from './IconComponents';
import { messageService } from '../services/messageService';
import { supabase } from '../services/supabase';

interface DoctorDashboardProps {
  onLogout: () => void;
  userId: string;
}

const translations: Record<string, any> = {
  en: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Doctor Portal',
    chatTab: 'Patient Chat',
    patientList: 'Patients',
    selectPatient: 'Select a patient to start a conversation.'
  },
  es: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Portal del Doctor',
    chatTab: 'Chat del Paciente',
    patientList: 'Pacientes',
    selectPatient: 'Seleccione un paciente para iniciar una conversación.'
  },
  fr: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Portail Médecin',
    chatTab: 'Chat Patient',
    patientList: 'Patients',
    selectPatient: 'Sélectionnez un patient pour démarrer une conversation.'
  }
};

interface Patient {
  id: string;
  name: string;
  status: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout, userId }) => {
  const [language, setLanguage] = useState<string>('en');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const t = translations[language];

  // Load patients list
  useEffect(() => {
    const loadPatients = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'patient');

      if (error) {
        console.error('Error loading patients:', error);
      } else {
        setPatients((data || []).map(p => ({
          id: p.id,
          name: p.full_name || p.email,
          status: 'Online'
        })));
      }
    };
    loadPatients();
  }, []);

  // Load messages when patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      console.log('Doctor selected patient:', selectedPatientId);
      console.log('Doctor userId:', userId);
      const loadMessages = async () => {
        const msgs = await messageService.getMessages(selectedPatientId, 'doctor', userId);
        setMessages(msgs);
      };
      loadMessages();
    }
  }, [selectedPatientId, userId]);

  // Subscribe to message updates
  useEffect(() => {
    if (!selectedPatientId) return;
    
    const unsubscribe = messageService.subscribeToMessages(selectedPatientId, async () => {
      const msgs = await messageService.getMessages(selectedPatientId, 'doctor', userId);
      setMessages(msgs);
    });
    
    return unsubscribe;
  }, [selectedPatientId, userId]);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!selectedPatientId) return;
    
    try {
      console.log('Doctor sending message to patient:', { 
        patientId: selectedPatientId, 
        doctorId: userId, 
        senderId: userId,
        text 
      });
      await messageService.addMessage(selectedPatientId, userId, userId, text, file);
      console.log('Doctor message sent successfully');
      // Reload messages after sending
      const msgs = await messageService.getMessages(selectedPatientId, 'doctor', userId);
      console.log('Doctor reloaded messages:', msgs);
      setMessages(msgs);
    } catch (error) {
      console.error('Doctor failed to send message:', error);
    }
  };
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <>
      <Header language={language} setLanguage={setLanguage} translations={t} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
            <div className="md:col-span-1 lg:col-span-1 bg-white p-4 rounded-xl shadow-md border border-slate-200">
                <div className="flex items-center mb-4">
                    <UserGroupIcon className="h-6 w-6 text-slate-500 mr-3" />
                    <h2 className="text-lg font-semibold text-slate-700">{t.patientList}</h2>
                </div>
                <ul className="space-y-2">
                    {patients.map(p => (
                        <li key={p.id}>
                            <button onClick={() => { setSelectedPatientId(p.id); setMessages([]); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${selectedPatientId === p.id ? 'bg-indigo-100' : 'hover:bg-slate-100'}`}>
                                <UserCircleIcon className="h-8 w-8 text-slate-400 mr-3"/>
                                <div>
                                    <p className="font-medium text-slate-800">{p.name}</p>
                                    <p className={`text-sm ${p.status === 'Online' ? 'text-green-500' : 'text-slate-400'}`}>{p.status}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
                {selectedPatient ? (
                      <Chat
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        placeholder={`Message ${selectedPatient.name}...`}
                        contactName={selectedPatient.name}
                        contactStatus={selectedPatient.status}
                    />
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-full items-center justify-center min-h-[500px]">
                        <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-slate-500">{t.selectPatient}</p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </>
  );
};