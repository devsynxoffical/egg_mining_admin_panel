import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        // TODO: Replace with actual Firebase/backend authentication
        // For now, simple check against env variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@eggmining.com'
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
        
        if (email === adminEmail && password === adminPassword) {
          set({
            isAuthenticated: true,
            user: {
              email,
              name: 'Admin User',
            },
          })
        } else {
          throw new Error('Invalid credentials')
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

