import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}