'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Users, CreditCard, ArrowLeftRight, Shield, DollarSign, UserCheck, Activity } from 'lucide-react'
import type { Profile, Transaction } from '@/types'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0, totalBalance: 0, totalTransactions: 0,
    adminCount: 0, staffCount: 0, todayTransactions: 0,
  })
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => { fetchStats(); fetchRecentData() }, [])

  const fetchStats = async () => {
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: txCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true })
    const { count: adminCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
    const { count: staffCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'staff')
    const { data: accounts } = await supabase.from('accounts').select('balance')
    const totalBal = accounts?.reduce((sum, a) => sum + (a.balance || 0), 0) || 0
    const today = new Date().toISOString().split('T')[0]
    const { count: todayTx } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).gte('created_at', today)
    setStats({ totalUsers: userCount || 0, totalBalance: totalBal, totalTransactions: txCount || 0, adminCount: adminCount || 0, staffCount: staffCount || 0, todayTransactions: todayTx || 0 })
  }

  const fetchRecentData = async () => {
    const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
    const { data: transactions } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5)
    setRecentUsers(users || [])
    setRecentTransactions(transactions || [])
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-lg ${color}`}><Icon className="w-6 h-6 text-white" /></div></div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-yellow-400" />
          <div><span className="text-xl font-bold">Admin Portal</span><span className="ml-3 text-sm text-gray-400">{profile?.full_name || profile?.id?.slice(0,8)}</span></div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">ADMIN</span>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-300 hover:text-white transition">Back to App</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
          <StatCard icon={DollarSign} label="Total Balance (All Accounts)" value={`$${stats.totalBalance.toLocaleString()}`} color="bg-green-600" />
          <StatCard icon={ArrowLeftRight} label="Total Transactions" value={stats.totalTransactions} color="bg-purple-600" />
          <StatCard icon={Shield} label="Admins" value={stats.adminCount} color="bg-red-600" />
          <StatCard icon={UserCheck} label="Staff" value={stats.staffCount} color="bg-orange-600" />
          <StatCard icon={Activity} label="Today's Transactions" value={stats.todayTransactions} color="bg-teal-600" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => router.push('/admin/users')} className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"><Users className="w-4 h-4" /> Manage Users</button>
            <button onClick={() => router.push('/admin/accounts')} className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center gap-2"><CreditCard className="w-4 h-4" /> Manage Accounts</button>
            <button onClick={() => router.push('/admin/transactions')} className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"><ArrowLeftRight className="w-4 h-4" /> All Transactions</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h3>
            <div className="space-y-3">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-800">{u.full_name || 'Unnamed User'}</p><p className="text-xs text-gray-500">{u.id.slice(0,8)}... • {u.role}</p></div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'staff' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-800">{tx.description}</p><p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p></div>
                  <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'credit' ? '+' : '-'}${tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}