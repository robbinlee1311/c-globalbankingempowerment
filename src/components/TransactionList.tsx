'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'

export function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      setTransactions(data || [])
    }
    fetchTransactions()
  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" />Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}</div>
              <div><p className="font-medium text-gray-800">{tx.description}</p><p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p></div>
            </div>
            <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}