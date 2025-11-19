import { Receipt } from 'lucide-react'

const mockTransactions = [
  { id: 1, type: 'Buy', amount: 10, price: 3.06, date: '2024-01-15', status: 'Completed' },
  { id: 4, type: 'Transfer', amount: 2, price: 0, date: '2024-01-14', status: 'Completed' },
]

export default function TransactionList() {
  return (
    <div className="card relative group" style={{
      background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.25) 0%, rgba(102, 126, 234, 0.2) 50%, rgba(255, 215, 0, 0.15) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transformStyle: 'preserve-3d'
    }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 50 + 15}px`,
              height: `${Math.random() * 50 + 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                rgba(155, 89, 182, ${0.2 + Math.random() * 0.3}), 
                rgba(102, 126, 234, ${0.2 + Math.random() * 0.3}))`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 6 + 6}s`,
              filter: 'blur(20px)',
              opacity: 0.5
            }}
          />
        ))}
      </div>
      
      <div className="relative p-6 z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple via-accent-blue to-accent-gold flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white drop-shadow-lg">Transaction List</h2>
        </div>
      
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-300 border-2 border-transparent hover:border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 group/item"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transform group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-400 shadow-xl ${
                  tx.type === 'Buy' ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
                  tx.type === 'Sell' ? 'bg-gradient-to-br from-red-400 to-pink-500 text-white' :
                  tx.type === 'Mining' ? 'bg-gradient-to-br from-accent-gold to-accent-orange text-white' :
                  'bg-gradient-to-br from-accent-blue to-accent-purple text-white'
                }`} style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                  transformStyle: 'preserve-3d'
                }}>
                  {tx.type === 'Buy' ? '📈' : tx.type === 'Sell' ? '📉' : tx.type === 'Mining' ? '⛏️' : '🔄'}
                </div>
                <div>
                  <p className="font-bold text-white text-sm drop-shadow">{tx.type}</p>
                  <p className="text-xs text-white/70 font-medium">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-white text-sm drop-shadow">
                  {tx.amount} {tx.type === 'Mining' || tx.type === 'Transfer' ? 'eggs' : ''}
                </p>
                {tx.price > 0 && (
                  <p className="text-xs text-white/70 font-medium">${(tx.amount * tx.price).toFixed(2)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
