import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/components/Header';
import { HeroSection } from '@/components/components/HeroSection';
import { LoginDialog } from '@/components/components/LoginDialog';
import { ModuleList } from '@/components/components/ModuleList';
import { Loader2 } from 'lucide-react';
import { LoginPageSkeleton } from '@/components/ui/skeleton-loader';

export default function NewLoginPageIntegrated() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { branding, isLoading: brandingLoading } = useBranding();
  const { toast } = useToast();

  // Apply dark theme on mount and clean up on unmount
  useEffect(() => {
    document.body.classList.add('new-login-theme');
    
    return () => {
      document.body.classList.remove('new-login-theme');
    };
  }, []);

  // Handle login dialog animation
  useEffect(() => {
    if (isLoginOpen) {
      setShowLoginDialog(true);
    } else {
      // Delay removing the dialog to allow fade-out animation
      const timer = setTimeout(() => setShowLoginDialog(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoginOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        toast({
          title: "Login Failed",
          description: result.error || 'Please check your credentials and try again.',
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        setIsLoginOpen(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton loader while branding is loading
  if (brandingLoading) {
    return <LoginPageSkeleton />;
  }

  return (
    <div className="new-login-theme min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="container mx-auto px-8 max-w-[1600px] py-[100px]">
        <div className="flex gap-8 items-center">
          <div className="flex-1 flex items-center">
            <HeroSection isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
          </div>
          
          <div className="w-[520px] flex-shrink-0">
            <ModuleList searchQuery={searchQuery} />
          </div>
        </div>
      </div>

      {/* Enhanced Login Dialog with Authentication - Positioned over modules box */}
      {showLoginDialog && (
        <div className={`fixed inset-0 z-50 flex items-center justify-end px-8 transition-opacity duration-300
          ${isLoginOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsLoginOpen(false)}
          />
          
          {/* Login dialog positioned at the right, matching module box size */}
          <div 
            className={`relative bg-card/95 backdrop-blur-lg rounded-2xl p-8 transition-all duration-500 ease-out mr-[calc((100vw-1600px)/2)]
              ${isLoginOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ width: '520px', height: '676px' }} // Same width as module box, height = 576px content + 100px padding
          >
            {/* Close button at top right */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors text-2xl w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-lg"
            >
              ✕
            </button>
            
            <div className="space-y-6 h-full flex flex-col justify-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Login to Dashboard</h2>
                <p className="text-muted-foreground">
                  Enter your credentials to access the system
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
