import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';

export type UserRole = 'doctor' | 'patient';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {userRole === 'doctor' && <DoctorDashboard onLogout={handleLogout} />}
      {userRole === 'patient' && <PatientDashboard onLogout={handleLogout} />}
    </div>
  );
};

export default App;
