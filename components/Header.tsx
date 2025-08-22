import React from 'react';
import { LogoIcon, GlobeIcon, ArrowRightOnRectangleIcon } from './IconComponents';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: {
    headerTitle: string;
    headerSubtitle: string;
  };
  onLogout?: () => void;
}

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, translations, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
             <LogoIcon className="h-10 w-10 text-indigo-600" />
            <div className="ml-4">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{translations.headerTitle}</h1>
                <p className="text-sm text-slate-500">{translations.headerSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <GlobeIcon className="h-6 w-6 text-slate-500 mr-2" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-slate-300 rounded-md py-1 px-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Select language"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
