import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { DiagnosticCopilot } from './DiagnosticCopilot';
import { SparklesIcon, ChatBubbleLeftRightIcon } from './IconComponents';
import { messageService, OnlineUser } from '../services/messageService';
import { supabase } from '../services/supabase';

interface PatientDashboardProps {
  onLogout: () => void;
  userId: string;
}

const translations: Record<string, any> = {
  en: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Patient Portal',
    copilotTab: 'Diagnostic Co-pilot',
    chatTab: 'Chat with Doctor',
    uploadImage: 'Upload Your Image',
    usingPlaceholder: 'Using example image.',
    clinicalNotes: 'Your Clinical Notes',
    clinicalNotesPlaceholder: 'Enter any notes from your doctor or symptoms you are experiencing...',
    labValues: 'Your Lab Values',
    labValuesPlaceholder: 'Enter any relevant lab values...',
    aiSummary: 'AI Co-pilot Summary',
    synthesizing: 'Synthesizing data...',
    errorPrefix: 'Error:',
    beginAnalysis: 'Provide your data and click "Generate Summary" to begin analysis.',
    generate: 'Generate Summary',
    generating: 'Generating...',
  },
  es: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Portal del Paciente',
    copilotTab: 'Copiloto de Diagnóstico',
    chatTab: 'Chatear con el Doctor',
    uploadImage: 'Subir Su Imagen',
    usingPlaceholder: 'Usando imagen de ejemplo.',
    clinicalNotes: 'Sus Notas Clínicas',
    clinicalNotesPlaceholder: 'Ingrese cualquier nota de su médico o síntoma que esté experimentando...',
    labValues: 'Sus Valores de Laboratorio',
    labValuesPlaceholder: 'Ingrese cualquier valor de laboratorio relevante...',
    aiSummary: 'Resumen del Copiloto de IA',
    synthesizing: 'Sintetizando datos...',
    errorPrefix: 'Error:',
    beginAnalysis: 'Proporcione sus datos y haga clic en "Generar Resumen" para iniciar el análisis.',
    generate: 'Generar Resumen',
    generating: 'Generando...',
  },
  fr: {
    headerTitle: 'ClariDx',
    headerSubtitle: 'Portail Patient',
    copilotTab: 'Copilote de Diagnostic',
    chatTab: 'Discuter avec le Médecin',
    uploadImage: 'Téléchargez Votre Image',
    usingPlaceholder: 'Utilisation de l\'image d\'exemple.',
    clinicalNotes: 'Vos Notes Cliniques',
    clinicalNotesPlaceholder: 'Saisissez les notes de votre médecin ou les symptômes que vous ressentez...',
    labValues: 'Vos Valeurs de Laboratoire',
    labValuesPlaceholder: 'Saisissez toute valeur de laboratoire pertinente...',
    aiSummary: 'Résumé du Copilote IA',
    synthesizing: 'Synthèse des données...',
    errorPrefix: 'Erreur:',
    beginAnalysis: 'Fournissez vos données et cliquez sur "Générer un résumé" pour commencer l\'analyse.',
    generate: 'Générer un résumé',
    generating: 'Génération...',
  }
};


export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onLogout, userId }) => {
  const [language, setLanguage] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'copilot'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<OnlineUser | null>(null);
  const [onlineDoctors, setOnlineDoctors] = useState<OnlineUser[]>([]);
  const t = translations[language];

  // Join presence and track as patient
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      const name = data?.full_name || data?.email || 'Patient';

      const unsub = messageService.joinPresence(userId, 'patient', name, (users) => {
        const doctors = users.filter(u => u.role === 'doctor' && u.userId !== userId);
        setOnlineDoctors(doctors);
        if (!selectedDoctor && doctors.length > 0) {
          setSelectedDoctor(doctors[0]);
        }
      });

      return unsub;
    };

    let cleanup: (() => void) | undefined;
    init().then(fn => { cleanup = fn; });
    return () => { if (cleanup) cleanup(); };
  }, [userId]);

  // Load messages when doctor is selected
  useEffect(() => {
    if (!selectedDoctor) return;
    const load = async () => {
      const msgs = await messageService.getMessages(userId, selectedDoctor.userId);
      setMessages(msgs);
    };
    load();
  }, [selectedDoctor, userId]);

  // Subscribe to new messages from selected doctor only
  useEffect(() => {
    if (!selectedDoctor) return;
    const unsub = messageService.subscribeToConversation(userId, selectedDoctor.userId, async () => {
      const msgs = await messageService.getMessages(userId, selectedDoctor.userId);
      setMessages(msgs);
    });
    return unsub;
  }, [selectedDoctor, userId]);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!selectedDoctor) {
      console.error('No doctor selected');
      return;
    }
    try {
      await messageService.sendMessage(userId, selectedDoctor.userId, text, file);
      const msgs = await messageService.getMessages(userId, selectedDoctor.userId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <Header language={language} setLanguage={setLanguage} translations={t} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`${ activeTab === 'chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    aria-current={activeTab === 'chat' ? 'page' : undefined}
                >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" /> {t.chatTab}
                </button>
                <button
                    onClick={() => setActiveTab('copilot')}
                    className={`${ activeTab === 'copilot' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    aria-current={activeTab === 'copilot' ? 'page' : undefined}
                >
                    <SparklesIcon className="h-5 w-5 mr-2" /> {t.copilotTab}
                </button>
                </nav>
            </div>
        </div>
        
        {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
                {onlineDoctors.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
                        <p className="text-slate-600 mb-2">No doctors are online right now.</p>
                        <p className="text-sm text-slate-400">Please wait for a doctor to come online.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                            <h2 className="text-sm font-semibold text-slate-700 mb-3">Online Doctors</h2>
                            <ul className="space-y-2">
                                {onlineDoctors.map(d => (
                                    <li key={d.userId}>
                                        <button
                                            onClick={() => { setSelectedDoctor(d); setMessages([]); }}
                                            className={`w-full text-left flex items-center p-2 rounded-lg transition-colors ${selectedDoctor?.userId === d.userId ? 'bg-indigo-100' : 'hover:bg-slate-100'}`}
                                        >
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-600 font-bold text-sm">
                                                {d.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 text-sm">{d.name}</p>
                                                <p className="text-xs text-green-500">● Online</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:col-span-3">
                            {selectedDoctor ? (
                                <Chat
                                    messages={messages}
                                    onSendMessage={handleSendMessage}
                                    placeholder={`Type your message to ${selectedDoctor.name}...`}
                                    contactName={selectedDoctor.name}
                                    contactStatus="Online"
                                />
                            ) : (
                                <div className="bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center min-h-[500px]">
                                    <p className="text-slate-400">Select a doctor to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'copilot' && (
            <DiagnosticCopilot t={t} language={language} />
        )}
      </main>
    </>
  );
};