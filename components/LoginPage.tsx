import React, { useState } from 'react';
import { UserRole } from '../App';
import { LogoIcon, UserCircleIcon, BeakerIcon } from './IconComponents';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onLogin: (role: UserRole, userId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'landing' | 'signin' | 'signup'>('landing');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) throw new Error('Account not found. Please sign up first.');

        // Strictly use role from database - no override
        onLogin(profile.role as UserRole, data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: selectedRole, full_name: fullName } },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert([{ id: data.user.id, email: data.user.email, role: selectedRole, full_name: fullName }], { onConflict: 'id' });

        if (profileError) throw profileError;

        onLogin(selectedRole!, data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMode('landing');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
  };

  // Landing - choose sign in or sign up
  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-12">
          <LogoIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Welcome to ClariDx</h1>
          <p className="text-lg text-slate-500 mt-2">Your Multi-Modal Diagnostic Co-pilot</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => setMode('signin')}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className="w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Create Account
          </button>
        </div>
        <footer className="text-center text-slate-500 mt-16 text-sm">
          <p>&copy; {new Date().getFullYear()} ClariDx. For demonstration purposes only.</p>
        </footer>
      </div>
    );
  }

  // Sign In - no role selection, role comes from database
  if (mode === 'signin') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <LogoIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
            <p className="text-slate-500 mt-2">You'll be directed to your portal automatically</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required minLength={6} />
              </div>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={reset} className="text-slate-500 hover:text-slate-700 text-sm">← Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up - role selection required
  if (mode === 'signup' && !selectedRole) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-10">
          <LogoIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Select your role to get started</p>
        </div>
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => setSelectedRole('doctor')}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <BeakerIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Doctor</h3>
            <p className="text-slate-500 text-sm">Access diagnostic tools and consult with patients.</p>
          </div>
          <div onClick={() => setSelectedRole('patient')}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <UserCircleIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Patient</h3>
            <p className="text-slate-500 text-sm">Consult with your doctor and manage your health.</p>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={reset} className="text-slate-500 hover:text-slate-700 text-sm">← Back</button>
        </div>
      </div>
    );
  }

  // Sign Up form
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogoIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required minLength={6} />
            </div>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setSelectedRole(null)} className="text-slate-500 hover:text-slate-700 text-sm">← Change role</button>
          </div>
        </div>
      </div>
    </div>
  );
};
