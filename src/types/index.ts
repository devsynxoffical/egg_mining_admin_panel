export interface User {
  id: string
  email: string
  phone?: string
  username: string
  fullName: string
  password?: string
  eggBalance: number
  walletBalance: number
  referralCode: string
  referrerId?: string
  referrerCode?: string
  totalReferrals: number
  eggsFromReferrals: number
  activePlanId?: string
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  accountStatus: 'active' | 'suspended' | 'blocked'
  createdAt: string
  lastMiningAt?: string
  deviceId?: string
  ipAddress?: string
}

export interface PlanActivation {
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planName: string
  activatedAt: string
  expiresAt?: string
  isActive: boolean
}

export interface ReferralTreeNode extends User {
  children?: ReferralTreeNode[]
  level?: number
}

export interface KYCSubmission {
  id: string
  userId: string
  userEmail: string
  userName: string
  fullName: string
  cnic: string
  selfieUrl: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  type: 'mining' | 'buy' | 'sell' | 'transfer' | 'referral_bonus'
  amount: number
  price?: number
  totalValue?: number
  recipientId?: string
  recipientName?: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  metadata?: Record<string, any>
}

export interface ActivityLog {
  id: string
  userId?: string
  userName?: string
  action: string
  type: 'mining' | 'transaction' | 'kyc' | 'user_action' | 'system'
  details: Record<string, any>
  ipAddress?: string
  deviceId?: string
  timestamp: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  dailyActiveMiners: number
  totalEggsInCirculation: number
  totalTransactions: number
  pendingKYC: number
  marketPrice: number
  totalEggValue: number
  recentActivity: ActivityLog[]
}

export interface MarketPrice {
  currentPrice: number
  lastUpdated: string
  updatedBy: string
  history?: Array<{
    price: number
    timestamp: string
  }>
}

export interface InvestmentPlan {
  id: string
  name: string
  description: string
  price: number
  priceCurrency: string
  miningTimeHours: number
  eggsPerDay: number
  features: string[]
  badge?: string
  badgeColor?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface StakingPlan {
  id: string
  days: number
  description: string
  rewardPercentage: number
  minStake: number
  badge?: string
  badgeColor?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ActiveStake {
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planDays: number
  eggsStaked: number
  rewardPercentage: number
  expectedReward: number
  startDate: string
  endDate: string
  daysRemaining: number
  isCompleted: boolean
  createdAt?: string
}

