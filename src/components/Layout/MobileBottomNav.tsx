import { NavLink } from 'react-router-dom'
import { LayoutDashboard, DollarSign, User } from 'lucide-react'

const mobileNav = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Market', href: '/market-price', icon: DollarSign },
  { name: 'Profile', href: '/users', icon: User },
]

export default function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-subtle-gray z-40">
      <div className="flex justify-around items-center h-16">
        {mobileNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-accent-gold' : 'text-subtle-gray'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-body">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

