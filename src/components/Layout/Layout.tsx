import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-light-bg">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 sm:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

