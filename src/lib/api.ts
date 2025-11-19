import axios from 'axios'
import { User, InvestmentPlan, StakingPlan } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API functions will be added here as we build the components
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/admin/users', { params }),
  getUserById: (userId: string) => api.get(`/admin/users/${userId}`),
  createUser: (userData: Partial<User>) => api.post('/admin/users', userData),
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'blocked') =>
    api.patch(`/admin/users/${userId}/status`, { status }),
  updateUser: (userId: string, data: Partial<User>) =>
    api.patch(`/admin/users/${userId}`, data),
  changeUserPassword: (userId: string, newPassword: string) =>
    api.post(`/admin/users/${userId}/change-password`, { newPassword }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  
  // Referrals
  getReferralTree: (userId?: string) => api.get('/admin/referrals/tree', { params: { userId } }),
  getReferrals: (params?: { userId?: string; page?: number; limit?: number }) =>
    api.get('/admin/referrals', { params }),
  
  // KYC
  getKYCSubmissions: (params?: { status?: 'pending' | 'approved' | 'rejected' }) =>
    api.get('/admin/kyc', { params }),
  approveKYC: (kycId: string) => api.post(`/admin/kyc/${kycId}/approve`),
  rejectKYC: (kycId: string, reason: string) =>
    api.post(`/admin/kyc/${kycId}/reject`, { reason }),
  
  // Market Price
  getMarketPrice: () => api.get('/admin/market/price'),
  updateMarketPrice: (price: number) => api.post('/admin/market/price', { price }),
  
  // Investment Plans
  getInvestmentPlans: () => api.get('/admin/investment/plans'),
  getInvestmentPlanById: (planId: string) => api.get(`/admin/investment/plans/${planId}`),
  createInvestmentPlan: (planData: Partial<InvestmentPlan>) => api.post('/admin/investment/plans', planData),
  updateInvestmentPlan: (planId: string, planData: Partial<InvestmentPlan>) => api.patch(`/admin/investment/plans/${planId}`, planData),
  deleteInvestmentPlan: (planId: string) => api.delete(`/admin/investment/plans/${planId}`),
  getPlanActivations: (planId?: string) => api.get('/admin/investment/activations', { params: { planId } }),
  
  // Staking Plans
  getStakingPlans: () => api.get('/admin/staking/plans'),
  getStakingPlanById: (planId: string) => api.get(`/admin/staking/plans/${planId}`),
  createStakingPlan: (planData: Partial<StakingPlan>) => api.post('/admin/staking/plans', planData),
  updateStakingPlan: (planId: string, planData: Partial<StakingPlan>) => api.patch(`/admin/staking/plans/${planId}`, planData),
  deleteStakingPlan: (planId: string) => api.delete(`/admin/staking/plans/${planId}`),
  getActiveStakes: (planId?: string) => api.get('/admin/staking/active', { params: { planId } }),
  
  // Transactions
  getTransactions: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get('/admin/transactions', { params }),
  
  // Activity Logs
  getActivityLogs: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get('/admin/activity-logs', { params }),
}

