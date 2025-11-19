import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Search, Bell, User } from 'lucide-react'

export default function Header() {
  const { user } = useAuthStore()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'transfer'>('buy')

  const showTabs = location.pathname === '/dashboard' || location.pathname === '/market-price'

  return (
    <header className="relative overflow-visible" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      {/* Oval-shaped header container */}
      <div className="relative mx-auto max-w-[95%] overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm" style={{
        minHeight: '70px',
        display: 'flex',
        alignItems: 'center'
      }}>
        
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex h-16 justify-between items-center gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4C6FFF] flex items-center justify-center shadow-sm">
                <span className="text-xl">🥚</span>
              </div>
              <h1 className="text-xl font-bold text-[#0D1B2]">
                Egg Mining
              </h1>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C6FFF] focus:border-[#4C6FFF] focus:outline-none text-sm font-medium text-[#0D1B2] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Center: Tabs (Buy/Sell/Transfer) */}
            {showTabs && (
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'buy'
                      ? 'bg-[#4C6FFF] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0D1B2] hover:bg-gray-100'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActiveTab('sell')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'sell'
                      ? 'bg-[#4C6FFF] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0D1B2] hover:bg-gray-100'
                  }`}
                >
                  Sell
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'transfer'
                      ? 'bg-[#4C6FFF] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#0D1B2] hover:bg-gray-100'
                  }`}
                >
                  Transfer
                </button>
              </div>
            )}

            {/* Right: Notifications & User */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-all">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-[#00D4FF] rounded-full border-2 border-white shadow-sm"></span>
              </button>

              {/* User Avatar (Desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#0D1B2]">{user?.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#4C6FFF] flex items-center justify-center text-white font-bold text-sm shadow-sm transform hover:scale-105 transition-transform">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>

              {/* User Icon (Mobile) */}
              <button className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-all">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
