import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { UserGroupIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from './IconComponents';
import { messageService, OnlineUser } from '../services/messageService';
import { supabase } from '../services/supabase';

interface DoctorDashboardProps {
  onLogout: () => void;
  userId: string;
}

const translations: Record<string, any> = {
  en: { headerTitle: 'ClariDx', headerSubtitle: 'Doctor Portal', patientList: 'Online Patients', selectPatient: 'Select a patient to start a conversation.' },
  es: { headerTitle: 'ClariDx', headerSubtitle: 'Portal del Doctor', patientList: 'Pacientes en Línea', selectPatient: 'Seleccione un paciente para iniciar una conversación.' },
  fr: { headerTitle: 'ClariDx', headerSubtitle: 'Portail Médecin', patientList: 'Patients en Ligne', selectPatient: 'Sélectionnez un patient pour démarrer une conversation.' }
};

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout, userId }) => {
  const [language, setLanguage] = useState('en');
  const [selectedPatient, setSelectedPatient] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlinePatients, setOnlinePatients] = useState<OnlineUser[]>([]);
  const t = translations[language];

  // Join presence and track as doctor
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      const name = data?.full_name || data?.email || 'Doctor';

      const unsub = messageService.joinPresence(userId, 'doctor', name, (users) => {
        const patients = users.filter(u => u.role === 'patient' && u.userId !== userId);
        setOnlinePatients(patients);
      });

      return unsub;
    };

    let cleanup: (() => void) | undefined;
    init().then(fn => { cleanup = fn; });
    return () => { if (cleanup) cleanup(); };
  }, [userId]);

  // Load messages when patient is selected
  useEffect(() => {
    if (!selectedPatient) return;
    const load = async () => {
      const msgs = await messageService.getMessages(userId, selectedPatient.userId);
      setMessages(msgs);
    };
    load();
  }, [selectedPatient, userId]);

  // Subscribe to new messages from selected patient only
  useEffect(() => {
    if (!selectedPatient) return;
    const unsub = messageService.subscribeToConversation(userId, selectedPatient.userId, async () => {
      const msgs = await messageService.getMessages(userId, selectedPatient.userId);
      setMessages(msgs);
    });
    return unsub;
  }, [selectedPatient, userId]);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!selectedPatient) return;
    try {
      await messageService.sendMessage(userId, selectedPatient.userId, text, file);
      const msgs = await messageService.getMessages(userId, selectedPatient.userId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <Header language={language} setLanguage={setLanguage} translations={t} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
          <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-6 w-6 text-slate-500 mr-3" />
              <h2 className="text-lg font-semibold text-slate-700">{t.patientList}</h2>
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">{onlinePatients.length}</span>
            </div>
            {onlinePatients.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No patients online</p>
            ) : (
              <ul className="space-y-2">
                {onlinePatients.map(p => (
                  <li key={p.userId}>
                    <button
                      onClick={() => { setSelectedPatient(p); setMessages([]); }}
                      className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${selectedPatient?.userId === p.userId ? 'bg-indigo-100' : 'hover:bg-slate-100'}`}
                    >
                      <UserCircleIcon className="h-8 w-8 text-slate-400 mr-3" />
                      <div>
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-sm text-green-500">● Online</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            {selectedPatient ? (
              <Chat
                messages={messages}
                onSendMessage={handleSendMessage}
                placeholder={`Message ${selectedPatient.name}...`}
                contactName={selectedPatient.name}
                contactStatus="Online"
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