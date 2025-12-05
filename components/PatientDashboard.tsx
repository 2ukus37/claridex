import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { DiagnosticCopilot } from './DiagnosticCopilot';
import { SparklesIcon, ChatBubbleLeftRightIcon } from './IconComponents';
import { messageService } from '../services/messageService';
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
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>('Doctor');

  const t = translations[language];

  // Get the first doctor (in production, patient would select their doctor)
  useEffect(() => {
    const loadDoctor = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'doctor')
        .limit(1);

      if (error) {
        console.error('Error loading doctor:', error);
      } else if (data && data.length > 0) {
        setDoctorId(data[0].id);
        setDoctorName(data[0].full_name || data[0].email);
      } else {
        console.log('No doctors found. Please create a doctor account first.');
      }
    };
    loadDoctor();
  }, []);

  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await messageService.getMessages(userId, 'patient', userId);
      setMessages(msgs);
    };
    loadMessages();
  }, [userId]);

  // Subscribe to message updates
  useEffect(() => {
    const unsubscribe = messageService.subscribeToMessages(userId, async () => {
      const msgs = await messageService.getMessages(userId, 'patient', userId);
      setMessages(msgs);
    });
    return unsubscribe;
  }, [userId]);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!doctorId) {
      console.error('No doctor assigned');
      return;
    }
    
    try {
      console.log('Patient sending message:', { 
        patientId: userId, 
        doctorId: doctorId, 
        senderId: userId,
        text 
      });
      await messageService.addMessage(userId, doctorId, userId, text, file);
      console.log('Patient message sent successfully');
      // Reload messages after sending
      const msgs = await messageService.getMessages(userId, 'patient', userId);
      console.log('Patient reloaded messages:', msgs);
      setMessages(msgs);
    } catch (error) {
      console.error('Patient failed to send message:', error);
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
                {!doctorId ? (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
                        <p className="text-slate-600 mb-4">No doctor assigned yet.</p>
                        <p className="text-sm text-slate-500">Please ask your administrator to create a doctor account, or sign up as a doctor in another browser window.</p>
                    </div>
                ) : (
                    <Chat 
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        placeholder={`Type your message to ${doctorName}...`}
                        contactName={doctorName}
                        contactStatus="Online"
                    />
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