import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ScrollReveal from './ScrollReveal';

const GetStarted = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Initialize Supabase client - replace with your actual Supabase URL and anon key
  const supabaseUrl = "https://gxwxiaqxtorxxiikfovn.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d3hpYXF4dG9yeHhpaWtmb3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjgyNTMsImV4cCI6MjA1OTMwNDI1M30.Y2fyJ6PfOLxlIJr0F9IDb34ONMjLLbjTO6SksotZh7Y";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: 'Please enter your email address', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ 
          text: 'Check your email for the login link!', 
          type: 'success' 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        text: 'An unexpected error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        text: 'An unexpected error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-20">
      <div className="container max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-blue-100">Join OMIWO for premium cleaning solutions</p>
            </ScrollReveal>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* Message alert */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-center ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {message.text}
              </div>
            )}
            
            <ScrollReveal delay={100}>
              {/* OAuth Providers */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => handleProviderSignIn('google')}
                  disabled={loading}
                  className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
                
                <button
                  onClick={() => handleProviderSignIn('apple')}
                  disabled={loading}
                  className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                  Continue with Apple
                </button>
                
                <button
                  onClick={() => handleProviderSignIn('facebook')}
                  disabled={loading}
                  className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300}>
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="liquid-button group relative overflow-hidden bg-blue-600 hover:bg-blue-700 w-full shadow-lg"
                >
                  <span className="relative z-10 text-white transition-colors font-medium px-6 py-3 block w-full">
                    {loading ? 'Processing...' : 'Continue with Email'}
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>
            </ScrollReveal>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
            <ScrollReveal delay={400}>
              <p className="text-sm text-gray-600">
                By continuing, you agree to OMIWO's 
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">Terms of Service</a> and 
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">Privacy Policy</a>
              </p>
            </ScrollReveal>
          </div>
        </div>
        
        {/* Alternative actions */}
        <ScrollReveal delay={500}>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default GetStarted;