import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/contexts/BrandingContext";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { branding, isLoading } = useBranding();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-purple-300 via-purple-200 to-blue-200 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Crying Emoji */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🥺</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          Error 404
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-white mb-8 drop-shadow-md">
          Oops, something went wrong
        </p>

        {/* Branding Info (subtle) */}
        {!isLoading && branding && (
          <div className="mb-8 opacity-60">
            <p className="text-sm text-white/80">
              {branding.dashboard_title || 'ISKA - RMS'}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleGoToDashboard}
          className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg border-0"
          style={{
            background: branding?.primary_color ? `${branding.primary_color}CC` : '#60A5FA',
            '--tw-shadow': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          } as React.CSSProperties}
        >
          <Home className="w-4 h-4 mr-2" />
          Go back home
        </Button>

        {/* Debug Info (hidden by default, can be shown on hover) */}
        <div className="mt-8 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs text-white/60 font-mono">
            {location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
