import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { PrincipalDashboard } from './PrincipalDashboard';
import { AdminDashboard } from './AdminDashboard';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  // Determine dashboard based on primary role
  const primaryRole = user.roles[0];

  const renderDashboard = () => {
    switch (primaryRole) {
      case 'Student':
        return <StudentDashboard user={user} />;
      case 'Teacher':
      case 'HOD':
        return <TeacherDashboard user={user} />;
      case 'Principal':
        return <PrincipalDashboard user={user} />;
      case 'Admin':
        return <AdminDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome', { name: user.name })}
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};
