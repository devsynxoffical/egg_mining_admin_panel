import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface BuySellSectionProps {
  marketPrice: number
}

export default function BuySellSection({ marketPrice }: BuySellSectionProps) {
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')

  const handleNumberPad = (value: string, setValue: (val: string) => void) => {
    if (value === 'C') {
      setValue('')
    } else if (value === 'B') {
      setValue((prev) => prev.slice(0, -1))
    } else {
      setValue((prev) => prev + value)
    }
  }

  return (
    <div className="card relative group bg-white border border-gray-200" style={{
      transformStyle: 'preserve-3d'
    }}>
      {/* 3D animated background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                rgba(76, 111, 255, ${0.08 + Math.random() * 0.12}), 
                rgba(0, 212, 255, ${0.08 + Math.random() * 0.12}))`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 8}s`,
              filter: 'blur(25px)',
              opacity: 0.6
            }}
          />
        ))}
      </div>
      
      <div className="relative p-6 z-10">
        <h2 className="text-2xl font-extrabold text-[#0D1B2] mb-6">
          Egg - Money Exchange
        </h2>

        {/* Buy Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-[#0D1B2]">Buy Eggs</h3>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">Buy Eggs: <span className="text-[#4C6FFF] font-bold">${marketPrice.toFixed(2)}</span></p>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={buyAmount}
                readOnly
                className="flex-1 input-field text-right font-bold text-xl bg-white text-[#0D1B2] placeholder-gray-400 border-gray-300"
                placeholder="0"
              />
              <button className="btn-outline text-xs px-4 py-2.5">Max</button>
            </div>
            <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs text-gray-600 font-medium">Buy Pass:</span>
              <span className="text-xs font-bold text-[#0D1B2]">Eventnee Elster 803010</span>
              <label className="relative inline-flex items-center cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4C6FFF] shadow-sm"></div>
              </label>
            </div>
            <button className="btn-secondary w-full py-3 text-base">
              Buy
            </button>
          </div>

          {/* 3D Number Pad for Buy */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'B'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberPad(num, setBuyAmount)}
                className="py-3.5 bg-gray-50 hover:bg-[#0D1B2] hover:text-white rounded-lg font-bold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200 hover:border-[#0D1B2] text-sm text-[#0D1B2]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Sell Section */}
        <div>
          <h3 className="text-lg font-bold text-[#0D1B2] mb-3">Sell Eggs</h3>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={sellAmount}
                readOnly
                className="flex-1 input-field text-right font-bold text-xl bg-white text-[#0D1B2] placeholder-gray-400 border-gray-300"
                placeholder="0"
              />
              <button className="btn-outline text-xs px-4 py-2.5">Max</button>
            </div>
            <button className="btn-secondary w-full py-3 text-base">
              Sell
            </button>
          </div>

          {/* 3D Number Pad for Sell */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'B'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberPad(num, setSellAmount)}
                className="py-3.5 bg-gray-50 hover:bg-[#0D1B2] hover:text-white rounded-lg font-bold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200 hover:border-[#0D1B2] text-sm text-[#0D1B2]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
