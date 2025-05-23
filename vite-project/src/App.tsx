import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import './pages/About.css'
import AuthModal from './components/AuthModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-transparent flex flex-col relative">
        {/* Navigation Bar */}
        <nav className="bg-slate-50 text-slate-700 shadow-sm py-2 px-4">
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

        {/* Routes */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={
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
          } />
        </Routes>

        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Footer */}
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
                  <li><a href="#" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/>
                    </svg>
                    Home
                  </a></li>
                  <li><a href="https://github.com/franfreezy" target="_blank" rel="noopener noreferrer" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                    </svg>
                    Github
                  </a></li>
                </ul>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold mb-4 text-slate-700">Contact Us</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://wa.me/+254729634366" target="_blank" rel="noopener noreferrer" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@example.com" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      frandelwanjawa19@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      (254) 7296-34366
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 text-center">
              <p className="text-xs sm:text-sm text-slate-600">&copy; 2025 Tethics Electrics Grp. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App