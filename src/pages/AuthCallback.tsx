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
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log to help with debugging
        console.log("Starting auth callback processing");
        
        // Get the session from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.error("No session found");
          throw new Error('No session found');
        }

        console.log("Found active session, checking for profile");

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        // Handle true errors (not "no rows returned")
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Profile error:", profileError);
          throw profileError;
        }

        setProcessingComplete(true);
        
        // Redirect based on whether user has a profile
        if (profile) {
          console.log("Profile found, redirecting to shop");
          navigate('/shop');
        } else {
          console.log("No profile found, redirecting to setup");
          navigate('/setup');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('Authentication failed. Please try again.');
        setProcessingComplete(true);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    if (!processingComplete) {
      handleAuthCallback();
    }
  }, [navigate, processingComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {error ? (
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium mb-2">Completing your sign in</h2>
            <p className="text-gray-500">Please wait while we redirect you...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;