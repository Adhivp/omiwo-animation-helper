import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ThreeScene from '../components/ThreeScene';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  preferred_language: string;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, profile: authProfile, isLoading, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('personal'); // Track active section for mobile
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    product_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>>([]);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }
    
    // Set profile once it's available from auth context
    if (authProfile) {
      setProfile(authProfile as UserProfile);
      setEditedProfile(authProfile as UserProfile);
      
      // Fetch recent orders
      const fetchOrders = async () => {
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('id, product_name, total_amount, status, created_at')
            .eq('user_id', authProfile.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (ordersError) {
            console.error('Error fetching recent orders:', ordersError);
          } else {
            setRecentOrders(ordersData || []);
          }
        } catch (error) {
          console.error('Error in order fetch:', error);
        }
      };
      
      fetchOrders();
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [user, authProfile, isLoading, navigate]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to original profile data
    if (profile) {
      setEditedProfile(profile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setEditedProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    if (!user || !editedProfile) return;

    try {
      setSaving(true);
      setMessage({ text: '', type: '' });

      const { error } = await supabase
        .from('profiles')
        .update({
          ...editedProfile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state and refresh in auth context
      await refreshProfile();
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          ...editedProfile,
          updated_at: new Date().toISOString()
        };
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setEditing(false);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ text: `Error: ${error.message || 'Failed to update profile'}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Shipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500 dark:border-blue-400"></div>
          <span className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ top: '60px', zIndex: 0 }}>
          <div className="h-72 w-full">
            <ThreeScene 
              animationType="wave" 
              color={theme === 'dark' ? "#4f46e5" : "#3b82f6"} 
              mousePosition={mousePosition}
              isHovered={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-gray-900/60 dark:to-gray-900" style={{ top: '50px' }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10 mb-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center space-x-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-400 dark:from-indigo-600 dark:to-purple-500 rounded-2xl shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{profile?.full_name}</h1>
                    <p className="text-foreground/70">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {!editing && (
                    <button
                      onClick={handleEdit}
                      className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Profile content here... */}
          {/* This part is omitted for brevity but would display the rest of the profile page */}
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;