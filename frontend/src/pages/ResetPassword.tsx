import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationError('No reset token provided');
        setIsValidating(false);
        return;
      }

      try {
        const response = await authService.verifyResetToken(token);
        if (response.valid) {
          setIsTokenValid(true);
        } else {
          setValidationError('Invalid or expired reset token');
        }
      } catch (err: any) {
        setValidationError(err.response?.data?.message || 'Failed to verify token');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match');
      return;
    }

    if (!token) return;

    try {
      setIsSubmitting(true);
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successfully. Please log in.' } });
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
        <p className="text-surface-400">Verifying reset link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <XCircle className="text-red-400" size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-surface-100 mb-2">Link Expired</h2>
        <p className="text-surface-400 max-w-sm mx-auto mb-6">
          {validationError || 'This password reset link is invalid or has expired.'}
        </p>
        <Link to="/forgot-password">
          <Button variant="primary">Request New Link</Button>
        </Link>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="text-green-400" size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-surface-100 mb-2">Password Reset Successful!</h2>
        <p className="text-surface-400 max-w-sm mx-auto mb-6">
          Your password has been changed successfully. You will be redirected to the login page shortly.
        </p>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Go to Login Now
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-heading font-bold text-xl text-surface-100">Chronicles</span>
      </div>

      <h2 className="font-heading text-2xl font-bold text-surface-100">Set New Password</h2>
      <p className="mt-1 text-sm text-surface-400">Please choose a strong password for your account.</p>

      {submitError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input 
          label="New Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="••••••••" 
          icon={<Lock size={18} />} 
          required 
          minLength={8}
        />
        <Input 
          label="Confirm Password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="••••••••" 
          icon={<Lock size={18} />} 
          required 
          minLength={8}
        />
        
        <ul className="text-xs text-surface-400 space-y-1 mt-2 mb-4 list-disc list-inside">
          <li>At least 8 characters long</li>
          <li>Contains at least one uppercase letter</li>
          <li>Contains at least one number</li>
        </ul>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </motion.div>
  );
}
