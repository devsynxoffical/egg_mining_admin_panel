import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import { User } from '../types'
import { 
  Search, 
  Eye, 
  EyeOff,
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Lock, 
  X,
  Save,
  Mail,
  Phone,
  User as UserIcon,
  UserPlus,
  Wallet,
  Gift,
  Shield,
  Calendar,
  Monitor,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Mock data storage
const mockUsersData: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    phone: '+92 300 1234567',
    username: 'john_doe',
    fullName: 'John Doe',
    password: 'password123',
    eggBalance: 150,
    walletBalance: 500,
    referralCode: 'JOHN123',
    referrerId: undefined,
    referrerCode: undefined,
    totalReferrals: 5,
    eggsFromReferrals: 5,
    kycStatus: 'approved',
    accountStatus: 'active',
    createdAt: new Date().toISOString(),
    lastMiningAt: new Date(Date.now() - 3600000).toISOString(),
    deviceId: 'device-123',
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    email: 'user2@example.com',
    phone: '+92 300 7654321',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    password: 'jane456',
    eggBalance: 75,
    walletBalance: 250,
    referralCode: 'JANE456',
    referrerId: '1',
    referrerCode: 'JOHN123',
    totalReferrals: 2,
    eggsFromReferrals: 2,
    kycStatus: 'pending',
    accountStatus: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastMiningAt: new Date(Date.now() - 7200000).toISOString(),
    deviceId: 'device-456',
    ipAddress: '192.168.1.2',
  },
  {
    id: '3',
    email: 'user3@example.com',
    phone: '+92 300 9876543',
    username: 'bob_wilson',
    fullName: 'Bob Wilson',
    password: 'bob789',
    eggBalance: 200,
    walletBalance: 750,
    referralCode: 'BOB789',
    referrerId: '1',
    referrerCode: 'JOHN123',
    totalReferrals: 8,
    eggsFromReferrals: 8,
    kycStatus: 'approved',
    accountStatus: 'suspended',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastMiningAt: new Date(Date.now() - 10800000).toISOString(),
    deviceId: 'device-789',
    ipAddress: '192.168.1.3',
  },
]

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'password' | null>(null)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    referrerCode: '',
    eggBalance: 0,
    walletBalance: 0,
  })
  const queryClient = useQueryClient()

  const { data: users, isLoading, refetch } = useQuery<User[]>({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const stored = localStorage.getItem('users-data')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('users-data', JSON.stringify(mockUsersData))
      return mockUsersData
    },
  })

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setViewMode('view')
    setEditForm({})
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      eggBalance: user.eggBalance,
      walletBalance: user.walletBalance,
    })
    setViewMode('edit')
  }

  const handleSaveEdit = async () => {
    if (!selectedUser) return

    try {
      try {
        await adminAPI.updateUser(selectedUser.id, editForm)
      } catch (apiError) {
        // Mock implementation
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : mockUsersData
        
        const updated = usersData.map((u) =>
          u.id === selectedUser.id ? { ...u, ...editForm } : u
        )
        
        localStorage.setItem('users-data', JSON.stringify(updated))
        queryClient.setQueryData(['users', searchTerm], updated)
      }
      
      toast.success('User updated successfully')
      refetch()
      setViewMode('view')
      setSelectedUser({ ...selectedUser, ...editForm } as User)
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const handleCreateUser = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.username || !createForm.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    // Check if username or email already exists
    const existingUser = users?.find(
      (u) => u.username === createForm.username || u.email === createForm.email
    )
    if (existingUser) {
      toast.error('Username or email already exists')
      return
    }

    // Find referrer if referrerCode is provided
    let referrerId: string | undefined
    let referrerCode: string | undefined
    if (createForm.referrerCode) {
      const referrer = users?.find((u) => u.referralCode === createForm.referrerCode.toUpperCase())
      if (referrer) {
        referrerId = referrer.id
        referrerCode = referrer.referralCode
      } else {
        toast.error('Invalid referral code')
        return
      }
    }

    try {
      const newUser: User = {
        id: Date.now().toString(),
        fullName: createForm.fullName,
        email: createForm.email,
        phone: createForm.phone || undefined,
        username: createForm.username,
        password: createForm.password,
        referralCode: createForm.username.toUpperCase().slice(0, 6) + Math.floor(Math.random() * 1000),
        referrerId,
        referrerCode,
        eggBalance: createForm.eggBalance,
        walletBalance: createForm.walletBalance,
        totalReferrals: 0,
        eggsFromReferrals: 0,
        kycStatus: 'not_submitted',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
      }

      try {
        await adminAPI.createUser(newUser)
      } catch (apiError) {
        // Mock implementation
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : mockUsersData
        
        const updated = [...usersData, newUser]
        
        // Update referrer's totalReferrals if applicable
        if (referrerId) {
          const updatedWithReferrer = updated.map((u) =>
            u.id === referrerId ? { ...u, totalReferrals: u.totalReferrals + 1 } : u
          )
          localStorage.setItem('users-data', JSON.stringify(updatedWithReferrer))
          queryClient.setQueryData(['users', searchTerm], updatedWithReferrer)
        } else {
          localStorage.setItem('users-data', JSON.stringify(updated))
          queryClient.setQueryData(['users', searchTerm], updated)
        }
      }
      
      toast.success('User created successfully')
      refetch()
      setShowCreateModal(false)
      setCreateForm({
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        referrerCode: '',
        eggBalance: 0,
        walletBalance: 0,
      })
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUser) return

    if (!newPassword.trim()) {
      toast.error('Please enter a new password')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      try {
        await adminAPI.changeUserPassword(selectedUser.id, newPassword)
      } catch (apiError) {
        // Mock implementation - update password in stored data
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : mockUsersData
        
        const updated = usersData.map((u) =>
          u.id === selectedUser.id ? { ...u, password: newPassword } : u
        )
        
        localStorage.setItem('users-data', JSON.stringify(updated))
        queryClient.setQueryData(['users', searchTerm], updated)
      }
      
      toast.success('Password changed successfully')
      setNewPassword('')
      setConfirmPassword('')
      setViewMode('view')
      // Update selected user to reflect password change
      setSelectedUser({ ...selectedUser, password: newPassword } as User)
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  const handleStatusChange = async (userId: string, status: 'active' | 'suspended' | 'blocked') => {
    try {
      try {
        await adminAPI.updateUserStatus(userId, status)
      } catch (apiError) {
        // Mock implementation
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : mockUsersData
        
        const updated = usersData.map((u) =>
          u.id === userId ? { ...u, accountStatus: status } : u
        )
        
        localStorage.setItem('users-data', JSON.stringify(updated))
        queryClient.setQueryData(['users', searchTerm], updated)
      }
      
      toast.success(`User status updated to ${status}`)
      refetch()
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, accountStatus: status } as User)
      }
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    try {
      try {
        await adminAPI.deleteUser(userId)
      } catch (apiError) {
        // Mock implementation
        const stored = localStorage.getItem('users-data')
        const usersData: User[] = stored ? JSON.parse(stored) : mockUsersData
        
        const updated = usersData.filter((u) => u.id !== userId)
        
        localStorage.setItem('users-data', JSON.stringify(updated))
        queryClient.setQueryData(['users', searchTerm], updated)
      }
      
      toast.success('User deleted successfully')
      refetch()
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
        setViewMode(null)
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B2]">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage all platform users and their details</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, email, username, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C6FFF]"></div>
          </div>
        ) : filteredUsers?.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    KYC Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Account Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#0D1B2]">{user.fullName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0D1B2]">
                        🥚 {user.eggBalance.toLocaleString()} eggs
                      </div>
                      <div className="text-sm text-gray-600">
                        Rs. {user.walletBalance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded ${
                          user.kycStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : user.kycStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : user.kycStatus === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded ${
                          user.accountStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : user.accountStatus === 'suspended'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.totalReferrals} ({user.eggsFromReferrals} eggs)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-[#4C6FFF] hover:bg-[#4C6FFF]/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-[#00D4FF] hover:bg-[#00D4FF]/10 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.accountStatus === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Activate"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View/Edit User Modal */}
      {selectedUser && viewMode && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            if (viewMode === 'view') {
              setSelectedUser(null)
              setViewMode(null)
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D1B2]">
                {viewMode === 'view' && 'User Details'}
                {viewMode === 'edit' && 'Edit User'}
                {viewMode === 'password' && 'Change Password'}
              </h2>
              <button
                onClick={() => {
                  setSelectedUser(null)
                  setViewMode(null)
                  setEditForm({})
                  setNewPassword('')
                  setConfirmPassword('')
                  setShowPassword(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* View Mode */}
            {viewMode === 'view' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0D1B2] border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Full Name
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Username
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">@{selectedUser.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Current Password
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-base text-[#0D1B2] font-mono flex-1">
                          {showPassword ? (selectedUser.password || 'N/A') : '••••••••'}
                        </p>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1.5 text-gray-500 hover:text-[#0D1B2] hover:bg-gray-100 rounded transition-colors"
                          title={showPassword ? 'Hide Password' : 'Show Password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0D1B2] border-b border-gray-200 pb-2">
                      Account Status
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        KYC Status
                      </label>
                      <span
                        className={`mt-1 inline-block px-3 py-1 text-sm font-medium rounded ${
                          selectedUser.kycStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : selectedUser.kycStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : selectedUser.kycStatus === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {selectedUser.kycStatus}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Account Status
                      </label>
                      <span
                        className={`mt-1 inline-block px-3 py-1 text-sm font-medium rounded ${
                          selectedUser.accountStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : selectedUser.accountStatus === 'suspended'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {selectedUser.accountStatus}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created At
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">
                        {format(new Date(selectedUser.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {selectedUser.lastMiningAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last Mining
                        </label>
                        <p className="text-base text-[#0D1B2] mt-1">
                          {format(new Date(selectedUser.lastMiningAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0D1B2] border-b border-gray-200 pb-2">
                      Financial Information
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Egg Balance
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1 font-semibold">
                        🥚 {selectedUser.eggBalance.toLocaleString()} eggs
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Wallet Balance
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1 font-semibold">
                        Rs. {selectedUser.walletBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0D1B2] border-b border-gray-200 pb-2">
                      Referral Information
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Referral Code
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1 font-mono">{selectedUser.referralCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Total Referrals
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">{selectedUser.totalReferrals}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Eggs from Referrals
                      </label>
                      <p className="text-base text-[#0D1B2] mt-1">{selectedUser.eggsFromReferrals}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Information */}
                {(selectedUser.deviceId || selectedUser.ipAddress) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0D1B2] border-b border-gray-200 pb-2">
                      Technical Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.deviceId && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Device ID
                          </label>
                          <p className="text-base text-[#0D1B2] mt-1 font-mono text-sm">{selectedUser.deviceId}</p>
                        </div>
                      )}
                      {selectedUser.ipAddress && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            IP Address
                          </label>
                          <p className="text-base text-[#0D1B2] mt-1 font-mono text-sm">{selectedUser.ipAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setViewMode('password')
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>
                  <button
                    onClick={() => handleEditUser(selectedUser)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#00D4FF] hover:bg-[#00B8E6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit User
                  </button>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {viewMode === 'edit' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName || ''}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Egg Balance
                    </label>
                    <input
                      type="number"
                      value={editForm.eggBalance || ''}
                      onChange={(e) => setEditForm({ ...editForm, eggBalance: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Balance
                    </label>
                    <input
                      type="number"
                      value={editForm.walletBalance || ''}
                      onChange={(e) => setEditForm({ ...editForm, walletBalance: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setViewMode('view')
                      setEditForm({})
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Password Change Mode */}
            {viewMode === 'password' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Changing the password for <strong>{selectedUser.fullName}</strong> ({selectedUser.email})
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setViewMode('view')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
                    disabled={!newPassword || !confirmPassword}
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0D1B2]">Create New User</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    username: '',
                    password: '',
                    referrerCode: '',
                    eggBalance: 0,
                    walletBalance: 0,
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="input-field"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="input-field"
                    placeholder="john_doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="input-field"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="input-field"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referrer Code
                  </label>
                  <input
                    type="text"
                    value={createForm.referrerCode}
                    onChange={(e) => setCreateForm({ ...createForm, referrerCode: e.target.value.toUpperCase() })}
                    className="input-field"
                    placeholder="JOHN123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Egg Balance
                  </label>
                  <input
                    type="number"
                    value={createForm.eggBalance}
                    onChange={(e) => setCreateForm({ ...createForm, eggBalance: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Wallet Balance
                  </label>
                  <input
                    type="number"
                    value={createForm.walletBalance}
                    onChange={(e) => setCreateForm({ ...createForm, walletBalance: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setCreateForm({
                      fullName: '',
                      email: '',
                      phone: '',
                      username: '',
                      password: '',
                      referrerCode: '',
                      eggBalance: 0,
                      walletBalance: 0,
                    })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4C6FFF] hover:bg-[#3D5CE6] rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
