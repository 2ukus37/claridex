import React from 'react';
import { UserRole } from '../App';
import { LogoIcon, UserCircleIcon, BeakerIcon } from './IconComponents';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: (role: UserRole) => void;
}> = ({ role, title, description, icon, onClick }) => (
  <div
    onClick={() => onClick(role)}
    className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
  >
    <div className="bg-indigo-100 p-4 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 mb-6">{description}</p>
    <button
        className="w-full mt-auto bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200"
    >
        Login as {title}
    </button>
  </div>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-12">
            <LogoIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Welcome to ClariDx</h1>
            <p className="text-lg text-slate-500 mt-2">Your Multi-Modal Diagnostic Co-pilot</p>
        </div>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoleCard
                role="doctor"
                title="Doctor"
                description="Access the diagnostic co-pilot, review cases, and consult with patients."
                icon={<BeakerIcon className="h-10 w-10 text-indigo-600" />}
                onClick={onLogin}
            />
            <RoleCard
                role="patient"
                title="Patient"
                description="Consult with your doctor, share files, and view your case history."
                icon={<UserCircleIcon className="h-10 w-10 text-indigo-600" />}
                onClick={onLogin}
            />
        </div>

        <footer className="text-center text-slate-500 mt-16 text-sm">
            <p>&copy; {new Date().getFullYear()} ClariDx. For demonstration purposes only.</p>
        </footer>
    </div>
  );
};
