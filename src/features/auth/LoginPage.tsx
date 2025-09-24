import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types';
import { GraduationCap, Globe } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { PrivacyConsentModal } from './PrivacyConsentModal';

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [showConsent, setShowConsent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'Google' | 'Singpass' | null>(null);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme } = useThemeStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleProviderLogin = async (provider: 'Google' | 'Singpass') => {
    // Check if this is first time login (simulate)
    const hasConsented = localStorage.getItem('privacy-consent') === 'true';
    
    if (!hasConsented) {
      setPendingProvider(provider);
      setShowConsent(true);
      return;
    }

    await performLogin(provider);
  };

  const performLogin = async (provider: 'Google' | 'Singpass') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          roleOverride: selectedRole, // For demo purposes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.permissions);
        navigate('/', { replace: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // For demo purposes, show an alert
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentAccept = () => {
    localStorage.setItem('privacy-consent', 'true');
    setShowConsent(false);
    if (pendingProvider) {
      performLogin(pendingProvider);
      setPendingProvider(null);
    }
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    setPendingProvider(null);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const roles: Role[] = ['Student', 'Teacher', 'HOD', 'Principal', 'Admin'];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative z-10">
        <div className="flex-1 flex flex-col justify-center items-center text-white p-12">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-6 text-gradient">
            Digital Campus
          </h1>
          <p className="text-xl text-center text-white/90 mb-12">
            {t('login.title')}
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
            <p className="text-white/70 mb-4 font-medium">Demo Features:</p>
            <ul className="text-sm text-white/80 space-y-3 text-left max-w-sm">
              <li className="flex items-center"><span className="w-2 h-2 bg-white/60 rounded-full mr-3"></span>Multi-role access system</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-white/60 rounded-full mr-3"></span>Course management & enrollment</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-white/60 rounded-full mr-3"></span>Attendance & leave tracking</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-white/60 rounded-full mr-3"></span>Real-time messaging system</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-white/60 rounded-full mr-3"></span>Comprehensive analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Header controls */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="bg-white/80 backdrop-blur-sm hover:bg-white/90">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="bg-white/80 backdrop-blur-sm hover:bg-white/90">
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </div>

          <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
              <CardDescription className="text-gray-600">
                Choose your login provider to access the digital campus platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo role selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  {t('login.roleSwitch')}
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Login providers */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all"
                  onClick={() => handleProviderLogin('Google')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('login.google')}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all"
                  onClick={() => handleProviderLogin('Singpass')}
                  disabled={isLoading}
                >
                  <div className="w-5 h-5 mr-2 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    SP
                  </div>
                  {t('login.singpass')}
                </Button>
              </div>

              {/* Demo credentials info */}
              <div className="mt-6 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                <p className="text-xs text-gray-600 mb-3 font-medium">Demo Login Info:</p>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li><strong>Student:</strong> Alice Tan (S3-01)</li>
                  <li><strong>Teacher:</strong> Mr. Lee Wei Ming</li>
                  <li><strong>HOD:</strong> Ms. Ong Li Hua</li>
                  <li><strong>Principal:</strong> Dr. Lim Boon Keng</li>
                  <li><strong>Admin:</strong> Admin Bot</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        isOpen={showConsent}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    </div>
  );
};