import { Activity } from 'lucide-react'
import { format } from 'date-fns'

// Mock data - replace with actual API data
const mockActivities = [
  {
    id: '1',
    action: 'User mined egg',
    userName: 'john_doe',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    action: 'KYC approved',
    userName: 'jane_smith',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    action: 'Egg transfer completed',
    userName: 'bob_wilson',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
]

export default function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0">
            <div className="bg-primary-100 p-2 rounded-full">
              <Activity className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-500 mt-1">
                {activity.userName} • {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

