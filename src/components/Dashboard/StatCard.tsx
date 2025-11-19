import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
}: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-subtle-gray',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-body text-subtle-gray">{title}</p>
          <p className="mt-2 text-3xl font-heading font-bold text-text-dark">{value}</p>
          {change && (
            <p className={`mt-2 text-sm font-heading font-semibold ${changeColor[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="bg-[#4C6FFF]/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-[#4C6FFF]" />
        </div>
      </div>
    </div>
  )
}

