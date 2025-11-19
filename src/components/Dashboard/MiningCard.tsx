import { X } from 'lucide-react'

interface MiningCardProps {
  onClose: () => void
}

export default function MiningCard({ onClose }: MiningCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white" style={{
      transformStyle: 'preserve-3d'
    }}>
      {/* Animated 3D background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, 
                rgba(76, 111, 255, ${0.08 + Math.random() * 0.12}), 
                rgba(0, 212, 255, ${0.08 + Math.random() * 0.12}))`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              filter: 'blur(40px)',
              opacity: 0.6
            }}
          />
        ))}
      </div>
      
      {/* 3D Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        transform: 'perspective(1000px) rotateX(60deg)',
        transformOrigin: 'center center'
      }}></div>
      
      <div className="relative p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl hover:bg-white/30 transition-all bg-white/20 backdrop-blur-md shadow-lg"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* 3D Chicken Illustration */}
          <div className="flex-shrink-0 relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Multi-layer glow */}
            <div className="absolute inset-0 bg-[#4C6FFF] rounded-full blur-3xl opacity-15"></div>
            
            <div 
              className="relative w-40 h-40 md:w-48 md:h-48 transform hover:scale-110 hover:rotate-3 transition-all duration-700"
              style={{ 
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 8px 16px rgba(76, 111, 255, 0.3))'
              }}
            >
              <img
                src="/Images/cutiee.png"
                alt="Mining Chicken"
                className="w-full h-full object-contain"
                style={{ 
                  transform: 'translateZ(40px)',
                  filter: 'brightness(1.1) contrast(1.1)'
                }}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (!target.parentElement?.querySelector('.fallback-chicken')) {
                    const fallback = document.createElement('div')
                    fallback.className = 'fallback-chicken text-7xl'
                    fallback.textContent = '🐔'
                    target.parentElement?.appendChild(fallback)
                  }
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0D1B2]" style={{
              lineHeight: '1.1'
            }}>
              Mine Eggs & Earn!
            </h2>
            <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed font-medium">
              Tap the chicken to mine eggs and start earning. Each tap gives you 1 egg every 24 hours!
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-lg border border-gray-200 shadow-sm transform hover:scale-105 transition-all">
                <span className="text-gray-700 text-sm font-semibold">Egg Balance: </span>
                <span className="text-[#4C6FFF] font-extrabold text-xl">23.390</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-lg border border-gray-200 shadow-sm transform hover:scale-105 transition-all">
                <span className="text-gray-700 text-sm font-semibold">Egg/Hour: </span>
                <span className="text-[#0D1B2] font-extrabold text-xl">1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
