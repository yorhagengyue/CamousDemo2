import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types';
import { Globe, Moon, Sun, ChevronDown, Info, Shield } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50/80 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950">

      {/* Top Right Controls - Enhanced */}
      <div className="absolute top-6 right-6 z-50 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLanguage} 
          className="h-10 px-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 dark:text-slate-300"
        >
          <Globe className="h-4 w-4 mr-2" strokeWidth={1.5} />
          <span className="text-sm font-medium">
            {i18n.language === 'en' ? 'English' : '中文'}
          </span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme} 
          className="h-10 w-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 dark:text-slate-300"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" strokeWidth={1.5} /> : <Sun className="h-4 w-4" strokeWidth={1.5} />}
        </Button>
      </div>

      {/* Refined Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-blue-500/8 via-indigo-400/4 to-transparent blur-3xl dark:from-blue-400/6 dark:via-indigo-400/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-violet-500/6 via-purple-400/3 to-transparent blur-3xl dark:from-violet-400/4 dark:via-purple-400/2"></div>
      </div>
      
      {/* Main Container - Enhanced 12 column grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 lg:grid lg:grid-cols-12 lg:gap-16 min-h-screen">
        
        {/* Left side - Branding & Features (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-center relative z-10 mb-16 lg:mb-0">
          {/* Enhanced Brand Header with layered design */}
          <div className="mb-20">
            {/* Government Brand Identity */}
            <div className="mb-10">
              <div className="flex items-center mb-8">
                <div className="relative w-20 h-20 mr-6">
                  {/* Main Logo Container */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(37,99,235,0.3)] border border-blue-500/20">
                    {/* Inner Design - Education Symbol */}
                    <div className="relative">
                      {/* Book/Building Icon */}
                      <div className="w-12 h-12 relative">
                        {/* Base structure */}
                        <div className="absolute inset-0 bg-white/20 rounded-lg"></div>
                        
                        {/* Digital Campus Icon - Layered Design */}
                        <div className="absolute inset-2 space-y-1">
                          {/* Top section - representing digital/screen */}
                          <div className="h-2 bg-white rounded-sm opacity-90"></div>
                          {/* Middle sections - representing building floors/levels */}
                          <div className="flex space-x-1">
                            <div className="flex-1 h-1.5 bg-white/80 rounded-sm"></div>
                            <div className="flex-1 h-1.5 bg-white/60 rounded-sm"></div>
                          </div>
                          <div className="flex space-x-1">
                            <div className="flex-1 h-1.5 bg-white/60 rounded-sm"></div>
                            <div className="flex-1 h-1.5 bg-white/80 rounded-sm"></div>
                          </div>
                          {/* Bottom section - foundation */}
                          <div className="h-1 bg-white/90 rounded-sm"></div>
                        </div>
                        
                        {/* Digital accent - small indicator */}
                        <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Official badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-50">
                    <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-normal mb-2">
                    Digital Campus
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="h-px w-8 bg-blue-600"></div>
                    <h2 className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-normal">
                      Ministry of Education, Singapore
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Government Mission Statement */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-6">
                <p className="text-xl lg:text-2xl text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed font-normal">
                  Secure, unified access to Singapore's national digital education infrastructure.
                </p>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">Centralized Authentication</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Single sign-on access across all MOE digital services and educational platforms
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">Role-based Permissions</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Appropriate access levels for students, educators, and administrative staff
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">Comprehensive Management</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Integrated tools for curriculum delivery, assessment, and administrative functions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Government Notice Card */}
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/40 shadow-lg max-w-lg">
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Official Government Portal
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This is an official digital service provided by the Ministry of Education, Singapore.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Secure Access</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Government-grade security standards</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Data Protection</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">PDPA compliance and privacy protection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">24/7 Availability</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Round-the-clock system accessibility</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    For technical support, contact MOE IT Service Desk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced Login Card (lg:col-span-5 lg:col-start-8) */}
        <div className="lg:col-span-5 lg:col-start-8 flex items-center justify-center relative z-10">
          <div className="w-full max-w-lg">
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 shadow-[0_32px_64px_rgba(2,6,23,0.12)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] rounded-3xl transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_40px_80px_rgba(2,6,23,0.16)]">
              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Sign In
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-3 text-base leading-relaxed">
                  Access your digital campus account securely
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-10 pb-10 space-y-8">

                {/* Welcome Message */}
                <div className="text-center space-y-3">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Sign in with your institutional account or government-issued digital identity
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Secure • Fast • Reliable</span>
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced SSO Providers */}
                <div className="space-y-4">
                  {/* Google Button - Enhanced */}
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/60 active:scale-[0.99] shadow-sm hover:shadow-md rounded-2xl"
                    onClick={() => handleProviderLogin('Google')}
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-base">Sign in with Google</span>
                  </Button>

                  {/* Singpass Button - Enhanced */}
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-slate-700 dark:border-slate-600 hover:border-slate-600 dark:hover:border-slate-500 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-slate-500/60 active:scale-[0.99] shadow-lg hover:shadow-xl rounded-2xl"
                    onClick={() => handleProviderLogin('Singpass')}
                    disabled={isLoading}
                  >
                    <span className="font-semibold text-base">Sign in with Singpass</span>
                  </Button>
                </div>

                {/* Enhanced Security Notice */}
                <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/40">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Secure Authentication</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                      Your identity is verified through Singapore's trusted digital identity infrastructure. 
                      All sessions are encrypted and monitored for security.
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>SSL Encrypted</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>NRIC Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Footer */}
                <div className="pt-6 border-t border-slate-200/60 dark:border-slate-700/40">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center space-x-6 text-xs">
                      <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Privacy Policy</a>
                      <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Terms of Service</a>
                      <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Help Center</a>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-xs text-slate-400 font-medium">Government Technology Agency</span>
                    </div>
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