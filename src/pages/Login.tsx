import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-bg via-accent-gold/10 to-accent-blue/10 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-card-lg shadow-soft-dark">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent-gold/20 p-4 rounded-full">
              <span className="text-4xl">🥚</span>
            </div>
          </div>
          <h2 className="text-3xl font-heading font-bold text-text-dark">Egg Mining Admin</h2>
          <p className="mt-2 text-sm font-body text-subtle-gray">Sign in to your admin account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-heading font-semibold text-text-dark mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@eggmining.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-heading font-semibold text-text-dark mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-xs font-body text-subtle-gray">
          <p>Default credentials: admin@eggmining.com / admin123</p>
        </div>
      </div>
    </div>
  )
}

