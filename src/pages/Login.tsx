import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ThreeScene from '../components/ThreeScene';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        
        // Check if user profile exists
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // If the user has a profile, redirect to shop
          if (profile) {
            navigate('/shop');
          } else {
            // If no profile, redirect to setup
            navigate('/setup');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };
    
    checkUser();
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [navigate]);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // Get the site URL from environment variable or fallback to window.location.origin
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`
        }
      });
      
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated but waiting for redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene 
          animationType="wave" 
          color="#3b82f6" 
          mousePosition={mousePosition}
        />
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-white/70 z-0"></div>
      
      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
          <ScrollReveal>
            <h1 className="text-3xl font-bold text-white">Welcome to OMIWO</h1>
            <p className="text-blue-100 mt-2">Sign in to continue</p>
          </ScrollReveal>
        </div>
        
        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-center ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {message.text}
            </div>
          )}
          
          <ScrollReveal delay={100}>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <p className="mt-8 text-center text-sm text-gray-500">
              By continuing, you agree to OMIWO's{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Login;