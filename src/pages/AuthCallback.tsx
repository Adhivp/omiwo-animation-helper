import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback component mounted");
        console.log("Current hash:", window.location.hash);
        console.log("Current pathname:", window.location.pathname);
        
        // Get hash fragment from either URL or sessionStorage
        let hashFragment = location.hash || window.location.hash;
        const storedHash = sessionStorage.getItem('auth_hash');
        
        if (!hashFragment && storedHash) {
          console.log("Using stored hash fragment:", storedHash);
          hashFragment = storedHash.startsWith('#') ? storedHash : `#${storedHash}`;
          sessionStorage.removeItem('auth_hash');
        }
        
        if (hashFragment && !hashFragment.includes('access_token')) {
          console.log("Hash fragment doesn't contain access token:", hashFragment);
        }

        // Wait for auth to be processed
        setTimeout(async () => {
          try {
            // Refresh the user profile
            await refreshProfile();
            
            // Navigate based on whether user has a profile
            if (profile) {
              console.log("Profile found, redirecting to shop");
              navigate('/shop', { replace: true });
            } else if (user) {
              console.log("No profile found, redirecting to setup");
              navigate('/setup', { replace: true });
            } else {
              // If no user after waiting, redirect to login
              console.log("No user found after auth callback");
              navigate('/login', { replace: true });
            }
          } catch (refreshError) {
            console.error("Error in refresh/navigation:", refreshError);
            navigate('/login', { replace: true });
          }
        }, 1500); // Increased timeout for more reliable auth processing

      } catch (callbackError) {
        console.error('Error during auth callback:', callbackError);
        setError('Authentication failed. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, user, profile, refreshProfile, location.hash]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {error ? (
          <div className="text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
            <p className="text-gray-700 dark:text-gray-300">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">Completing your sign in</h2>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we redirect you...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;