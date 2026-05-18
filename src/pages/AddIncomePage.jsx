import { useState } from 'react';
import { Check, IndianRupee, Briefcase, Coins, Gift, TrendingUp, Wallet, Banknote, CreditCard, Smartphone, Landmark, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SelectBox } from '@/components/ui/select-box';
import { useNavigate } from '@/lib/router';
import { createTransaction } from '@/lib/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const incomeTypes = [
  { id: 'salary', label: 'Salary', icon: Briefcase, color: 'text-blue-600' },
  { id: 'side_income', label: 'Side Income', icon: Coins, color: 'text-emerald-600' },
  { id: 'freelance', label: 'Freelance', icon: TrendingUp, color: 'text-purple-600' },
  { id: 'investment', label: 'Investment', icon: Wallet, color: 'text-amber-600' },
  { id: 'gift', label: 'Gift / Bonus', icon: Gift, color: 'text-rose-600' },
  { id: 'other', label: 'Other', icon: Wallet, color: 'text-gray-600' },
];

const incomeTypeOptions = incomeTypes.map((type) => ({
  value: type.id,
  label: type.label,
}));

const paymentModes = [
  { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-emerald-600' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, color: 'text-blue-600' },
  { id: 'debit_card', label: 'Debit Card', icon: CreditCard, color: 'text-indigo-600' },
  { id: 'upi', label: 'UPI / Digital', icon: Smartphone, color: 'text-purple-600' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Landmark, color: 'text-amber-600' },
];

const categoryMap = {
  'salary': 'Salary',
  'side_income': 'Side Income',
  'freelance': 'Freelance',
  'investment': 'Investment',
  'gift': 'Gift',
  'other': 'Other',
};

const categoryIconMap = {
  'salary': 'briefcase',
  'side_income': 'coins',
  'freelance': 'trending-up',
  'investment': 'wallet',
  'gift': 'gift',
  'other': 'wallet',
};

export function AddIncomePage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [incomeType, setIncomeType] = useState('');
  const [paymentMode, setPaymentMode] = useState('bank_transfer');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    if (!incomeType) {
      newErrors.incomeType = 'Please select an income type';
    }
    const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    } else if (wordCount > 10) {
      newErrors.description = 'Description cannot exceed 10 words';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createTransaction({
        description: description.trim(),
        amount: Number(amount),
        date,
        category: categoryMap[incomeType] || 'Other',
        type: 'income',
        icon: categoryIconMap[incomeType] || 'wallet',
        paymentMode,
        status: 'completed',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving income:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Add New Income</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Record your income sources to track your earnings.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-6">

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          {/* Amount */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                className={cn(
                  'h-14 pl-12 pr-4 text-2xl font-semibold w-full rounded-lg border bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all',
                  errors.amount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500'
                )}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Date + Income Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors({ ...errors, date: null });
                  }}
                  className={cn(
                    'h-12 w-full pl-10 pr-4 border rounded-lg text-sm bg-transparent dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all',
                    errors.date
                      ? 'border-destructive focus:ring-destructive/20'
                      : 'border-input dark:border-gray-700 hover:border-ring/60 focus:ring-ring/50'
                  )}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(date)}</p>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Income Type <span className="text-red-500">*</span>
              </Label>
              <SelectBox
                value={incomeType}
                onChange={(val) => {
                  setIncomeType(val);
                  if (errors.incomeType) setErrors({ ...errors, incomeType: null });
                }}
                options={incomeTypeOptions}
                placeholder="Select income type"
                error={errors.incomeType}
              />
              {errors.incomeType && (
                <p className="text-red-500 text-sm mt-1">{errors.incomeType}</p>
              )}
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Payment Mode <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {paymentModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer',
                      paymentMode === mode.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-7 h-7',
                        paymentMode === mode.id ? mode.color : 'text-gray-400'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        paymentMode === mode.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-400'
                      )}
                    >
                      {mode.label}
                    </span>
                    {paymentMode === mode.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              className={cn(
                'min-h-[100px] w-full px-4 py-3 border rounded-lg text-gray-700 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none',
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500'
              )}
              placeholder="Enter description..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {description.trim().split(/\s+/).filter(w => w.length > 0).length}/10 words
            </p>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Income
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

