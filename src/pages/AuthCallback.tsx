import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback component mounted");
        
        // Check if we have stored a hash fragment in sessionStorage from auth.html
        const storedHash = sessionStorage.getItem('auth_hash');
        if (storedHash) {
          console.log("Found stored hash fragment, applying to window.location");
          
          // Remove it from sessionStorage to prevent reuse
          sessionStorage.removeItem('auth_hash');
          
          // Apply the hash manually to the current location
          // This is a workaround for SPA routing
          if (typeof window !== 'undefined' && !window.location.hash) {
            window.location.hash = storedHash.startsWith('#') ? storedHash : `#${storedHash}`;
            
            // Wait a moment to allow Supabase to process the hash
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // Attempt to exchange the token directly
        try {
          await supabase.auth.getUser();
          console.log("getUser completed");
        } catch (getUserError) {
          console.error("Error in getUser:", getUserError);
        }
        
        // Attempt to get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.error("No session found");
          
          // Try several times with increasing delay
          for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`Retry attempt ${attempt} to get session...`);
            
            // Wait with increasing delay (500ms, 1000ms, 2000ms)
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
            
            // Try again
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            
            if (retrySession) {
              console.log("Successfully retrieved session on retry attempt", attempt);
              
              // Check if user profile exists
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', retrySession.user.id)
                .single();
                
              if (profile) {
                console.log("Profile found, redirecting to shop");
                navigate('/shop', { replace: true });
                return;
              } else {
                console.log("No profile found, redirecting to setup");
                navigate('/setup', { replace: true });
                return;
              }
            }
          }
          
          throw new Error('No session found after multiple attempts');
        }

        // Check if user profile exists
        console.log("Session found, checking for profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        // Handle profile query errors (except "no rows returned")
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Profile error:", profileError);
        }

        // Redirect based on whether user has a profile
        if (profile) {
          console.log("Profile found, redirecting to shop");
          navigate('/shop', { replace: true });
        } else {
          console.log("No profile found, redirecting to setup");
          navigate('/setup', { replace: true });
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('Authentication failed. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

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