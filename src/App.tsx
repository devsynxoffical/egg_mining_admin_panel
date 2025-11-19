import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Referrals from './pages/Referrals'
import InvestmentPlans from './pages/InvestmentPlans'
import StakingPlans from './pages/StakingPlans'
import KYC from './pages/KYC'
import MarketPrice from './pages/MarketPrice'
import Transactions from './pages/Transactions'
import ActivityLogs from './pages/ActivityLogs'
import { useAuthStore } from './store/authStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="investment-plans" element={<InvestmentPlans />} />
            <Route path="staking-plans" element={<StakingPlans />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="market-price" element={<MarketPrice />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App

