interface EggBalanceCardProps {
  totalUsers?: number
  totalMined?: number
  totalEggsInCirculation?: number
}

export default function EggBalanceCard({ totalUsers = 0, totalMined = 0, totalEggsInCirculation = 0 }: EggBalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white" style={{
      transformStyle: 'preserve-3d'
    }}>
      {/* Animated 3D particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                rgba(76, 111, 255, ${0.1 + Math.random() * 0.15}), 
                rgba(0, 212, 255, ${0.1 + Math.random() * 0.15}))`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 8 + 8}s`,
              filter: 'blur(30px)',
              opacity: 0.7
            }}
          />
        ))}
      </div>
      
      {/* 3D Hexagon Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
        transform: 'perspective(1000px) rotateX(45deg)',
        transformOrigin: 'center center'
      }}></div>
      
      <div className="relative p-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* 3D Egg Display */}
          <div className="flex-shrink-0 relative" style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}>
            {/* Multi-layer 3D glow */}
            <div className="absolute inset-0 bg-[#4C6FFF] rounded-full blur-3xl opacity-20"></div>
            
            <div 
              className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center transform hover:scale-110 hover:rotateY-5 transition-all duration-700"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src="/Images/egg.png"
                alt="Egg"
                className="w-full h-full object-contain"
                style={{ 
                  transform: 'translateZ(60px)',
                  filter: 'drop-shadow(0 8px 16px rgba(76, 111, 255, 0.3))'
                }}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (!target.parentElement?.querySelector('.fallback-egg')) {
                    const fallback = document.createElement('div')
                    fallback.className = 'fallback-egg text-7xl'
                    fallback.textContent = '🥚'
                    target.parentElement?.appendChild(fallback)
                  }
                }}
              />
            </div>
          </div>

          {/* Stats Info */}
          <div className="flex-1 text-center md:text-left" style={{ transform: 'translateZ(30px)' }}>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-widest font-bold">Total Users</p>
                <p className="text-3xl md:text-4xl font-extrabold text-[#0D1B2] transform hover:scale-105 transition-transform">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-widest font-bold">Total Mined Eggs</p>
                <p className="text-2xl md:text-3xl font-extrabold text-[#4C6FFF] transform hover:scale-105 transition-transform">
                  {totalMined.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-widest font-bold">Total Eggs in Circulation</p>
                <p className="text-xl md:text-2xl font-extrabold text-[#0D1B2] transform hover:scale-105 transition-transform">
                  {totalEggsInCirculation.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(180deg) scale(1.15); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes rotateY-5 {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(5deg); }
        }
        .hover\\:rotateY-5:hover {
          transform: rotateY(5deg) scale(1.1);
        }
      `}</style>
    </div>
  )
}
