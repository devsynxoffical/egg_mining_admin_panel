import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import { MarketPrice as MarketPriceType } from '../types'
import { DollarSign, TrendingUp, TrendingDown, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function MarketPrice() {
  const [newPrice, setNewPrice] = useState('')
  const queryClient = useQueryClient()

  const { data: marketPrice, isLoading } = useQuery<MarketPriceType>({
    queryKey: ['market-price'],
    queryFn: async () => {
      // Check localStorage first, then fallback to default
      const stored = localStorage.getItem('market-price')
      if (stored) {
        return JSON.parse(stored)
      }
      return {
        currentPrice: 10.5,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin@eggmining.com',
      }
    },
  })

  const updatePriceMutation = useMutation({
    mutationFn: (price: number) => adminAPI.updateMarketPrice(price),
    onSuccess: () => {
      toast.success('Market price updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['market-price'] })
      setNewPrice('')
    },
    onError: (error: any, price: number) => {
      // Mock implementation - update localStorage
      const stored = localStorage.getItem('market-price')
      const marketPriceData = stored ? JSON.parse(stored) : { currentPrice: 10.5, lastUpdated: new Date().toISOString(), updatedBy: 'admin@eggmining.com' }
      
      const updated = {
        ...marketPriceData,
        currentPrice: price,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin@eggmining.com'
      }
      
      localStorage.setItem('market-price', JSON.stringify(updated))
      
      // Update dashboard stats
      const statsStored = localStorage.getItem('dashboard-stats')
      if (statsStored) {
        const stats = JSON.parse(statsStored)
        stats.marketPrice = price
        localStorage.setItem('dashboard-stats', JSON.stringify(stats))
      }
      
      queryClient.setQueryData(['market-price'], updated)
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      
      toast.success('Market price updated successfully!')
      setNewPrice('')
    },
  })

  const handleUpdatePrice = () => {
    const price = parseFloat(newPrice)
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    if (!confirm(`Are you sure you want to update the market price to Rs. ${price}?`)) {
      return
    }

    updatePriceMutation.mutate(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Market Price Management</h1>
        <p className="mt-1 text-sm text-gray-500">Control the current market price for eggs</p>
      </div>

      {/* Current Price Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Current Market Price</h2>
            {isLoading ? (
              <div className="animate-pulse h-12 w-32 bg-gray-200 rounded"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-8 w-8 text-primary-600" />
                <span className="text-4xl font-bold text-gray-900">
                  Rs. {marketPrice?.currentPrice || 0}
                </span>
                <span className="text-sm text-gray-500">per egg</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {marketPrice?.lastUpdated
                ? format(new Date(marketPrice.lastUpdated), 'MMM d, yyyy h:mm a')
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-1">by {marketPrice?.updatedBy || 'N/A'}</p>
          </div>
        </div>

        {/* Price Update Form */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Market Price</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                New Price (Rs.)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new price"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleUpdatePrice}
                disabled={updatePriceMutation.isPending || !newPrice}
                className="btn-primary flex items-center gap-2"
              >
                {updatePriceMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Price
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This will update the market price for all users in real-time.
          </p>
        </div>
      </div>

      {/* Price History (if available) */}
      {marketPrice?.history && marketPrice.history.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price History</h2>
          <div className="space-y-2">
            {marketPrice.history.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {index > 0 &&
                    (entry.price > marketPrice.history![index - 1].price ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ))}
                  <span className="text-sm font-medium text-gray-900">
                    Rs. {entry.price}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

