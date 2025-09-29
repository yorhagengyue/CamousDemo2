import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  User, 
  LogOut,
  Settings as SettingsIcon,
  UserCog,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import type { Role } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      logout(); // Logout anyway for demo
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleRoleSwitch = async (newRole: Role) => {
    if (!user) return;
    
    setIsRoleSwitching(true);
    try {
      // Simulate role switching API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'Google', // Keep same provider
          roleOverride: newRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.permissions);
        // Refresh the page to load new role's content
        window.location.reload();
      }
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsRoleSwitching(false);
    }
  };

  const availableRoles: Role[] = ['Student', 'Teacher', 'HOD', 'Principal', 'Admin'];

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Role Switch Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                disabled={isRoleSwitching}
              >
                {isRoleSwitching ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserCog className="h-4 w-4 mr-2" />
                )}
                <span className="text-xs font-medium">
                  {user?.roles[0] || 'Student'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-900 dark:text-white">Switch Role (Demo)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Experience different dashboards</p>
              </div>
              {availableRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  disabled={user?.roles.includes(role) || isRoleSwitching}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">{role}</span>
                    {user?.roles.includes(role) && (
                      <span className="text-xs text-green-600 font-medium">Current</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Language toggle */}
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                {t('common.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
