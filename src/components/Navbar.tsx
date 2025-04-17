import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import GoldCoinDraw from './GoldCoinDraw';
import { ThemeToggle } from '@/components/theme-toggle';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [goldDrawOpen, setGoldDrawOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session) {
        setUser(session.user);
        
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    window.addEventListener('scroll', handleScroll);
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        // Fetch user profile
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent dark:bg-transparent py-6'
      )}
    >
      <div className="container-padding flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-gradient">OMIWO</a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#products" className="text-foreground/80 hover:text-foreground transition-colors">Products</a>
          {user && (
            <Link to="/shop" className="text-foreground/80 hover:text-foreground transition-colors">Shop</Link>
          )}
          <a href="/#about" className="text-foreground/80 hover:text-foreground transition-colors">About</a>
          <a href="/#contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</a>
          
          <button 
            onClick={() => setGoldDrawOpen(true)} 
            className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" fill="#FFD700" strokeWidth="0"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#B8860B" d="M12 6v12M8 12h8"/>
            </svg>
            <span>Win Gold Coin</span>
          </button>
          
          <ThemeToggle />

          {loading ? (
            <div className="w-8 h-8 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 py-2 px-3 rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-100">{profile?.full_name ? profile.full_name.split(' ')[0] : 'Account'}</span>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700">My Profile</Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="liquid-button">
              <span className="relative z-10">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-40 transition-all duration-300 ease-in-out flex flex-col justify-center items-center space-y-8 pt-16',
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <a 
          href="#products" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          Products
        </a>
        {user && (
          <Link 
            to="/shop" 
            className="text-xl font-medium text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </Link>
        )}
        <a 
          href="#about" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          About
        </a>
        <a 
          href="#contact" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </a>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setGoldDrawOpen(true);
          }}
          className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" fill="#FFD700" strokeWidth="0"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#B8860B" d="M12 6v12M8 12h8"/>
          </svg>
          Win Gold Coin
        </button>
        
        <div className="flex items-center justify-center my-4">
          <ThemeToggle />
          <span className="ml-3 text-sm text-muted-foreground">Toggle theme</span>
        </div>

        {user ? (
          <>
            <Link 
              to="/profile" 
              className="px-6 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </Link>
            <button 
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="px-6 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="liquid-button mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="relative z-10">Sign In</span>
          </Link>
        )}
      </div>

      {/* Gold Coin Draw Dialog */}
      <GoldCoinDraw open={goldDrawOpen} onOpenChange={setGoldDrawOpen} />
    </nav>
  );
};

export default Navbar;
