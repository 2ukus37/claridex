import React, { useState } from 'react';
import { UserRole } from '../App';
import { LogoIcon, UserCircleIcon, BeakerIcon } from './IconComponents';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: selectedRole,
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Insert user profile (use upsert to avoid conflicts)
          const { error: profileError } = await supabase
            .from('users')
            .upsert([
              {
                id: data.user.id,
                email: data.user.email,
                role: selectedRole,
                full_name: fullName,
              },
            ], { onConflict: 'id' });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
          }

          onLogin(selectedRole!, data.user.id);
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            // If profile doesn't exist, use the selected role as fallback
            onLogin(selectedRole!, data.user.id);
          } else {
            onLogin(profile.role, data.user.id);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-12">
          <LogoIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Welcome to ClariDx</h1>
          <p className="text-lg text-slate-500 mt-2">Your Multi-Modal Diagnostic Co-pilot</p>
        </div>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => handleRoleSelect('doctor')}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-6">
              <BeakerIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Doctor</h3>
            <p className="text-slate-500 mb-6">Access the diagnostic co-pilot, review cases, and consult with patients.</p>
            <button className="w-full mt-auto bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200">
              Continue as Doctor
            </button>
          </div>

          <div
            onClick={() => handleRoleSelect('patient')}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-6">
              <UserCircleIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Patient</h3>
            <p className="text-slate-500 mb-6">Consult with your doctor, share files, and view your case history.</p>
            <button className="w-full mt-auto bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200">
              Continue as Patient
            </button>
          </div>
        </div>

        <footer className="text-center text-slate-500 mt-16 text-sm">
          <p>&copy; {new Date().getFullYear()} ClariDx. For demonstration purposes only.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogoIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-slate-500 mt-2">
            as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
