import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import { InvestmentPlan, User, PlanActivation } from '../types'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  DollarSign,
  Clock,
  Gift,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Mock data - matches Flutter app plans
const mockInvestmentPlans: InvestmentPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    description: 'Mine every 20 hours',
    price: 500,
    priceCurrency: '$',
    miningTimeHours: 20,
    eggsPerDay: 1,
    features: [
      '20% faster mining',
      'Basic support',
      'Standard withdrawals',
    ],
    badge: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    description: 'Mine every 12 hours OR 2 eggs/day',
    price: 2000,
    priceCurrency: '$',
    miningTimeHours: 12,
    eggsPerDay: 2,
    features: [
      '2x mining speed',
      'Priority support',
      'Faster withdrawals',
      'Bonus rewards',
    ],
    badge: 'POPULAR',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pro_max',
    name: 'Pro Max Plan',
    description: '3 eggs/day + priority withdrawals',
    price: 7000,
    priceCurrency: '$',
    miningTimeHours: 8,
    eggsPerDay: 3,
    features: [
      '3x mining output',
      'Instant withdrawals',
      'VIP support',
      'Exclusive features',
      'Market insights',
    ],
    badge: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vip',
    name: 'VIP Plan',
    description: 'Auto-mining + 2x referral earnings',
    price: 20000,
    priceCurrency: '$',
    miningTimeHours: 0,
    eggsPerDay: 5,
    features: [
      'Automatic mining',
      'Double referral bonuses',
      'Unlimited withdrawals',
      'Personal account manager',
      'Exclusive rewards',
      'Market priority',
    ],
    badge: 'LIMITED',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function InvestmentPlans() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState<Partial<InvestmentPlan>>({})
  const [newFeature, setNewFeature] = useState('')
  const queryClient = useQueryClient()

  const { data: plans, isLoading, refetch } = useQuery<InvestmentPlan[]>({
    queryKey: ['investment-plans'],
    queryFn: async () => {
      const stored = localStorage.getItem('investment-plans')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('investment-plans', JSON.stringify(mockInvestmentPlans))
      return mockInvestmentPlans
    },
  })

  // Fetch users to get plan activations
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

  // Helper function to sort activations alphabetically by user name
  const sortActivationsAlphabetically = (activations: PlanActivation[]): PlanActivation[] => {
    return [...activations].sort((a, b) => {
      const nameA = a.userName.toLowerCase()
      const nameB = b.userName.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
  }

  // Fetch plan activations
  const { data: activations } = useQuery<PlanActivation[]>({
    queryKey: ['plan-activations'],
    queryFn: async () => {
      try {
        const response = await adminAPI.getPlanActivations()
        const data = response.data || []
        // Sort alphabetically when loading from API
        return sortActivationsAlphabetically(data)
      } catch (error) {
        // Check if activations already exist in localStorage
        const storedActivations = localStorage.getItem('plan-activations')
        if (storedActivations) {
          const parsed = JSON.parse(storedActivations)
          // Sort alphabetically when loading from localStorage
          return sortActivationsAlphabetically(parsed)
        }
        
        // Mock implementation - create activations from users
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : []
        const plansData = plans || mockInvestmentPlans
        
        const mockActivations: PlanActivation[] = []
        
        usersData.forEach((user, index) => {
          if (user.activePlanId) {
            const plan = plansData.find(p => p.id === user.activePlanId)
            if (plan) {
              mockActivations.push({
                id: `activation-${user.id}`,
                userId: user.id,
                userName: user.fullName,
                userEmail: user.email,
                planId: plan.id,
                planName: plan.name,
                activatedAt: new Date(Date.now() - index * 86400000).toISOString(),
                isActive: true,
              })
            }
          } else if (index < plansData.length) {
            // Assign some users to plans for demo
            const plan = plansData[index % plansData.length]
            mockActivations.push({
              id: `activation-${user.id}`,
              userId: user.id,
              userName: user.fullName,
              userEmail: user.email,
              planId: plan.id,
              planName: plan.name,
              activatedAt: new Date(Date.now() - index * 86400000).toISOString(),
              isActive: true,
            })
          }
        })
        
        // Sort activations alphabetically by user name before saving
        const sortedActivations = sortActivationsAlphabetically(mockActivations)
        localStorage.setItem('plan-activations', JSON.stringify(sortedActivations))
        return sortedActivations
      }
    },
    enabled: !!plans,
  })

  // Calculate activation counts per plan
  const getPlanActivations = (planId: string) => {
    return activations?.filter(a => a.planId === planId && a.isActive) || []
  }

  const getActivationCount = (planId: string) => {
    return getPlanActivations(planId).length
  }

  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: Partial<InvestmentPlan> }) =>
      adminAPI.updateInvestmentPlan(planId, data),
    onSuccess: () => {
      toast.success('Investment plan updated successfully')
      refetch()
      setIsEditing(false)
      setSelectedPlan(null)
      setEditForm({})
    },
    onError: (error: any) => {
      // Mock implementation
      const stored = localStorage.getItem('investment-plans')
      const plansData: InvestmentPlan[] = stored ? JSON.parse(stored) : mockInvestmentPlans
      
      const updated = plansData.map((p) =>
        p.id === selectedPlan?.id ? { ...p, ...editForm, updatedAt: new Date().toISOString() } : p
      )
      
      localStorage.setItem('investment-plans', JSON.stringify(updated))
      queryClient.setQueryData(['investment-plans'], updated)
      toast.success('Investment plan updated successfully')
      refetch()
      setIsEditing(false)
      setSelectedPlan(null)
      setEditForm({})
    },
  })

  const createPlanMutation = useMutation({
    mutationFn: (data: Partial<InvestmentPlan>) => adminAPI.createInvestmentPlan(data),
    onSuccess: () => {
      toast.success('Investment plan created successfully')
      refetch()
      setIsCreating(false)
      setEditForm({})
    },
    onError: (error: any) => {
      // Mock implementation
      const stored = localStorage.getItem('investment-plans')
      const plansData: InvestmentPlan[] = stored ? JSON.parse(stored) : mockInvestmentPlans
      
      const newPlan: InvestmentPlan = {
        id: editForm.id || Date.now().toString(),
        name: editForm.name || '',
        description: editForm.description || '',
        price: editForm.price || 0,
        priceCurrency: editForm.priceCurrency || '$',
        miningTimeHours: editForm.miningTimeHours || 0,
        eggsPerDay: editForm.eggsPerDay || 0,
        features: editForm.features || [],
        badge: editForm.badge,
        isActive: editForm.isActive !== undefined ? editForm.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const updated = [...plansData, newPlan]
      localStorage.setItem('investment-plans', JSON.stringify(updated))
      queryClient.setQueryData(['investment-plans'], updated)
      toast.success('Investment plan created successfully')
      refetch()
      setIsCreating(false)
      setEditForm({})
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => adminAPI.deleteInvestmentPlan(planId),
    onSuccess: () => {
      toast.success('Investment plan deleted successfully')
      refetch()
    },
    onError: (error: any) => {
      // Mock implementation
      const stored = localStorage.getItem('investment-plans')
      const plansData: InvestmentPlan[] = stored ? JSON.parse(stored) : mockInvestmentPlans
      
      const updated = plansData.filter((p) => p.id !== selectedPlan?.id)
      localStorage.setItem('investment-plans', JSON.stringify(updated))
      queryClient.setQueryData(['investment-plans'], updated)
      toast.success('Investment plan deleted successfully')
      refetch()
      setSelectedPlan(null)
    },
  })

  const handleEdit = (plan: InvestmentPlan) => {
    setSelectedPlan(plan)
    setEditForm({
      ...plan,
      features: [...plan.features],
    })
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleCreate = () => {
    setSelectedPlan(null)
    setEditForm({
      id: '',
      name: '',
      description: '',
      price: 0,
      priceCurrency: '$',
      miningTimeHours: 0,
      eggsPerDay: 0,
      features: [],
      badge: undefined,
      isActive: true,
    })
    setIsCreating(true)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (!editForm.name || !editForm.description || editForm.price === undefined) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isCreating) {
      createPlanMutation.mutate(editForm)
    } else if (selectedPlan) {
      updatePlanMutation.mutate({ planId: selectedPlan.id, data: editForm })
    }
  }

  const handleDelete = (plan: InvestmentPlan) => {
    if (!confirm(`Are you sure you want to delete "${plan.name}"? This action cannot be undone.`)) {
      return
    }
    setSelectedPlan(plan)
    deletePlanMutation.mutate(plan.id)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setEditForm({
        ...editForm,
        features: [...(editForm.features || []), newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...(editForm.features || [])]
    updatedFeatures.splice(index, 1)
    setEditForm({
      ...editForm,
      features: updatedFeatures,
    })
  }

  const filteredPlans = plans?.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter and sort activations for table (alphabetically by user name)
  const filteredActivations = activations
    ?.filter((activation) => {
      if (!tableSearchTerm) return activation.isActive
      const searchLower = tableSearchTerm.toLowerCase()
      const user = users?.find(u => u.id === activation.userId)
      const plan = plans?.find(p => p.id === activation.planId)
      return (
        activation.isActive &&
        (activation.userName.toLowerCase().includes(searchLower) ||
         activation.userEmail.toLowerCase().includes(searchLower) ||
         user?.username?.toLowerCase().includes(searchLower) ||
         activation.planName.toLowerCase().includes(searchLower) ||
         plan?.description?.toLowerCase().includes(searchLower))
      )
    })
    ?.sort((a, b) => {
      // Sort alphabetically by user name (case-insensitive)
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
          <h1 className="text-3xl font-bold text-[#0D1B2]">Investment Plans</h1>
          <p className="mt-1 text-sm text-gray-600">Manage investment plans available to users</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {/* User Activations Table */}
      <div className="card bg-white border border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0D1B2] flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-[#4C6FFF] to-[#00D4FF] rounded-full"></div>
                User Plan Activations
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Complete list of users and their activated investment plans
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#4C6FFF] to-[#00D4FF] px-6 py-3 rounded-xl shadow-md">
              <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Total Active</div>
              <div className="text-2xl font-bold text-white mt-1">
                {filteredActivations?.length || 0}
              </div>
            </div>
          </div>

          {/* Search Bar for Table */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, username, or plan name..."
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

          {filteredActivations && filteredActivations.length > 0 ? (
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
                      Activated Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Plan Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Activated At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredActivations.map((activation, index) => {
                      const user = users?.find(u => u.id === activation.userId)
                      const plan = plans?.find(p => p.id === activation.planId)
                      return (
                        <tr 
                          key={activation.id} 
                          className="hover:bg-gradient-to-r hover:from-[#4C6FFF]/5 hover:to-[#00D4FF]/5 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {activation.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#0D1B2] group-hover:text-[#4C6FFF] transition-colors">
                                  {activation.userName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                            <div className="text-sm text-gray-700 font-medium">{activation.userEmail}</div>
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
                                  {activation.planName}
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
                              <DollarSign className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-bold text-emerald-700">
                                {plan ? `${plan.priceCurrency}${plan.price.toLocaleString()}` : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                            <div className="flex flex-col gap-0.5">
                              <div className="text-sm font-semibold text-gray-700">
                                {format(new Date(activation.activatedAt), 'MMM d, yyyy')}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                {format(new Date(activation.activatedAt), 'h:mm a')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                              activation.isActive
                                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-gray-50 text-gray-700 border border-gray-300'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                activation.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}></div>
                              {activation.isActive ? 'Active' : 'Inactive'}
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
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold text-lg">No plan activations found</p>
              <p className="text-sm text-gray-500 mt-2">Users will appear here once they activate an investment plan</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search plans by name or description..."
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
              className="card bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-extrabold text-[#0D1B2] tracking-tight">{plan.name}</h3>
                      {plan.badge && (
                        <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-[#4C6FFF] to-[#00D4FF] text-white rounded-full shadow-sm uppercase tracking-wider">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-700 font-medium mb-3 leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
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

                <div className="space-y-3.5 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-[#4C6FFF]/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#4C6FFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-lg font-bold text-[#0D1B2]">
                        {plan.priceCurrency}{plan.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
                      <Clock className="h-5 w-5 text-[#00D4FF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Mining Time</p>
                      <p className="text-base font-bold text-[#0D1B2]">
                        {plan.miningTimeHours === 0 ? 'Auto' : `${plan.miningTimeHours} hours`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Gift className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Eggs Per Day</p>
                      <p className="text-base font-bold text-[#0D1B2]">{plan.eggsPerDay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`p-2 rounded-lg ${plan.isActive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                      {plan.isActive ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Status</p>
                      <p className={`text-base font-bold ${plan.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#4C6FFF]/5 to-[#00D4FF]/5 rounded-lg border border-[#4C6FFF]/20">
                    <div className="p-2 bg-[#4C6FFF]/20 rounded-lg">
                      <Users className="h-5 w-5 text-[#4C6FFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#4C6FFF] uppercase tracking-wider mb-0.5">Active Users</p>
                      <p className="text-base font-bold text-[#4C6FFF]">
                        {getActivationCount(plan.id)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Features</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#4C6FFF] to-[#00D4FF] flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
                {isCreating ? 'Create Investment Plan' : 'Edit Investment Plan'}
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
                    placeholder="starter"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Starter Plan"
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
                    placeholder="Mine every 20 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={editForm.priceCurrency || '$'}
                      onChange={(e) => setEditForm({ ...editForm, priceCurrency: e.target.value })}
                      className="input-field w-20"
                    >
                      <option value="$">$</option>
                      <option value="Rs.">Rs.</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      className="input-field flex-1"
                      placeholder="500"
                      min="0"
                      step="0.01"
                    />
                  </div>
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
                    Mining Time (Hours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editForm.miningTimeHours || ''}
                    onChange={(e) => setEditForm({ ...editForm, miningTimeHours: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="20"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for auto-mining</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eggs Per Day <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editForm.eggsPerDay || ''}
                    onChange={(e) => setEditForm({ ...editForm, eggsPerDay: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="1"
                    min="0"
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

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    className="input-field flex-1"
                    placeholder="Add a feature..."
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editForm.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="flex-1 text-sm text-gray-700">{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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

