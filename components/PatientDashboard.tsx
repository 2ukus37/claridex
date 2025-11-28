import React, { useState } from 'react';
import { Header } from './Header';
import { Chat, Message } from './Chat';
import { DiagnosticCopilot } from './DiagnosticCopilot';
import { SparklesIcon, ChatBubbleLeftRightIcon } from './IconComponents';

interface PatientDashboardProps {
  onLogout: () => void;
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


export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onLogout }) => {
  const [language, setLanguage] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'copilot'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'other' }
  ]);

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

    // Mock doctor reply
    setTimeout(() => {
        let replyText = "Thank you for your message. The doctor will review it shortly.";
        if (file) {
            replyText = `The doctor has received your file (${file.name}) and will get back to you soon.`;
        }
        setMessages(prev => [...prev, {id: prev.length + 1, text: replyText, sender: 'other'}]);
    }, 1500);

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
                <Chat 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    placeholder="Type your message to Dr. Anderson..."
                    contactName="Dr. Anderson"
                    contactStatus="Online"
                />
            </div>
        )}

        {activeTab === 'copilot' && (
            <DiagnosticCopilot t={t} language={language} />
        )}
      </main>
    </>
  );
};