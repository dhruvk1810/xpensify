import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';

// ── Mock data mirrors the real dashboard ─────────────────────────────────────
const MONTHLY_DATA = [
  { name: 'Jan', income: 52000, expense: 31000 },
  { name: 'Feb', income: 48000, expense: 27000 },
  { name: 'Mar', income: 61000, expense: 38000 },
  { name: 'Apr', income: 55000, expense: 29000 },
  { name: 'May', income: 67000, expense: 41000 },
  { name: 'Jun', income: 72000, expense: 35000 },
];

const CATEGORIES = [
  { name: 'Food & Drink', value: 13120, color: '#EC4899' },
  { name: 'Shopping',     value: 9840,  color: '#8B5CF6' },
  { name: 'Groceries',    value: 8200,  color: '#10B981' },
  { name: 'Transport',    value: 5740,  color: '#EF4444' },
  { name: 'Healthcare',   value: 4100,  color: '#6366F1' },
];

const TOTAL_EXPENSE = CATEGORIES.reduce((s, c) => s + c.value, 0);

// ── Mini Spending Bar Chart ───────────────────────────────────────────────────
function MiniSpendingChart() {
  const maxVal = Math.max(...MONTHLY_DATA.map(d => Math.max(d.income, d.expense)));
  const totalIncome  = MONTHLY_DATA.reduce((s, d) => s + d.income, 0);
  const totalExpense = MONTHLY_DATA.reduce((s, d) => s + d.expense, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-3.5 sm:p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">Spending Trends</p>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Income vs Expense analysis</p>
          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 bg-gray-50 dark:bg-gray-950/60 px-2 sm:px-2.5 py-1 rounded-lg self-start">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-gray-400 uppercase tracking-wider font-bold text-[8px] sm:text-[9px]">Income</span>
              <span className="font-bold text-emerald-500">₹{(totalIncome/1000).toFixed(0)}k</span>
            </span>
            <span className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
            <span className="flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-gray-400 uppercase tracking-wider font-bold text-[8px] sm:text-[9px]">Expense</span>
              <span className="font-bold text-rose-500">₹{(totalExpense/1000).toFixed(0)}k</span>
            </span>
          </div>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-900/80 rounded-lg p-0.5 text-[9px] sm:text-[10px] font-bold gap-0.5">
          {['week','month','year'].map((r, i) => (
            <span key={r} className={`px-2 py-0.5 sm:py-1 rounded-md ${i === 2 ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400'}`}>{r}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-2 text-[9px] sm:text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Income</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" />Expense</span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5 sm:gap-2 pt-2 pb-1">
        {MONTHLY_DATA.map((d) => {
          const incH = Math.round((d.income / maxVal) * 100);
          const expH = Math.round((d.expense / maxVal) * 100);
          return (
            <div key={d.name} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1" style={{ height: 86 }}>
                <div
                  className="flex-1 rounded-t-[3px] transition-all hover:opacity-85"
                  style={{ height: `${incH}%`, background: 'linear-gradient(to top, #059669, #10B981)' }}
                  title={`Income: ₹${d.income}`}
                />
                <div
                  className="flex-1 rounded-t-[3px] transition-all hover:opacity-85"
                  style={{ height: `${expH}%`, background: 'linear-gradient(to top, #E11D48, #F43F5E)' }}
                  title={`Expense: ₹${d.expense}`}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-gray-400">{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mini Category Donut Chart ─────────────────────────────────────────────────
function MiniCategoryChart() {
  const size   = 96;
  const r      = 34;
  const stroke = 14;
  const circ   = 2 * Math.PI * r;

  let offset = 0;
  const segments = CATEGORIES.map((cat) => {
    const pct  = cat.value / TOTAL_EXPENSE;
    const dash = pct * circ;
    const gap  = circ - dash;
    const seg  = { ...cat, dash, gap, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-3.5 sm:p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">Spending by Category</p>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Expense distributions</p>
          <div className="flex items-center gap-3 mt-1.5 bg-gray-50 dark:bg-gray-950/60 px-2 sm:px-2.5 py-1 rounded-lg">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-gray-400 uppercase tracking-wider font-bold text-[8px] sm:text-[9px]">Expense</span>
              <span className="font-bold text-rose-500">₹{(TOTAL_EXPENSE/1000).toFixed(0)}k</span>
            </span>
          </div>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-900/80 rounded-lg p-0.5 text-[9px] sm:text-[10px] font-bold gap-0.5">
          {['week','month','year'].map((r, i) => (
            <span key={r} className={`px-2 py-0.5 sm:py-1 rounded-md ${i === 0 ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-400'}`}>{r}</span>
          ))}
        </div>
      </div>

      {/* Donut + List */}
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        {/* SVG Donut */}
        <div className="relative shrink-0 my-1 sm:my-0" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
                style={{ transform: 'rotate(-90deg)', transformOrigin: `${size/2}px ${size/2}px` }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Total</span>
            <span className="text-xs font-black text-gray-900 dark:text-gray-100">₹{(TOTAL_EXPENSE/1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Category list with progress bars */}
        <div className="flex flex-col gap-1.5 sm:gap-2 flex-1 w-full">
          {CATEGORIES.map((cat) => {
            const pct = Math.round((cat.value / TOTAL_EXPENSE) * 100);
            return (
              <div key={cat.name} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{cat.name}</span>
                    <span className="font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[8px]">{pct}%</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 shrink-0 ml-2">₹{(cat.value/1000).toFixed(1)}k</span>
                </div>
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Hero Component ────────────────────────────────────────────────────────────
export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight tracking-tight animate-slide-up">
          Master Your Finances with
          <br />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Confidence and Clarity
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto animate-slide-up transition-colors"
          style={{ animationDelay: '100ms' }}
        >
          Track daily expenses, visualize spending habits, and stick to your budget effortlessly.
          Join thousands of users achieving financial freedom today.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-emerald-500/20"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 h-12 text-base font-semibold border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            View Demo
          </Button>
        </div>

        {/* ── Dashboard Preview ── */}
        <div
          className="relative max-w-5xl mx-auto animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-blue-500/20 rounded-3xl blur-xl opacity-70 pointer-events-none -z-10" />

          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden transition-all text-left">
            {/* Browser / Device Chrome Header */}
            <div className="bg-gray-900 px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 border-b border-gray-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/90" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/90" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/90" />
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-gray-800/80 border border-gray-700/60 rounded-lg px-3 py-1 max-w-[210px] sm:max-w-xs w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs text-gray-300 font-mono truncate">expensify.com/dashboard</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span>Live View</span>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-3.5 sm:p-5 md:p-6 bg-gray-50/80 dark:bg-gray-950 transition-colors">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-3.5 sm:mb-4">
                {[
                  { label: 'Total Balance',  value: '₹1,24,500', change: '+2.5%', up: true },
                  { label: 'Total Income',   value: '₹72,000',   change: '+12%',  up: true },
                  { label: 'Total Expenses', value: '₹41,000',   change: '+4.3%', up: false },
                  { label: 'Savings',        value: '₹31,000',   change: '+8%',   up: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-sm border border-gray-100 dark:border-gray-800/90 transition-all hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium truncate">{stat.label}</p>
                    <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{stat.value}</p>
                    <p className={`text-[9px] sm:text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      <span>{stat.up ? '↑' : '↓'}</span>
                      <span>{stat.change}</span>
                      <span className="text-gray-400 dark:text-gray-500 font-normal hidden sm:inline">this month</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts Row — 1 column on mobile, 2 columns on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                <MiniSpendingChart />
                <MiniCategoryChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
