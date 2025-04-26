import './globals.css';
import './styles.css';
import './theme.css';
import Header from './components/header';
import { SessionProvider } from './context/SessionContext';
import { NotificationContainer } from './components/Notification';

export const metadata = {
  title: 'QueueWise Pro - AI-Powered Queue Management System',
  description: 'Advanced queue management with wait time prediction, time slot recommendation, and real-time adaptation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main>
            {children}
          </main>
          <NotificationContainer />
        </SessionProvider>
      </body>
    </html>
  )
}
