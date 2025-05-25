import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import AuthCallback from './components/AuthCallback'
import About from './pages/About'
import './pages/About.css'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import Loading from './components/Loading'
import DataUpload from './components/DataUpload'
import { supabase } from './config/supabase'


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);

  // Preload images on first load
  useEffect(() => {
    if (areImagesLoaded) return; // Skip if images are already loaded

    const imagesToLoad = ['/logo.jpg', '/imglogo.jpeg'];
    let loadedImages = 0;

    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages === imagesToLoad.length) {
        setAreImagesLoaded(true);
        setIsLoading(false);
      }
    };

    // Preload images
    imagesToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Count errors as loaded to prevent infinite loading
    });

    // Cleanup function
    return () => {
      // Clean up image objects
      imagesToLoad.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Show loading immediately
      setIsLoading(true);
      
      // Clear all storage and state
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      setIsModalOpen(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Force clear the auth state
      await supabase.auth.clearSession();
      
      // Reset auth state completely
      window.location.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, try to force a clean state
      setIsLoggedIn(false);
      window.location.replace('/');
    }
  };

  // Check for existing token and handle auth state changes
  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        // Check for Django token first
        const djangoToken = localStorage.getItem('authToken');
        if (djangoToken) {
          setIsLoggedIn(true);
          setIsLoading(false);
          return;
        }

        // If no Django token, check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          // For Supabase auth, we'll still use the access token but prefix it
          setIsLoggedIn(true);
          localStorage.setItem('authToken', session.access_token);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        setIsLoggedIn(true);
        localStorage.setItem('authToken', session.access_token);
        setIsModalOpen(false);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-transparent flex flex-col relative">
        {!isLoggedIn && (
          <nav className="bg-slate-50 text-slate-700 shadow-sm py-2 px-4 relative z-10">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <img 
                  src="/imglogo.jpeg" 
                  alt="AB DATA Logo" 
                  className="h-8 w-8 object-contain"
                />
                <div className="text-xl font-bold text-[#2c5530]">AB DATA</div>
              </div>
              <ul className="flex flex-wrap justify-center gap-4 sm:space-x-6">
                <li>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `transition-colors duration-300 px-2 py-1 border-b-2 ${
                        isActive 
                          ? 'text-[#2c5530] border-[#2c5530]' 
                          : 'border-transparent hover:text-[#2c5530] hover:border-[#2c5530]'
                      }`
                    }
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                      `transition-colors duration-300 px-2 py-1 border-b-2 ${
                        isActive 
                          ? 'text-[#2c5530] border-[#2c5530]' 
                          : 'border-transparent hover:text-[#2c5530] hover:border-[#2c5530]'
                      }`
                    }
                  >
                    About
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/callback" element={<AuthCallback />} />
          <Route path="/dashboard/*" element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/" element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <main className="flex-grow relative">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="AB DATA Background" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-4 sm:px-8 py-16 sm:py-24">
                  <div className="max-w-3xl mx-auto text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Empowering Agriculture</h2>
                    <div className="text-xl sm:text-2xl mb-8 font-light">
                      "It is mindboggling what humans can do to survive and thrive. Agriculture and Biology are the heart of the humans quest for survival. We are here to help you understand the data behind it."
                    </div>
                    <p className="mb-8 text-lg italic">- AB DATA Vision</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#2c5530] hover:bg-[#234225] text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </main>
            )
          } />
        </Routes>

        <AuthModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Footer */}
        {!isLoggedIn && (
          <footer className="bg-slate-50 text-slate-600 border-t border-slate-100 px-4 sm:px-6 py-4 relative overflow-hidden">
            <div className="footer-background"></div>
            <div className="container mx-auto relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold mb-4 text-slate-700">About Us</h3>
                  <p className="text-slate-600">Empowering agriculture through data-driven solutions and sustainable practices.</p>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold mb-4 text-slate-700">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavLink to="/" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/about" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                        About
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold mb-4 text-slate-700">Contact Us</h3>
                  <p className="text-slate-600">Get in touch with us for any questions or concerns.</p>
                </div>
              </div>
              <div className="border-t border-slate-200 mt-4 pt-4 text-center">
                <p className="text-xs sm:text-sm text-slate-600">&copy; 2025 Tethics Electrics Grp. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </Router>
  )
}

export default App