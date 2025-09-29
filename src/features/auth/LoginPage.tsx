import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types';
import { GraduationCap, Globe, Moon, Sun, ChevronDown, Info, Shield } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { PrivacyConsentModal } from './PrivacyConsentModal';

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [showConsent, setShowConsent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'Google' | 'Singpass' | null>(null);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Demo Badge */}
      <div className="absolute top-4 left-4 z-50">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
          <Info className="w-3 h-3 mr-1" />
          Demo Mode
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLanguage} 
          className="h-10 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {i18n.language === 'en' ? 'EN' : '中文'}
          </span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme} 
          className="h-10 w-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      {/* Background decoration - reduced opacity */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse dark:opacity-20"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000 dark:opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-500 dark:opacity-20"></div>
      </div>
      
      {/* Main Container - 12 column grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:grid lg:grid-cols-12 lg:gap-10 min-h-screen">
        
        {/* Left side - Branding & Features (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-center relative z-10 mb-16 lg:mb-0">
          {/* Brand Header */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-[0_20px_60px_rgba(2,6,23,.12)]">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                  Digital Campus
                </h1>
                <h2 className="text-xl text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Unified Portal Login
                </h2>
              </div>
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed">
              Secure access to Singapore's integrated digital campus ecosystem with identity verification and role-based permissions.
            </p>
          </div>

          {/* Demo Features Card - Glass effect */}
          <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(2,6,23,.12)] max-w-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Demo Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm">Multi-role access control system</span>
              </li>
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm">Course management & enrollment</span>
              </li>
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm">Attendance & leave tracking</span>
              </li>
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm">Real-time messaging & analytics</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Login Card (lg:col-span-5 lg:col-start-8) */}
        <div className="lg:col-span-5 lg:col-start-8 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md">
            <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(2,6,23,.12)] rounded-2xl transform transition-all duration-200 hover:translate-y-[-2px]">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  Choose your identity provider to continue
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Segmented Control for Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Demo Role Selection
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {['Student', 'Teacher', 'HOD'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role as Role)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                          selectedRole === role
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {['Principal', 'Admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role as Role)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                          selectedRole === role
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Continue with</span>
                  </div>
                </div>

                {/* SSO Providers */}
                <div className="space-y-3">
                  {/* Google Button */}
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 hover:scale-[0.98]"
                    onClick={() => handleProviderLogin('Google')}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Continue with Google</span>
                  </Button>

                  {/* Singpass Button */}
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-500/60 hover:scale-[0.98]"
                    onClick={() => handleProviderLogin('Singpass')}
                    disabled={isLoading}
                  >
                    <div className="w-6 h-6 mr-3 bg-white rounded flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">SP</span>
                    </div>
                    <span className="font-medium">Continue with Singpass</span>
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className="flex items-start space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <Shield className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Only used for identity verification. No personal data will be accessed or stored.
                  </p>
                </div>

                {/* Collapsible Demo Info */}
                <div>
                  <button
                    onClick={() => setShowDemoInfo(!showDemoInfo)}
                    className="flex items-center justify-between w-full text-left p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Demo Accounts
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDemoInfo ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDemoInfo && (
                    <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50 transform transition-all duration-200">
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                        <li><strong className="text-slate-900 dark:text-white">Student:</strong> Alice Tan (S3-01)</li>
                        <li><strong className="text-slate-900 dark:text-white">Teacher:</strong> Mr. Lee Wei Ming</li>
                        <li><strong className="text-slate-900 dark:text-white">HOD:</strong> Ms. Ong Li Hua</li>
                        <li><strong className="text-slate-900 dark:text-white">Principal:</strong> Dr. Lim Boon Keng</li>
                        <li><strong className="text-slate-900 dark:text-white">Admin:</strong> Admin Bot</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Links */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-center space-x-4 text-xs">
                    <a href="#" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <a href="#" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
                  </div>
                  <div className="flex justify-center mt-2">
                    <span className="text-xs text-slate-400">Powered by GovTech Singapore</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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