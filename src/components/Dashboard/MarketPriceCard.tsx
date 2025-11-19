interface MarketPriceCardProps {
  title: string
  value: string
  icon: string
  change?: string
}

export default function MarketPriceCard({ title, value, change }: MarketPriceCardProps) {
  const getCardTheme = () => {
    if (title === 'Egg Balance') {
      return {
        gradient: 'linear-gradient(135deg, rgba(76, 111, 255, 0.15) 0%, rgba(76, 111, 255, 0.1) 100%)',
        iconBg: 'linear-gradient(135deg, rgba(76, 111, 255, 0.2), rgba(76, 111, 255, 0.15))',
        border: 'rgba(76, 111, 255, 0.3)',
        glow: 'rgba(76, 111, 255, 0.2)',
        textColor: '#0D1B2'
      }
    } else if (title === 'Current Price') {
      return {
        gradient: 'linear-gradient(135deg, rgba(13, 27, 34, 0.1) 0%, rgba(13, 27, 34, 0.08) 100%)',
        iconBg: 'linear-gradient(135deg, rgba(13, 27, 34, 0.15), rgba(13, 27, 34, 0.1))',
        border: 'rgba(13, 27, 34, 0.2)',
        glow: 'rgba(13, 27, 34, 0.15)',
        textColor: '#0D1B2'
      }
    } else {
      return {
        gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(13, 27, 34, 0.08) 100%)',
        iconBg: 'linear-gradient(135deg, rgba(0, 212, 255, 0.18), rgba(13, 27, 34, 0.12))',
        border: 'rgba(0, 212, 255, 0.25)',
        glow: 'rgba(0, 212, 255, 0.15)',
        textColor: '#0D1B2'
      }
    }
  }

  const theme = getCardTheme()

  return (
    <div className="card relative group" style={{
      background: theme.gradient,
      borderColor: theme.border,
      transformStyle: 'preserve-3d'
    }}>
      {/* 3D shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 rounded-3xl"></div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
        boxShadow: `0 0 40px ${theme.glow}`,
        filter: 'blur(20px)'
      }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          {change && (
            <span className="text-xs text-green-600 font-bold bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-green-200 shadow-lg ml-auto">
              {change}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-xs mb-3 uppercase tracking-widest font-bold">{title}</p>
        <p className="text-3xl font-extrabold" style={{
          color: theme.textColor
        }}>
          {value}
        </p>
      </div>
    </div>
  )
}
