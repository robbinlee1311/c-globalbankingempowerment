'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt, AlertTriangle } from 'lucide-react'

export function BillPayForm() {
  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const handlePayBill = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('transactions').insert({ user_id: user.id, type: 'debit', amount: parseFloat(amount), description: `Bill Payment to ${payee} (DEMO)`, status: 'completed' })
    if (!error) { setMessage('Demo bill payment processed!'); setPayee(''); setAmount('') }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Receipt className="w-5 h-5 text-blue-600" />Pay Bills</h3>
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4 flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" /><p className="text-xs text-yellow-700">Demo mode — no actual payments are processed.</p></div>
      <form onSubmit={handlePayBill} className="space-y-3">
        <input type="text" placeholder="Payee Name" value={payee} onChange={(e) => setPayee(e.target.value)} className="w-full p-3 border rounded-lg text-sm" required />
        <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border rounded-lg text-sm" required min="0.01" step="0.01" />
        <button type="submit" className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition">Pay Demo Bill</button>
      </form>
      {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
    </div>
  )
}