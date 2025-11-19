import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  DollarSign,
  Receipt,
  FileText,
  LogOut,
  Menu,
  X,
  UserCog,
  Package,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Market', href: '/market-price', icon: DollarSign },
  { name: 'Users', href: '/users', icon: UserCog },
  { name: 'Referral', href: '/referrals', icon: Users },
  { name: 'Investment Plans', href: '/investment-plans', icon: Package },
  { name: 'Staking Plans', href: '/staking-plans', icon: TrendingUp },
  { name: 'KYC', href: '/kyc', icon: ShieldCheck },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Activity Logs', href: '/activity-logs', icon: FileText },
]

export default function Sidebar() {
  const { logout, user } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    setShowLogoutModal(false)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-text-light p-2 rounded-lg shadow-lg"
        style={{ backgroundColor: '#1C2036' }}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out shadow-xl border-r border-white/10 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#1C2036' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/App Name */}
          <div className="flex h-16 shrink-0 items-center justify-center px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥚</span>
              <h1 className="text-lg font-semibold text-white">Egg Mining</h1>
            </div>
          </div>

          {/* User Profile (Mobile) */}
          {user && (
            <div className="lg:hidden px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4C6FFF] flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#4C6FFF] text-white font-medium shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all w-full text-left text-white/80 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0D1B2]">Confirm Logout</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to log out?</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              You will need to log in again to access the admin panel.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
