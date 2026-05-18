import { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  List,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  PieChart,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavLink, useLocation, useNavigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add-expense', label: 'Add Expense', icon: PlusCircle },
  { path: '/add-income', label: 'Add Income', icon: TrendingUp },
  { path: '/transactions', label: 'Transactions', icon: List },
  { path: '/analytics', label: 'Reports', icon: BarChart3 },
  { path: '/budget', label: 'Budget', icon: Wallet },
];

const bottomNavItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {isMobileOpen ? <X className="w-5 h-5 dark:text-gray-100" /> : <Menu className="w-5 h-5 dark:text-gray-100" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-emerald-50/80 dark:bg-gray-900/95 backdrop-blur-sm border-r border-emerald-100/50 dark:border-gray-700',
          'flex flex-col transition-transform duration-300 ease-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">Expensify</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-100/50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 space-y-1 border-t border-emerald-100 dark:border-gray-700">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-100/50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}

          {/* User Profile */}
          {user && (
            <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-gray-700">
              <div className="flex items-center gap-3 px-3 py-2">
                <img
                  src={user.avatar || `https://i.pravatar.cc/150?u=${user._id || 'default'}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-500" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to log out of your account? You will need to sign in again to access your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 sm:flex-none border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false);
                logout();
                navigate('/');
              }}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
