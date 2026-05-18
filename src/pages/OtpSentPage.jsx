import { PieChart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';
import { useEffect, useState } from 'react';

export function OtpSentPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-fade-in text-center transition-colors">
        {/* Logo (Consistency) */}
        <div className="flex justify-center">
          <img src="/favicon.svg" alt="Expensify Logo" className="w-12 h-12 mx-auto mb-6" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reset Password</h1>

        {/* Success Icon (Middle) */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-gray-950 shadow-sm">
              <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-4 border-b-2 border-r-2 border-white rotate-45 mb-1" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">OTP Sent Successfully!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We've sent a 6-digit verification code to <br />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
        </p>

        {/* Content */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
            Please check your inbox (and spam folder) for the OTP. The code is valid for 1 minute.
          </p>
        </div>

        {/* Action */}
        <Button
          onClick={() => navigate('/verify-otp')}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
        >
          Verify Now
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Didn't receive the code?{' '}
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-emerald-500 hover:text-emerald-600 font-medium"
          >
            Try another email
          </button>
        </p>
      </div>
    </div>
  );
}
