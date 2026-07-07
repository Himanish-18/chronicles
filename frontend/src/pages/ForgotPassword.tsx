import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-heading font-bold text-xl text-surface-100">Chronicles</span>
      </div>

      {submitted ? (
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="text-green-400" size={32} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-surface-100">Check your email</h2>
          <p className="mt-2 text-sm text-surface-400 max-w-sm mx-auto">
            We've sent a password reset link to <span className="text-surface-200">{email}</span>. Check your inbox and follow the instructions.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-6">
              <ArrowLeft size={16} /> Back to sign in
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <h2 className="font-heading text-2xl font-bold text-surface-100">Forgot password?</h2>
          <p className="mt-1 text-sm text-surface-400">No worries, we'll send you reset instructions.</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail size={18} />} required autoComplete="email" />
            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">Send Reset Link</Button>
          </form>

          <Link to="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-surface-400 hover:text-surface-200 transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </>
      )}
    </motion.div>
  );
}
