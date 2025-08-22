import React, { useState, useRef, useEffect } from 'react';
import { PaperClipIcon, PaperAirplaneIcon } from './IconComponents';

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  file?: {
    name: string;
    url: string;
    type: string; // e.g., 'image/png'
  };
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string, file?: File) => void;
  placeholder: string;
  contactName: string;
  contactStatus: string;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, placeholder, contactName, contactStatus }) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSend = () => {
    if (inputText.trim() || file) {
      onSendMessage(inputText, file ?? undefined);
      setInputText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  
  const isImage = (fileType: string) => fileType.startsWith('image/');

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">{contactName}</h3>
        <p className="text-sm text-green-500">{contactStatus}</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.sender === 'me' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {msg.file && (
                    <div className="mb-2">
                        {isImage(msg.file.type) ? (
                            <img src={msg.file.url} alt={msg.file.name} className="rounded-lg max-w-full h-auto" />
                        ) : (
                            <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                                <PaperClipIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium underline">{msg.file.name}</span>
                            </a>
                        )}
                    </div>
                )}
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-white">
        {file && (
          <div className="mb-2 text-sm text-slate-600">
            Attached: {file.name}
          </div>
        )}
        <div className="flex items-center space-x-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full flex-grow p-3 bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
            rows={1}
            style={{ resize: 'none' }}
            aria-label="Chat message input"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer p-2 text-slate-500 hover:text-indigo-600">
            <PaperClipIcon className="h-6 w-6" />
          </label>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !file}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
