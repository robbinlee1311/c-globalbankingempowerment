'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Shield, UserCheck, User, Edit2, Save, X } from 'lucide-react'
import type { Profile } from '@/types'

type UserRole = 'admin' | 'staff' | 'user'

export default function AdminUsersPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('user')
  const [message, setMessage] = useState('')

  useEffect(() => { if (isAdmin) fetchUsers() }, [isAdmin])

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
  }

  const updateRole = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ role: editRole }).eq('id', userId)
    if (!error) { setMessage('Role updated successfully!'); setEditingId(null); fetchUsers(); setTimeout(() => setMessage(''), 3000) }
  }

  const filteredUsers = users.filter(u => (u.full_name?.toLowerCase() || '').includes(search.toLowerCase()) || u.id.includes(search) || u.role.includes(search.toLowerCase()))

  const getRoleIcon = (role: string) => { if (role === 'admin') return <Shield className="w-4 h-4 text-red-600" />; if (role === 'staff') return <UserCheck className="w-4 h-4 text-orange-600" />; return <User className="w-4 h-4 text-blue-600" /> }
  const getRoleColor = (role: string) => { if (role === 'admin') return 'bg-red-100 text-red-700 border-red-200'; if (role === 'staff') return 'bg-orange-100 text-orange-700 border-orange-200'; return 'bg-blue-100 text-blue-700 border-blue-200' }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="p-2 hover:bg-slate-800 rounded-lg transition"><ArrowLeft className="w-5 h-5" /></button>
          <Shield className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">User Management</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /> {message}</div>}

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Users ({users.length})</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">User</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Role</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Joined</th><th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">{(u.full_name?.[0] || 'U').toUpperCase()}</div>
                        <div><p className="font-medium text-gray-800">{u.full_name || 'Unnamed User'}</p><p className="text-xs text-gray-500">{u.id.slice(0,12)}...</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === u.id ? (
                        <select value={editRole} onChange={(e) => setEditRole(e.target.value as UserRole)} className="border rounded-lg px-3 py-1 text-sm">
                          <option value="user">User</option><option value="staff">Staff</option><option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(u.role)}`}>{getRoleIcon(u.role)} {u.role}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {editingId === u.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateRole(u.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"><Save className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingId(u.id); setEditRole(u.role as UserRole) }} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"><Edit2 className="w-4 h-4" /></button>
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