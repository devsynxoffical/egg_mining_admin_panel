import { useQuery } from '@tanstack/react-query'
import { DashboardStats } from '../types'
import { useState } from 'react'
import AnalyticsChart from '../components/Dashboard/AnalyticsChart'
import MiningCard from '../components/Dashboard/MiningCard'
import EggBalanceCard from '../components/Dashboard/EggBalanceCard'
import MarketPriceCard from '../components/Dashboard/MarketPriceCard'
import MarketPriceUpdate from '../components/Dashboard/MarketPriceUpdate'
import TransactionList from '../components/Dashboard/TransactionList'

export default function Dashboard() {
  const [showMiningCard, setShowMiningCard] = useState(true)
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      return {
        totalUsers: 1250,
        activeUsers: 890,
        dailyActiveMiners: 456,
        totalEggsInCirculation: 12500,
        totalTransactions: 3420,
        pendingKYC: 23,
        marketPrice: 3.06,
        totalEggValue: 131250,
        recentActivity: [],
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#4C6FFF]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6 relative z-10">
      {/* Mine Eggs & Earn Card */}
      {showMiningCard && (
        <div className="animate-fade-in">
          <MiningCard onClose={() => setShowMiningCard(false)} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Egg Balance & Mining */}
        <div className="lg:col-span-2 space-y-6">
          {/* Egg Balance Card */}
          <div>
            <EggBalanceCard 
              totalUsers={stats?.totalUsers || 0}
              totalMined={stats?.totalEggsInCirculation || 0}
              totalEggsInCirculation={stats?.totalEggsInCirculation || 0}
            />
          </div>

          {/* Market Price Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <MarketPriceCard
                title="Egg Balance"
                value="$3.90"
                icon=""
                change="+0.5%"
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <MarketPriceCard
                title="Current Price"
                value={`$${stats?.marketPrice || 0}`}
                icon=""
                change="+2.5%"
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <MarketPriceCard
                title="Day/Night Fees"
                value="$1.08"
                icon=""
                change="+1.2%"
              />
            </div>
          </div>

          {/* Egg Price History Chart */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card relative bg-white border border-gray-200">
              <div className="relative p-6 z-10">
                <h2 className="text-xl font-extrabold text-[#0D1B2] mb-6">
                  Egg Price History
                </h2>
                <AnalyticsChart />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Market & Trading */}
        <div className="space-y-6">
          {/* Market Price Update */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <MarketPriceUpdate currentPrice={stats?.marketPrice || 0} />
          </div>
          
          {/* Transaction List */}
          <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <TransactionList />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
