import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ showToast }) => {
  const { showAuthModal, setShowAuthModal, authView, setAuthView, login, register, recover } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authView === 'login') {
        await login(email, password);
        showToast(`Welcome back!`, 'success');
      } else if (authView === 'register') {
        await register(email, password, firstName, lastName);
        showToast('Account created successfully!', 'success');
      } else if (authView === 'recover') {
        await recover(email);
        showToast('Password reset email sent.', 'info');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAuthModal(false)} />
      
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-scale-in">
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="px-8 pt-10 pb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                {authView === 'login' && 'Welcome Back'}
                {authView === 'register' && 'Join the Club'}
                {authView === 'recover' && 'Reset Password'}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
                {authView === 'login' && 'Enter your details to access your account.'}
                {authView === 'register' && 'Create an account to track orders and save details.'}
                {authView === 'recover' && 'Enter your email to receive recovery instructions.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {authView === 'register' && (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700">First Name</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    required
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                    placeholder="Jane"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700">Last Name</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    required
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                    placeholder="Doe"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-700">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="you@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>

                {authView !== 'recover' && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                        {authView === 'login' && (
                            <div className="flex justify-end pt-1">
                                <button 
                                    type="button" 
                                    onClick={() => setAuthView('recover')}
                                    className="text-xs text-gray-500 hover:text-black hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <>
                            {authView === 'login' && 'Sign In'}
                            {authView === 'register' && 'Create Account'}
                            {authView === 'recover' && 'Send Instructions'}
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 text-xs uppercase tracking-widest">Or</span>
                    </div>
                </div>

                {authView === 'login' ? (
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => setAuthView('register')} className="font-bold text-black hover:underline">
                            Sign Up
                        </button>
                    </p>
                ) : (
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => setAuthView('login')} className="font-bold text-black hover:underline">
                            Log In
                        </button>
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;