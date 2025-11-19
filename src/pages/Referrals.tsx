import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User, ReferralTreeNode } from '../types'
import { 
  Search, 
  Users, 
  ChevronRight, 
  ChevronDown,
  User as UserIcon,
  Gift,
  Mail,
  TrendingUp
} from 'lucide-react'

// Mock data with referral relationships
const mockUsersWithReferrals: User[] = [
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
    accountStatus: 'active',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastMiningAt: new Date(Date.now() - 10800000).toISOString(),
    deviceId: 'device-789',
    ipAddress: '192.168.1.3',
  },
  {
    id: '4',
    email: 'user4@example.com',
    phone: '+92 300 1111111',
    username: 'alice_brown',
    fullName: 'Alice Brown',
    password: 'alice123',
    eggBalance: 100,
    walletBalance: 300,
    referralCode: 'ALICE1',
    referrerId: '2',
    referrerCode: 'JANE456',
    totalReferrals: 1,
    eggsFromReferrals: 1,
    kycStatus: 'approved',
    accountStatus: 'active',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    lastMiningAt: new Date(Date.now() - 14400000).toISOString(),
    deviceId: 'device-111',
    ipAddress: '192.168.1.4',
  },
  {
    id: '5',
    email: 'user5@example.com',
    phone: '+92 300 2222222',
    username: 'charlie_davis',
    fullName: 'Charlie Davis',
    password: 'charlie456',
    eggBalance: 50,
    walletBalance: 150,
    referralCode: 'CHARL1',
    referrerId: '2',
    referrerCode: 'JANE456',
    totalReferrals: 0,
    eggsFromReferrals: 0,
    kycStatus: 'not_submitted',
    accountStatus: 'active',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    lastMiningAt: new Date(Date.now() - 18000000).toISOString(),
    deviceId: 'device-222',
    ipAddress: '192.168.1.5',
  },
  {
    id: '6',
    email: 'user6@example.com',
    phone: '+92 300 3333333',
    username: 'diana_white',
    fullName: 'Diana White',
    password: 'diana789',
    eggBalance: 300,
    walletBalance: 900,
    referralCode: 'DIANA1',
    referrerId: '3',
    referrerCode: 'BOB789',
    totalReferrals: 3,
    eggsFromReferrals: 3,
    kycStatus: 'approved',
    accountStatus: 'active',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    lastMiningAt: new Date(Date.now() - 21600000).toISOString(),
    deviceId: 'device-333',
    ipAddress: '192.168.1.6',
  },
]

// Build referral tree structure
const buildReferralTree = (users: User[]): ReferralTreeNode[] => {
  const userMap = new Map<string, ReferralTreeNode>()
  const roots: ReferralTreeNode[] = []

  // Create nodes
  users.forEach((user) => {
    userMap.set(user.id, { ...user, children: [], level: 0 })
  })

  // Build tree
  users.forEach((user) => {
    const node = userMap.get(user.id)!
    if (user.referrerId) {
      const parent = userMap.get(user.referrerId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(node)
        node.level = (parent.level || 0) + 1
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

// Calculate total referrals recursively
const calculateTotalReferrals = (node: ReferralTreeNode): number => {
  let total = node.totalReferrals
  if (node.children) {
    node.children.forEach((child) => {
      total += calculateTotalReferrals(child)
    })
  }
  return total
}

interface TreeNodeProps {
  node: ReferralTreeNode
  level: number
  expandedNodes: Set<string>
  onToggle: (id: string) => void
}

function TreeNode({ node, level, expandedNodes, onToggle }: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id)
  const hasChildren = node.children && node.children.length > 0
  const totalSubReferrals = node.children ? node.children.reduce((sum, child) => sum + calculateTotalReferrals(child), 0) : 0

  return (
    <div className="relative">
      {/* Node */}
      <div 
        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
          level === 0 
            ? 'bg-gradient-to-r from-[#4C6FFF]/10 to-[#00D4FF]/10 border-[#4C6FFF]/30 shadow-md' 
            : 'bg-white border-gray-200 hover:border-[#4C6FFF]/50 hover:shadow-sm'
        }`}
        style={{ marginLeft: `${level * 40}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[#4C6FFF]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#4C6FFF] flex items-center justify-center text-white font-bold text-lg shadow-md">
          {node.fullName.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#0D1B2] truncate">{node.fullName}</h3>
            {level === 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#4C6FFF] text-white rounded-full">
                Root
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {node.email}
            </span>
            <span className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              @{node.username}
            </span>
            <span className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              {node.referralCode}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-[#4C6FFF]">{node.totalReferrals}</div>
            <div className="text-xs text-gray-500">Direct</div>
          </div>
          {totalSubReferrals > 0 && (
            <div className="text-center">
              <div className="font-bold text-[#00D4FF]">{totalSubReferrals}</div>
              <div className="text-xs text-gray-500">Sub</div>
            </div>
          )}
          <div className="text-center">
            <div className="font-bold text-[#0D1B2]">🥚 {node.eggBalance}</div>
            <div className="text-xs text-gray-500">Eggs</div>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {/* Connector Line */}
      {hasChildren && isExpanded && level > 0 && (
        <div
          className="absolute left-0 top-16 bottom-0 w-0.5 bg-gray-300"
          style={{ marginLeft: `${level * 40 + 12}px` }}
        />
      )}
    </div>
  )
}

export default function Referrals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  // const [selectedRoot, setSelectedRoot] = useState<string | null>(null)

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['referrals'],
    queryFn: async () => {
      const stored = localStorage.getItem('users-data')
      if (stored) {
        return JSON.parse(stored)
      }
      localStorage.setItem('users-data', JSON.stringify(mockUsersWithReferrals))
      return mockUsersWithReferrals
    },
  })

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    if (!users) return
    const allIds = new Set(users.map((u) => u.id))
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const referralTree = users ? buildReferralTree(users) : []
  const filteredTree = searchTerm
    ? referralTree.filter((root) => {
        const searchLower = searchTerm.toLowerCase()
        const matchesRoot = 
          root.fullName.toLowerCase().includes(searchLower) ||
          root.email.toLowerCase().includes(searchLower) ||
          root.username.toLowerCase().includes(searchLower) ||
          root.referralCode.toLowerCase().includes(searchLower)
        
        const matchesChildren = (node: ReferralTreeNode): boolean => {
          if (
            node.fullName.toLowerCase().includes(searchLower) ||
            node.email.toLowerCase().includes(searchLower) ||
            node.username.toLowerCase().includes(searchLower) ||
            node.referralCode.toLowerCase().includes(searchLower)
          ) {
            return true
          }
          if (node.children) {
            return node.children.some(matchesChildren)
          }
          return false
        }
        
        return matchesRoot || matchesChildren(root)
      })
    : referralTree

  const totalUsers = users?.length || 0
  const totalReferrals = users?.reduce((sum, u) => sum + u.totalReferrals, 0) || 0
  const totalRootUsers = referralTree.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B2]">Referral Network</h1>
          <p className="mt-1 text-sm text-gray-600">View the complete referral tree structure</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm font-medium text-[#0D1B2] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm font-medium text-[#0D1B2] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-[#4C6FFF]/10 to-[#4C6FFF]/5 border-[#4C6FFF]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-[#0D1B2]">{totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-[#4C6FFF]" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-[#00D4FF]/10 to-[#00D4FF]/5 border-[#00D4FF]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Referrals</p>
              <p className="mt-2 text-3xl font-bold text-[#0D1B2]">{totalReferrals}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-[#00D4FF]" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Root Users</p>
              <p className="mt-2 text-3xl font-bold text-[#0D1B2]">{totalRootUsers}</p>
            </div>
            <UserIcon className="h-10 w-10 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, username, or referral code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Referral Tree */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C6FFF]"></div>
          </div>
        ) : filteredTree.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No referral network found</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredTree.map((root) => (
              <TreeNode
                key={root.id}
                node={root}
                level={0}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

