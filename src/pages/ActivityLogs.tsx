import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ActivityLog } from '../types'
import { FileText, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs', typeFilter],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          userId: '1',
          userName: 'john_doe',
          action: 'Mined egg',
          type: 'mining',
          details: { eggCount: 1 },
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          userId: '2',
          userName: 'jane_smith',
          action: 'KYC submission reviewed',
          type: 'kyc',
          details: { status: 'approved' },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          action: 'Market price updated',
          type: 'system',
          details: { oldPrice: 10.0, newPrice: 10.5 },
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ]
    },
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mining':
        return 'bg-blue-100 text-blue-800'
      case 'transaction':
        return 'bg-green-100 text-green-800'
      case 'kyc':
        return 'bg-yellow-100 text-yellow-800'
      case 'user_action':
        return 'bg-purple-100 text-purple-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || log.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor all platform activities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="mining">Mining</option>
            <option value="transaction">Transaction</option>
            <option value="kyc">KYC</option>
            <option value="user_action">User Action</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Activity Logs List */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredLogs?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No activity logs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs?.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(
                        log.type
                      )}`}
                    >
                      {log.type.replace('_', ' ')}
                    </span>
                  </div>
                  {log.userName && (
                    <p className="text-sm text-gray-600">User: {log.userName}</p>
                  )}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(log.details).map(([key, value]) => (
                        <span key={key} className="mr-4">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(log.timestamp), 'MMM d, yyyy h:mm:ss a')}
                    {log.ipAddress && ` • IP: ${log.ipAddress}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

