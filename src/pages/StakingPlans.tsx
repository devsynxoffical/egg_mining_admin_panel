import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import { StakingPlan, User, ActiveStake } from '../types'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Clock,
  Percent,
  Coins,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Mock data - matches Flutter app plans
const mockStakingPlans: StakingPlan[] = [
  {
    id: '7days',
    days: 7,
    description: 'Perfect for beginners',
    rewardPercentage: 3.0,
    minStake: 10,
    badge: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '30days',
    days: 30,
    description: 'Most popular choice',
    rewardPercentage: 10.0,
    minStake: 50,
    badge: 'POPULAR',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '90days',
    days: 90,
    description: 'Maximum rewards',
    rewardPercentage: 25.0,
    minStake: 100,
    badge: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function StakingPlans() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState<Partial<StakingPlan>>({})
  const queryClient = useQueryClient()

  const { data: plans, isLoading, refetch } = useQuery<StakingPlan[]>({
    queryKey: ['staking-plans'],
    queryFn: async () => {
      const stored = localStorage.getItem('staking-plans')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('staking-plans', JSON.stringify(mockStakingPlans))
      return mockStakingPlans
    },
  })

  // Fetch users
  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const stored = localStorage.getItem('users-data')
      if (stored) {
        return JSON.parse(stored)
      }
      return []
    },
  })

  // Helper function to sort stakes alphabetically by user name
  const sortStakesAlphabetically = (stakes: ActiveStake[]): ActiveStake[] => {
    return [...stakes].sort((a, b) => {
      const nameA = a.userName.toLowerCase()
      const nameB = b.userName.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
  }

  // Fetch active stakes
  const { data: activeStakes } = useQuery<ActiveStake[]>({
    queryKey: ['active-stakes'],
    queryFn: async () => {
      try {
        const response = await adminAPI.getActiveStakes()
        const data = response.data || []
        return sortStakesAlphabetically(data)
      } catch (error) {
        const stored = localStorage.getItem('active-stakes')
        if (stored) {
          const parsed = JSON.parse(stored)
          return sortStakesAlphabetically(parsed)
        }
        
        // Mock implementation - create stakes from users
        const storedUsers = localStorage.getItem('users-data')
        const usersData: User[] = storedUsers ? JSON.parse(storedUsers) : []
        const plansData = plans || mockStakingPlans
        
        const mockStakes: ActiveStake[] = []
        
        usersData.forEach((user, index) => {
          if (index < plansData.length) {
            const plan = plansData[index % plansData.length]
            const startDate = new Date(Date.now() - index * 86400000)
            const endDate = new Date(startDate.getTime() + plan.days * 86400000)
            const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86400000))
            const expectedReward = Math.round((plan.minStake * plan.rewardPercentage) / 100)
            
            mockStakes.push({
              id: `stake-${user.id}`,
              userId: user.id,
              userName: user.fullName,
              userEmail: user.email,
              planId: plan.id,
              planDays: plan.days,
              eggsStaked: plan.minStake,
              rewardPercentage: plan.rewardPercentage,
              expectedReward: expectedReward,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              daysRemaining: daysRemaining,
              isCompleted: daysRemaining === 0,
            })
          }
        })
        
        const sortedStakes = sortStakesAlphabetically(mockStakes)
        localStorage.setItem('active-stakes', JSON.stringify(sortedStakes))
        return sortedStakes
      }
    },
    enabled: !!plans,
  })

  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: Partial<StakingPlan> }) =>
      adminAPI.updateStakingPlan(planId, data),
    onSuccess: () => {
      toast.success('Staking plan updated successfully')
      refetch()
      setIsEditing(false)
      setSelectedPlan(null)
      setEditForm({})
    },
    onError: (error: any) => {
      const stored = localStorage.getItem('staking-plans')
      const plansData: StakingPlan[] = stored ? JSON.parse(stored) : mockStakingPlans
      
      const updated = plansData.map((p) =>
        p.id === selectedPlan?.id ? { ...p, ...editForm, updatedAt: new Date().toISOString() } : p
      )
      
      localStorage.setItem('staking-plans', JSON.stringify(updated))
      queryClient.setQueryData(['staking-plans'], updated)
      toast.success('Staking plan updated successfully')
      refetch()
      setIsEditing(false)
      setSelectedPlan(null)
      setEditForm({})
    },
  })

  const createPlanMutation = useMutation({
    mutationFn: (data: Partial<StakingPlan>) => adminAPI.createStakingPlan(data),
    onSuccess: () => {
      toast.success('Staking plan created successfully')
      refetch()
      setIsCreating(false)
      setEditForm({})
    },
    onError: (error: any) => {
      const stored = localStorage.getItem('staking-plans')
      const plansData: StakingPlan[] = stored ? JSON.parse(stored) : mockStakingPlans
      
      const newPlan: StakingPlan = {
        id: editForm.id || Date.now().toString(),
        days: editForm.days || 0,
        description: editForm.description || '',
        rewardPercentage: editForm.rewardPercentage || 0,
        minStake: editForm.minStake || 0,
        badge: editForm.badge,
        isActive: editForm.isActive !== undefined ? editForm.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const updated = [...plansData, newPlan]
      localStorage.setItem('staking-plans', JSON.stringify(updated))
      queryClient.setQueryData(['staking-plans'], updated)
      toast.success('Staking plan created successfully')
      refetch()
      setIsCreating(false)
      setEditForm({})
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => adminAPI.deleteStakingPlan(planId),
    onSuccess: () => {
      toast.success('Staking plan deleted successfully')
      refetch()
    },
    onError: (error: any) => {
      const stored = localStorage.getItem('staking-plans')
      const plansData: StakingPlan[] = stored ? JSON.parse(stored) : mockStakingPlans
      
      const updated = plansData.filter((p) => p.id !== selectedPlan?.id)
      localStorage.setItem('staking-plans', JSON.stringify(updated))
      queryClient.setQueryData(['staking-plans'], updated)
      toast.success('Staking plan deleted successfully')
      refetch()
      setSelectedPlan(null)
    },
  })

  const handleEdit = (plan: StakingPlan) => {
    setSelectedPlan(plan)
    setEditForm({ ...plan })
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setSelectedPlan(null)
    setEditForm({
      id: '',
      days: 0,
      description: '',
      rewardPercentage: 0,
      minStake: 0,
      badge: undefined,
      isActive: true,
    })
    setIsCreating(true)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (!editForm.days || !editForm.description || editForm.rewardPercentage === undefined || editForm.minStake === undefined) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isCreating) {
      createPlanMutation.mutate(editForm)
    } else if (selectedPlan) {
      updatePlanMutation.mutate({ planId: selectedPlan.id, data: editForm })
    }
  }

  const handleDelete = (plan: StakingPlan) => {
    if (!confirm(`Are you sure you want to delete "${plan.days} days" plan? This action cannot be undone.`)) {
      return
    }
    setSelectedPlan(plan)
    deletePlanMutation.mutate(plan.id)
  }

  const getStakesForPlan = (planId: string) => {
    return activeStakes?.filter(s => s.planId === planId && !s.isCompleted) || []
  }

  const getStakesCount = (planId: string) => {
    return getStakesForPlan(planId).length
  }

  const filteredPlans = plans?.filter(
    (plan) =>
      plan.days.toString().includes(searchTerm) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter stakes for table
  const filteredStakes = activeStakes
    ?.filter((stake) => {
      if (!tableSearchTerm) return !stake.isCompleted
      const searchLower = tableSearchTerm.toLowerCase()
      const user = users?.find(u => u.id === stake.userId)
      const plan = plans?.find(p => p.id === stake.planId)
      return (
        !stake.isCompleted &&
        (stake.userName.toLowerCase().includes(searchLower) ||
         stake.userEmail.toLowerCase().includes(searchLower) ||
         user?.username?.toLowerCase().includes(searchLower) ||
         plan?.description?.toLowerCase().includes(searchLower))
      )
    })
    ?.sort((a, b) => {
      const nameA = a.userName.toLowerCase()
      const nameB = b.userName.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B2]">Staking Plans</h1>
          <p className="mt-1 text-sm text-gray-600">Manage staking plans and active stakes</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {/* Active Stakes Table */}
      <div className="card bg-white border border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2] flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-[#4C6FFF] to-[#00D4FF] rounded-full"></div>
                Active Stakes
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Complete list of users and their active staking positions
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#4C6FFF] to-[#00D4FF] px-6 py-3 rounded-xl shadow-md">
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Total Active</div>
              <div className="text-2xl font-bold text-white mt-1">
                {filteredStakes?.length || 0}
              </div>
            </div>
          </div>

          {/* Search Bar for Table */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, username, or plan description..."
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C6FFF] focus:border-transparent text-sm text-[#0D1B2] placeholder-gray-400"
              />
              {tableSearchTerm && (
                <button
                  onClick={() => setTableSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {filteredStakes && filteredStakes.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Staking Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Eggs Staked
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Reward %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Expected Reward
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Days Remaining
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredStakes.map((stake) => {
                    const user = users?.find(u => u.id === stake.userId)
                    const plan = plans?.find(p => p.id === stake.planId)
                    return (
                      <tr 
                        key={stake.id} 
                        className="hover:bg-gradient-to-r hover:from-[#4C6FFF]/5 hover:to-[#00D4FF]/5 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {stake.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#0D1B2] group-hover:text-[#4C6FFF] transition-colors">
                                {stake.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="text-sm text-gray-700 font-medium">{stake.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg">
                            <span className="text-xs text-gray-500">@</span>
                            <span className="text-sm font-medium text-gray-700">
                              {user?.username || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0D1B2]">
                                {stake.planDays} Days
                              </span>
                              {plan?.badge && (
                                <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-[#4C6FFF] to-[#00D4FF] text-white rounded-full shadow-sm">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {plan?.description || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <Coins className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-700">
                              {stake.eggsStaked}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <Percent className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-bold text-blue-700">
                              {stake.rewardPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-bold text-purple-700">
                              {stake.expectedReward} eggs
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm font-semibold text-gray-700">
                              {stake.daysRemaining} days
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm font-semibold text-gray-700">
                              {format(new Date(stake.endDate), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {format(new Date(stake.endDate), 'h:mm a')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                            !stake.isCompleted
                              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-gray-50 text-gray-700 border border-gray-300'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              !stake.isCompleted ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}></div>
                            {!stake.isCompleted ? 'Active' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold text-lg">No active stakes found</p>
              <p className="text-sm text-gray-500 mt-2">Users will appear here once they start staking</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search plans by days or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C6FFF]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans?.map((plan) => (
            <div
              key={plan.id}
              className="card bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-extrabold text-[#0D1B2] tracking-tight">{plan.days} Days</h3>
                      {plan.badge && (
                        <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-[#4C6FFF] to-[#00D4FF] text-white rounded-full shadow-sm uppercase tracking-wider whitespace-nowrap">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-700 font-medium mb-3 leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-[#4C6FFF] hover:bg-[#4C6FFF]/10 rounded-lg transition-colors"
                      title="Edit Plan"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5 flex-1">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-[#00D4FF]/10 rounded-lg flex-shrink-0">
                      <Percent className="h-5 w-5 text-[#00D4FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Reward Percentage</p>
                      <p className="text-lg font-bold text-[#0D1B2]">
                        {plan.rewardPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                      <Coins className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Minimum Stake</p>
                      <p className="text-base font-bold text-[#0D1B2]">{plan.minStake} eggs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${plan.isActive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                      {plan.isActive ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Status</p>
                      <p className={`text-base font-bold ${plan.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#4C6FFF]/5 to-[#00D4FF]/5 rounded-lg border border-[#4C6FFF]/20">
                    <div className="p-2 bg-[#4C6FFF]/20 rounded-lg flex-shrink-0">
                      <Users className="h-5 w-5 text-[#4C6FFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#4C6FFF] uppercase tracking-wider mb-0.5">Active Stakes</p>
                      <p className="text-base font-bold text-[#4C6FFF]">
                        {getStakesCount(plan.id)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {(isEditing || isCreating) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsEditing(false)
            setIsCreating(false)
            setEditForm({})
            setSelectedPlan(null)
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D1B2]">
                {isCreating ? 'Create Staking Plan' : 'Edit Staking Plan'}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setIsCreating(false)
                  setEditForm({})
                  setSelectedPlan(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.id || ''}
                    onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                    className="input-field"
                    placeholder="7days"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editForm.days || ''}
                    onChange={(e) => setEditForm({ ...editForm, days: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="7"
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="input-field"
                    placeholder="Perfect for beginners"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reward Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.rewardPercentage || ''}
                    onChange={(e) => setEditForm({ ...editForm, rewardPercentage: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="3.0"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stake (eggs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editForm.minStake || ''}
                    onChange={(e) => setEditForm({ ...editForm, minStake: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.badge || ''}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value || undefined })}
                    className="input-field"
                    placeholder="POPULAR, LIMITED, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setIsCreating(false)
                    setEditForm({})
                    setSelectedPlan(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updatePlanMutation.isPending || createPlanMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {updatePlanMutation.isPending || createPlanMutation.isPending ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

