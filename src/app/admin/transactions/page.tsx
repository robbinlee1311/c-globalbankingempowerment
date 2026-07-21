'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowLeftRight, Trash2, AlertTriangle } from 'lucide-react'
import type { Transaction } from '@/types'

interface TransactionWithUser extends Transaction {
  profiles: { full_name: string | null } | null;
}

export default function AdminTransactionsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([])
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState('')

  useEffect(() => { if (isAdmin) fetchTransactions() }, [isAdmin, filter])

  const fetchTransactions = async () => {
    let query = supabase.from('transactions').select('*, profiles(full_name)').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('type', filter)
    const { data } = await query
    setTransactions(data || [])
  }

  const deleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) { setMessage('Transaction deleted!'); fetchTransactions(); setTimeout(() => setMessage(''), 3000) }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="p-2 hover:bg-slate-800 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
          <ArrowLeftRight className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">Transaction Management</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {message}</div>}

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Transactions ({transactions.length})</h2>
            <div className="flex gap-2">
              {['all', 'credit', 'debit'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Transaction</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">User</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Type</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Amount</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Date</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{tx.description}</p><p className="text-xs text-gray-500">{tx.id.slice(0,12)}...</p></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.profiles?.full_name || 'Unknown'}</td>
                    <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.type}</span></td>
                    <td className="px-4 py-3 font-semibold">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3"><button onClick={() => deleteTransaction(tx.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"><Trash2 className="w-4 h-4" /></button></td>
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