import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'

export const metadata: Metadata = {
  title: 'QueueWise Pro - AI-Powered Queue Management System',
  description: 'Advanced queue management with wait time prediction, time slot recommendation, and real-time adaptation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main className="pt-16 md:pl-64">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
