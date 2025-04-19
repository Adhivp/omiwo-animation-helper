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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16 px-6">
        {/* Profile background */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ top: '60px', zIndex: 0 }}>
          <div className="h-64 w-full">
            <ThreeScene 
              animationType="wave" 
              color={theme === 'dark' ? "#4f46e5" : "#3b82f6"} 
              mousePosition={mousePosition}
              isHovered={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900" style={{ top: '50px' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Profile Header Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-8">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-indigo-500 dark:to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.full_name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2.5 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </ScrollReveal>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-5 rounded-lg ${message.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'} animate-fade-in`}>
              {message.text}
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Profile Section */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                <div className="p-8">
                  <ScrollReveal delay={100}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                      {!editing && (
                        <button
                          onClick={handleEdit}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </ScrollReveal>

                  {/* Profile Details - View Mode */}
                  {!editing && profile && (
                    <div className="space-y-6">
                      <ScrollReveal delay={150}>
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                            <p className="font-medium text-lg text-gray-900 dark:text-white">{profile.full_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                            <p className="font-medium text-lg text-gray-900 dark:text-white">{profile.phone}</p>
                          </div>
                        </div>
                        
                        {/* Address Information */}
                        <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Address</h3>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profile.address_line1}</p>
                            {profile.address_line2 && <p className="font-medium text-gray-800 dark:text-gray-200">{profile.address_line2}</p>}
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {profile.city}, {profile.state} {profile.postal_code}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profile.country}</p>
                          </div>
                        </div>
                        
                        {/* Preferences */}
                        <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Preferences</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preferred Language</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{profile.preferred_language}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Marketing Preferences</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {profile.marketing_consent ? 
                                  'Subscribed to marketing emails' : 
                                  'Not subscribed to marketing emails'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Account Information */}
                        <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Account Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{user?.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Created</p>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {profile?.created_at && new Date(profile.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  )}
                  
                  {/* Profile Details - Edit Mode */}
                  {editing && editedProfile && (
                    <div className="space-y-6">
                      <form>
                        <ScrollReveal delay={150}>
                          <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>
                            
                            {/* Address */}
                            <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Address</h3>
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
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                      <option value="India">India</option>
                                      <option value="United States">United States</option>
                                      <option value="United Kingdom">United Kingdom</option>
                                      <option value="Canada">Canada</option>
                                      <option value="Australia">Australia</option>
                                      {/* Add more countries as needed */}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Preferences */}
                            <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Preferences</h3>
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
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Malayalam">Malayalam</option>
                                    <option value="Tamil">Tamil</option>
                                    {/* Add more languages as needed */}
                                  </select>
                                </div>
                                
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="marketing_consent"
                                    name="marketing_consent"
                                    checked={editedProfile.marketing_consent || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label htmlFor="marketing_consent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    I agree to receive marketing communications from OMIWO
                                  </label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-4 mt-8">
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-indigo-500 text-white rounded-lg hover:shadow-md transition-all"
                              >
                                {saving ? 'Saving...' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        </ScrollReveal>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar Section */}
            <div className="md:col-span-1">
              {/* Account Summary Card */}
              <ScrollReveal delay={200}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account Summary</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile?.created_at && new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Update</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile?.updated_at && new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Order History Section */}
              <ScrollReveal delay={300}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h3>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p>You haven't placed any orders yet.</p>
                      <a href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Browse Products
                      </a>
                    </div>
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