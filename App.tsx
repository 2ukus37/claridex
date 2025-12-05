import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { supabase } from './services/supabase';
import { Spinner } from './components/Spinner';

export type UserRole = 'doctor' | 'patient';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              setUserRole(data[0].role);
              setUserId(session.user.id);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              setUserRole(data[0].role);
              setUserId(session.user.id);
            }
          });
      } else {
        setUserRole(null);
        setUserId('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role: UserRole, id: string) => {
    setUserRole(role);
    setUserId(id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setUserId('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {userRole === 'doctor' && <DoctorDashboard onLogout={handleLogout} userId={userId} />}
      {userRole === 'patient' && <PatientDashboard onLogout={handleLogout} userId={userId} />}
    </div>
  );
};

export default App;
