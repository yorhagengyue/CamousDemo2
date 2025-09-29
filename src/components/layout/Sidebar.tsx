import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  FlaskConical as Flask,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { path: '/', icon: Home, label: 'navigation.dashboard' },
  { path: '/messages', icon: MessageSquare, label: 'navigation.messages' },
  { path: '/students', icon: GraduationCap, label: 'navigation.students', roles: ['Teacher', 'HOD', 'Principal', 'Admin'] },
  { path: '/teachers', icon: Users, label: 'navigation.teachers', roles: ['HOD', 'Principal', 'Admin'] },
  { path: '/courses', icon: BookOpen, label: 'navigation.courses' },
  { path: '/enrolment', icon: Calendar, label: 'navigation.enrollment', roles: ['Student', 'Teacher', 'HOD'] },
  { path: '/attendance', icon: UserCheck, label: 'navigation.attendance' },
  { path: '/calendar', icon: Calendar, label: 'navigation.calendar' },
  { path: '/leave', icon: FileText, label: 'navigation.leaves' },
  { path: '/reports', icon: BarChart3, label: 'navigation.reports', roles: ['HOD', 'Principal', 'Admin'] },
  { path: '/admin', icon: Settings, label: 'navigation.admin', roles: ['Admin'] },
  { path: '/settings', icon: Settings, label: 'navigation.settings' },
  { path: '/labs', icon: Flask, label: 'navigation.labs' },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    if (!user) return false;
    return user.roles.some(role => item.roles?.includes(role));
  });

  return (
    <div className={cn(
      "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60 border-r border-gray-200 transition-all duration-300 flex flex-col dark:border-gray-800",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and collapse button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-7 w-7 text-gradient" />
            <span className="font-semibold text-base">Digital Campus</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-600 dark:text-gray-400",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? t(item.label) : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{t(item.label)}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.roles.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
