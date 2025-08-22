import React, { useState } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { UserGroupIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from './IconComponents';

interface DoctorDashboardProps {
  onLogout: () => void;
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

const mockPatients = [
    { id: 1, name: 'John Doe', status: 'Online'},
    { id: 2, name: 'Jane Smith', status: 'Away'},
    { id: 3, name: 'Robert Brown', status: 'Online'},
];

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
  const [language, setLanguage] = useState<string>('en');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const t = translations[language];

  const handleSendMessage = (text: string, file?: File) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'me',
    };
    if (file) {
      newMessage.file = {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
    }
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Mock patient reply
    setTimeout(() => {
        setMessages(prev => [...prev, {id: prev.length + 1, text: "Thank you for the update, doctor.", sender: 'other'}]);
    }, 1500);
  };
  
  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);

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
                    {mockPatients.map(p => (
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