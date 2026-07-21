'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'
import { AccountCard } from '@/components/AccountCard'
import { TransactionList } from '@/components/TransactionList'
import { TransferForm } from '@/components/TransferForm'
import { BillPayForm } from '@/components/BillPayForm'
export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !user) router.push('/login') }, [user, loading, router])
  if (loading) return <div className='flex items-center justify-center min-h-screen'>Loading...</div>
  if (!user) return null
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='max-w-7xl mx-auto p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Welcome back, {user.email}</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <AccountCard />
            <TransactionList />
          </div>
          <div className='space-y-6'>
            <TransferForm />
            <BillPayForm />
          </div>
        </div>
      </main>
    </div>
  )
}
