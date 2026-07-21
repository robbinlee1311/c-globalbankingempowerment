'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { ShieldAlert } from 'lucide-react'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/dashboard')
    }
  }, [user, isAdmin, loading, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <ShieldAlert className="w-16 h-16 text-red-500" />
      <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      <p className="text-gray-500">You need admin privileges to view this page.</p>
      <button onClick={() => router.push('/dashboard')} className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
        Back to Dashboard
      </button>
    </div>
  )

  return <>{children}</>
}