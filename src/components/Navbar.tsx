'use client'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { NotificationBell } from './NotificationBell'
import { LogOut, Shield } from 'lucide-react'
export function Navbar() {
  const router = useRouter()
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }
  return (
    <nav className='bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg'>
      <div className='flex items-center gap-2'><Shield className='w-6 h-6' /><span className='text-xl font-bold'>C-Global Banking</span></div>
      <div className='flex items-center gap-4'><NotificationBell /><button onClick={handleLogout} className='flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition'><LogOut className='w-4 h-4' />Logout</button></div>
    </nav>
  )
}
