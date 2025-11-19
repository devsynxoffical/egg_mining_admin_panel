import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - replace with actual API data
const mockData = [
  { year: '2024', price: 2.5 },
  { year: '2025', price: 2.8 },
  { year: '2026', price: 2.9 },
  { year: '2027', price: 3.1 },
  { year: '2028', price: 3.0 },
  { year: '2029', price: 3.2 },
  { year: '2030', price: 3.3 },
  { year: '2031', price: 3.06 },
]

export default function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={mockData}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#9B59B6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#667eea" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
        <XAxis 
          dataKey="year" 
          stroke="#6B7280"
          tick={{ fill: '#0D1B2', fontSize: 12, fontFamily: 'Inter', fontWeight: 500 }}
          style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: 500 }}
        />
        <YAxis 
          stroke="#6B7280"
          tick={{ fill: '#0D1B2', fontSize: 12, fontFamily: 'Inter', fontWeight: 500 }}
          style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: 500 }}
          label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', fill: '#0D1B2', fontSize: 12, fontFamily: 'Inter', fontWeight: 500 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontFamily: 'Inter',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            color: '#0D1B2'
          }}
          labelStyle={{ color: '#0D1B2', fontWeight: 600 }}
          itemStyle={{ color: '#0D1B2' }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="url(#lineGradient)" 
          strokeWidth={4}
          dot={{ fill: '#FFD700', r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
          activeDot={{ r: 9, fill: '#667eea', stroke: '#FFFFFF', strokeWidth: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
