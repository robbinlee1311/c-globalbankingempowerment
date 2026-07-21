'use client'
import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission)
    setNotifications([
      { id: 1, text: 'Welcome to C-Global Banking!', time: '2 min ago', read: false },
      { id: 2, text: 'Your demo account has been funded.', time: '1 hour ago', read: false },
      { id: 3, text: 'New security feature: 2FA available.', time: '3 hours ago', read: true },
    ])
  }, [])

  const requestBrowserNotify = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm === 'granted') new Notification('C-Global Banking', { body: 'Browser notifications enabled!' })
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-blue-800 rounded-lg transition">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="font-bold text-gray-800">Notifications</h4>
            <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-gray-500" /></button>
          </div>
          {permission !== 'granted' && (
            <div className="p-3 bg-blue-50 text-xs">
              <button onClick={requestBrowserNotify} className="text-blue-600 font-semibold hover:underline">Enable browser push notifications</button>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-3 border-b hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
                <p className="text-sm text-gray-800">{n.text}</p>
                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}