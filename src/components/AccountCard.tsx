'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
export function AccountCard() {
  const [account, setAccount] = useState<any>(null)
  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('accounts').select('*').eq('user_id', user.id).single()
      setAccount(data)
    }
    fetchAccount()
  }, [])
  if (!account) return <div className='bg-white p-6 rounded-xl shadow animate-pulse h-40' />
  return (
    <div className='bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-xl shadow-lg'>
      <div className='flex justify-between items-start mb-4'>
        <div><p className='text-blue-200 text-sm'>Total Balance</p><h2 className='text-3xl font-bold'>${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2></div>
        <Wallet className='w-8 h-8 text-blue-200' />
      </div>
      <div className='flex gap-6 text-sm'>
        <div className='flex items-center gap-1'><TrendingUp className='w-4 h-4 text-green-300' /><span>Income: +$4,250.00</span></div>
        <div className='flex items-center gap-1'><TrendingDown className='w-4 h-4 text-red-300' /><span>Expenses: -$1,840.50</span></div>
      </div>
      <p className='mt-4 text-blue-200 text-xs'>Account: ****{account.account_number?.slice(-4) || '1234'}</p>
    </div>
  )
}
