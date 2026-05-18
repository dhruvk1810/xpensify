import { useState, useRef, useEffect } from 'react';
import { PieChart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@/lib/router';

const API_BASE = 'http://localhost:5000/api';

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(60); // 1 minute expiry
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let timer;
    if (expiryTimer > 0) {
      timer = setInterval(() => {
        setExpiryTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expiryTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    
    setIsResending(true);
    setError('');
    setResendSuccess('');

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setResendSuccess('OTP resent successfully!');
      setResendTimer(60); 
      setExpiryTimer(60); // Reset expiry timer on resend
      
      // Clear success message after 5 seconds
      setTimeout(() => setResendSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Store verified OTP for reset page
      localStorage.setItem('verifiedOtp', otpString);
      navigate('/reset-password');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-fade-in transition-colors">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Verify OTP</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
          </p>
          
          {/* Expiry Timer */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-100 dark:border-amber-900/30">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${expiryTimer > 0 ? 'bg-amber-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${expiryTimer > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
            </span>
            {expiryTimer > 0 ? (
              <span>Code expires in {expiryTimer}s</span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-bold uppercase">Code Expired</span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-gray-100 transition-all"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        {/* Resend Logic / Back */}
        <div className="mt-8 text-center space-y-4">
          {resendSuccess && (
            <p className="text-xs text-emerald-500 font-medium animate-in fade-in slide-in-from-top-1">
              {resendSuccess}
            </p>
          )}
          
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {resendTimer > 0 ? (
              <span>Resend code in <span className="font-mono font-medium text-emerald-500">{resendTimer}s</span></span>
            ) : (
              <span>Didn't receive code? <span className="font-medium text-emerald-500 group-hover:underline">Resend</span></span>
            )}
          </button>
          <div>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

