import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ThreeScene from '../components/ThreeScene';
import { useTheme } from 'next-themes';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        navigate('/login');
        return;
      }

      setUser(session.user);

      // Fetch user profile
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (!data) {
          navigate('/setup'); // No profile found, redirect to setup
          return;
        }

        setProfile(data as UserProfile);
        setEditedProfile(data as UserProfile);

        // Fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, product_name, total_amount, status, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (ordersError) {
          console.error('Error fetching recent orders:', ordersError);
        } else {
          setRecentOrders(ordersData || []);
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/setup');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    }
  };

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

      // Update local profile state
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

  if (loading) {
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
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.full_name}</h1>
                    <div className="flex items-center mt-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-300 ml-1.5">{user?.email}</p>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></span>
                        Active Account
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {!editing && (
                    <button
                      onClick={handleEdit}
                      className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2.5 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          {message.text && (
            <div className={`mb-8 p-6 rounded-xl shadow-md flex items-center ${
              message.type === 'error' 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/30' 
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/30'
            } animate-fade-in`}>
              <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.type === 'error' ? 'bg-red-100 dark:bg-red-800/30' : 'bg-green-100 dark:bg-green-800/30'
              }`}>
                {message.type === 'error' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <p className="ml-4 text-base">{message.text}</p>
            </div>
          )}
          
          <div className="sm:hidden mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveSection('personal')}
                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded ${
                  activeSection === 'personal' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Personal
              </button>
              <button 
                onClick={() => setActiveSection('account')}
                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded ${
                  activeSection === 'account' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Account
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`md:col-span-2 ${activeSection !== 'personal' && 'hidden sm:block'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                {!editing && profile && (
                  <div className="p-8">
                    <ScrollReveal delay={100}>
                      <div className="flex items-center justify-between pb-5 mb-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal Information
                        </h2>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Full Name</p>
                            <p className="font-medium text-lg text-gray-900 dark:text-white">{profile.full_name}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Phone Number</p>
                            <p className="font-medium text-lg text-gray-900 dark:text-white">{profile.phone}</p>
                          </div>
                        </div>
                        
                        <div className="pt-6 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Address
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl space-y-3">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profile.address_line1}</p>
                            {profile.address_line2 && <p className="font-medium text-gray-800 dark:text-gray-200">{profile.address_line2}</p>}
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {profile.city}, {profile.state} {profile.postal_code}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profile.country}</p>
                          </div>
                        </div>
                        
                        <div className="pt-6 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Preferences
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Preferred Language</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{profile.preferred_language}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Marketing Preferences</p>
                              <div className="flex items-center">
                                {profile.marketing_consent ? (
                                  <>
                                    <span className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></span>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">Subscribed to marketing emails</p>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">Not subscribed to marketing emails</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Account Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Email Address</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{user?.email}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-medium">Account Created</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {profile?.created_at && new Date(profile.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                )}
                
                {editing && editedProfile && (
                  <div className="p-8">
                    <form>
                      <ScrollReveal delay={100}>
                        <div className="flex items-center justify-between pb-5 mb-6 border-b border-gray-100 dark:border-gray-700">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile
                          </h2>
                        </div>
                        
                        <div className="space-y-8">
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                            <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Full Name*
                                </label>
                                <input
                                  type="text"
                                  id="full_name"
                                  name="full_name"
                                  value={editedProfile.full_name || ''}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Phone Number*
                                </label>
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  value={editedProfile.phone || ''}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                            <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Address
                            </h3>
                            <div className="space-y-5">
                              <div>
                                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Address Line 1*
                                </label>
                                <input
                                  type="text"
                                  id="address_line1"
                                  name="address_line1"
                                  value={editedProfile.address_line1 || ''}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Address Line 2
                                </label>
                                <input
                                  type="text"
                                  id="address_line2"
                                  name="address_line2"
                                  value={editedProfile.address_line2 || ''}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    City*
                                  </label>
                                  <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={editedProfile.city || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    State*
                                  </label>
                                  <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={editedProfile.state || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Postal Code*
                                  </label>
                                  <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={editedProfile.postal_code || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Country*
                                  </label>
                                  <select
                                    id="country"
                                    name="country"
                                    value={editedProfile.country || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                  >
                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                            <h3 className="text-lg font-medium mb-5 text-gray-900 dark:text-white flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Preferences
                            </h3>
                            <div className="space-y-5">
                              <div>
                                <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Preferred Language
                                </label>
                                <select
                                  id="preferred_language"
                                  name="preferred_language"
                                  value={editedProfile.preferred_language || ''}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                >
                                  <option value="English">English</option>
                                  <option value="Hindi">Hindi</option>
                                  <option value="Malayalam">Malayalam</option>
                                  <option value="Tamil">Tamil</option>
                                </select>
                              </div>
                              
                              <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                <input
                                  type="checkbox"
                                  id="marketing_consent"
                                  name="marketing_consent"
                                  checked={editedProfile.marketing_consent || false}
                                  onChange={handleChange}
                                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="marketing_consent" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                                  I agree to receive marketing communications from OMIWO
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-4 pt-4">
                            <button
                              type="button"
                              onClick={handleCancel}
                              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSave}
                              disabled={saving}
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-indigo-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex items-center"
                            >
                              {saving ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                          </div>
                        </div>
                      </ScrollReveal>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`md:col-span-1 ${activeSection !== 'account' && 'hidden sm:block'}`}>
              <ScrollReveal delay={200}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Account Summary
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Member Since</span>
                        <span className="font-semibold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm">
                          {profile?.created_at && new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Last Update</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {profile?.updated_at && new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Status</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></span>
                          Active
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Recent Orders
                      </h3>
                      <button 
                        className="text-sm text-blue-600 dark:text-blue-400"
                        onClick={() => navigate('/orders')}
                      >
                        View All
                      </button>
                    </div>
                    
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="mb-3">You haven't placed any orders yet.</p>
                        <a 
                          href="/shop" 
                          className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors font-medium text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          Browse Products
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentOrders.map(order => (
                          <div 
                            key={order.id}
                            className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                            onClick={() => navigate(`/order-confirmation/${order.id}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{order.product_name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="ml-3">
                                {getStatusBadge(order.status)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">₹{order.total_amount}</p>
                              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;