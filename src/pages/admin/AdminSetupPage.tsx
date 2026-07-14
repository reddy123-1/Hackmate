import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSetup = async () => {
    setStatus('loading');
    try {
      const email = 'tr58561@gmail.com';
      const password = 'tejasteju411';

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      setStatus('success');
      setMessage(`Admin account created successfully!\nEmail: ${email}\nYou can now log in at /admin/login`);
    } catch (err: any) {
      setStatus('error');
      if (err.code === 'auth/email-already-in-use') {
        setMessage('Admin account already exists. You can log in at /admin/login');
      } else {
        setMessage(err.message || 'Setup failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark:bg-surface-950 bg-surface-50 relative overflow-hidden">
      <div className="hero-glow" />
      <div className="hero-glow-2" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 mx-auto mb-4 shadow-lg shadow-brand-500/20">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-surface-900">Admin Setup</h1>
          <p className="text-sm dark:text-surface-400 text-surface-600 mt-1">
            One-time setup to create your admin account
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          {status === 'idle' && (
            <>
              <div className="space-y-2 text-sm dark:text-surface-300 text-surface-700">
                <p>This will create an admin account with:</p>
                <div className="p-3 rounded-lg dark:bg-white/5 bg-black/5 space-y-1">
                  <p><span className="dark:text-surface-500 text-surface-500">Email:</span> tr58561@gmail.com</p>
                  <p><span className="dark:text-surface-500 text-surface-500">Password:</span> ••••••••••••</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSetup}
                className="btn-primary w-full justify-center py-3"
              >
                Create Admin Account
              </motion.button>
            </>
          )}

          {status === 'loading' && (
            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto mb-3" />
              <p className="text-sm dark:text-surface-400 text-surface-600">Setting up admin account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              </motion.div>
              <p className="text-sm dark:text-surface-300 text-surface-700 whitespace-pre-line">{message}</p>
              <a href="/admin/login" className="btn-primary mt-4 inline-flex justify-center">
                Go to Login →
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-3" />
              <p className="text-sm dark:text-surface-300 text-surface-700">{message}</p>
              <div className="flex gap-3 mt-4 justify-center">
                <button onClick={() => setStatus('idle')} className="btn-secondary">
                  Try Again
                </button>
                <a href="/admin/login" className="btn-primary">
                  Go to Login
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
