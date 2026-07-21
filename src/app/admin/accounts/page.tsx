'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Edit2, Save, X, DollarSign } from 'lucide-react'

interface AccountWithProfile {
  id: string; user_id: string; account_number: string; balance: number; currency: string; created_at: string;
  profiles: { full_name: string | null; role: string } | null;
}

export default function AdminAccountsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountWithProfile[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBalance, setEditBalance] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { if (isAdmin) fetchAccounts() }, [isAdmin])

  const fetchAccounts = async () => {
    const { data } = await supabase.from('accounts').select('*, profiles(full_name, role)').order('created_at', { ascending: false })
    setAccounts(data || [])
  }

  const updateBalance = async (accountId: string) => {
    const { error } = await supabase.from('accounts').update({ balance: parseFloat(editBalance) }).eq('id', accountId)
    if (!error) { setMessage('Balance updated successfully!'); setEditingId(null); fetchAccounts(); setTimeout(() => setMessage(''), 3000) }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="p-2 hover:bg-slate-800 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
          <CreditCard className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">Account Management</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /> {message}</div>}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6">All Accounts ({accounts.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Account</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Owner</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Balance</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CreditCard className="w-5 h-5 text-green-600" /></div>
                        <div><p className="font-medium text-gray-800">{acc.account_number}</p><p className="text-xs text-gray-500">{acc.currency}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{acc.profiles?.full_name || 'Unknown'}</p><p className="text-xs text-gray-500 capitalize">{acc.profiles?.role || 'user'}</p></td>
                    <td className="px-4 py-3">
                      {editingId === acc.id ? (
                        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><input type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} className="w-32 border rounded-lg px-3 py-1 text-sm" step="0.01" /></div>
                      ) : (<p className="font-semibold text-gray-800">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>)}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === acc.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateBalance(acc.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"><Save className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingId(acc.id); setEditBalance(acc.balance.toString()) }} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"><Edit2 className="w-4 h-4" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}