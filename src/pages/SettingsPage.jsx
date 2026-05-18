import { useState, useRef } from 'react';
import { Camera, Moon, Trash2, Lock, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from '@/lib/router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatar, changePassword, deleteAccount, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileMessage('');
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      await updateProfile({
        name: profileForm.firstName + ' ' + profileForm.lastName,
        phone: profileForm.phone,
        address: profileForm.address,
      });
      setProfileMessage('Profile updated successfully!');
    } catch (err) {
      setProfileMessage(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateAvatar(reader.result);
      } catch (err) {
        alert(err.message || 'Failed to update avatar');
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordMessage('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteMessage('');
    if (!deletePassword) {
      setDeleteMessage('Please enter your password');
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      logout();
      navigate('/');
    } catch (err) {
      setDeleteMessage(err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profile Settings</h1>
      </header>

      {/* Profile Avatar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar || `https://i.pravatar.cc/150?u=${user?._id || 'default'}`}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600"
            />
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            {isUploadingAvatar && <p className="text-sm text-emerald-600 mt-1">Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
          <Button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isSavingProfile ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {profileMessage && (
          <p className={profileMessage.includes('success') ? 'text-sm mb-4 text-emerald-600' : 'text-sm mb-4 text-red-500'}>
            {profileMessage}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">First Name</Label>
            <Input
              value={profileForm.firstName}
              onChange={(e) => handleProfileChange('firstName', e.target.value)}
              className="h-11 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Last Name</Label>
            <Input
              value={profileForm.lastName}
              onChange={(e) => handleProfileChange('lastName', e.target.value)}
              className="h-11 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Email Address</Label>
            <Input
              type="email"
              value={user?.email || ''}
              className="h-11 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300"
              readOnly
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</Label>
            <Input
              value={profileForm.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="h-11 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="+1 (555) 012-3456"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Address</Label>
            <Input
              value={profileForm.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              className="h-11 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="1234 Innovation Dr, Tech City, CA 90210"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change Password</h3>
        </div>

        {passwordMessage && (
          <p className={passwordMessage.includes('success') ? 'text-sm mb-4 text-emerald-600' : 'text-sm mb-4 text-red-500'}>
            {passwordMessage}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="h-11 pr-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">New Password</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="h-11 pr-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Confirm New Password</Label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="h-11 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="Confirm new password"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isChangingPassword}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>

      {/* Logout Session */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Session</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Logout from your current session</p>
            </div>
          </div>
          <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red-500" />
                  Confirm Logout
                </DialogTitle>
                <DialogDescription className="py-4">
                  Are you sure you want to log out of your session? You will need to sign in again to access your data.
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
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. All your data will be permanently removed.
        </p>

        {!showDeleteConfirm ? (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            Delete Account
          </Button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            {deleteMessage && (
              <p className="text-sm text-red-500">{deleteMessage}</p>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Enter your password to confirm
              </Label>
              <div className="relative">
                <Input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="h-11 pr-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                  setDeleteMessage('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

