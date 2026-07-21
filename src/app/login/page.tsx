'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Check your email to confirm!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">C-Global Banking</h1>
        <p className="text-center text-gray-500 mb-6">Empowerment Portal</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-900 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition">{isSignUp ? 'Create Account' : 'Sign In'}</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">{isSignUp ? 'Already have an account?' : "Don't have an account?"} <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold hover:underline">{isSignUp ? 'Sign In' : 'Sign Up'}</button></p>
      </div>
    </div>
  )
}