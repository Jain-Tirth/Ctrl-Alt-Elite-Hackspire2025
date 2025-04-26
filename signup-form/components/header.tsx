"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  User,
  Home,
  Zap,
  DollarSign,
  FileText,
  ChevronRight,
  ChevronDown,
  Bell,
  Clock,
  Calendar,
  History
} from "lucide-react"

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mounted, setMounted] = useState(false)

  // Handle client-side only code
  useEffect(() => {
    setMounted(true)

    // Determine active section based on current path
    const path = window.location.pathname
    if (path === '/') setActiveSection('home')
    else if (path.includes('/learn')) setActiveSection('features')
    else if (path.includes('/pricing')) setActiveSection('pricing')
    else if (path.includes('/docs')) setActiveSection('docs')
    else if (path.includes('/queue-status')) setActiveSection('queue')
    else if (path.includes('/notifications')) setActiveSection('notifications')
    else if (path.includes('/book-slot')) setActiveSection('book-slot')
    else if (path.includes('/visit-history')) setActiveSection('history')

    // Close nav when route changes (for mobile)
    const handleRouteChange = () => {
      setIsNavOpen(false)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h2 className="text-yellow-300 font-bold text-2xl">
              Queue<span className="text-white">Wise</span><span className="text-blue-400 text-sm ml-1">Pro</span>
            </h2>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-yellow-300">
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold rounded-full">
                Sign Up
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white ml-2"
              onClick={() => setIsNavOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Left Side Navigation - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900/90 backdrop-blur-md border-r border-gray-800 pt-20 hidden md:block z-30">
        <nav className="p-4 h-full overflow-y-auto">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-2">
              <Link
                href="/"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "home"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("home")}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
              </Link>

              {/* QueueWise Pro Navigation */}
              <div className="pt-4 pb-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  QueueWise Pro
                </h3>
              </div>

              <Link
                href="/queue-status"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "queue"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("queue")}
              >
                <Clock className="h-5 w-5 mr-3" />
                <span>Queue Status</span>
              </Link>

              <Link
                href="/book-slot"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "book-slot"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("book-slot")}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Book Time Slot</span>
              </Link>

              <Link
                href="/notifications"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "notifications"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("notifications")}
              >
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </Link>

              <Link
                href="/visit-history"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "history"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("history")}
              >
                <History className="h-5 w-5 mr-3" />
                <span>Visit History</span>
              </Link>

              {/* Original Navigation */}
              <div className="pt-4 pb-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </h3>
              </div>

              <Link
                href="/learn"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "features"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("features")}
              >
                <Zap className="h-5 w-5 mr-3" />
                <span>Features</span>
              </Link>

              <Link
                href="/pricing"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "pricing"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("pricing")}
              >
                <DollarSign className="h-5 w-5 mr-3" />
                <span>Pricing</span>
              </Link>

              <Link
                href="/docs"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeSection === "docs"
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setActiveSection("docs")}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>Documentation</span>
              </Link>
            </div>

            {/* Documentation Submenu - Only show when mounted to prevent hydration mismatch */}
            {mounted && activeSection === "docs" && (
              <div className="pl-12 space-y-2">
                <Link
                  href="/docs#introduction"
                  className="block text-sm text-gray-400 hover:text-white py-1"
                >
                  Introduction
                </Link>
                <Link
                  href="/docs#quickstart"
                  className="block text-sm text-gray-400 hover:text-white py-1"
                >
                  Quick Start
                </Link>
                <Link
                  href="/docs#api"
                  className="block text-sm text-gray-400 hover:text-white py-1"
                >
                  API Reference
                </Link>
              </div>
            )}

            {/* Features Submenu - Only show when mounted to prevent hydration mismatch */}
            {mounted && activeSection === "features" && (
              <div className="pl-12 space-y-2">
                <Link
                  href="/learn#features"
                  className="block text-sm text-gray-400 hover:text-white py-1"
                >
                  Core Capabilities
                </Link>
                <Link
                  href="/learn#technical"
                  className="block text-sm text-gray-400 hover:text-white py-1"
                >
                  Technical Specs
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Sliding Navigation */}
      <div className={`fixed inset-0 bg-black z-50 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-yellow-300 font-bold text-2xl">
              Queue<span className="text-white">Wise</span><span className="text-blue-400 text-sm ml-1">Pro</span>
            </h2>
            <button
              className="text-white"
              onClick={() => setIsNavOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Home</span>
            </Link>

            {/* QueueWise Pro Section */}
            <div className="pt-2 pb-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                QueueWise Pro
              </h3>
            </div>

            <Link
              href="/queue-status"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <Clock className="h-5 w-5 mr-3" />
              <span>Queue Status</span>
            </Link>

            <Link
              href="/book-slot"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <Calendar className="h-5 w-5 mr-3" />
              <span>Book Time Slot</span>
            </Link>

            <Link
              href="/notifications"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <Bell className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </Link>

            <Link
              href="/visit-history"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <History className="h-5 w-5 mr-3" />
              <span>Visit History</span>
            </Link>

            {/* Company Section */}
            <div className="pt-2 pb-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Company
              </h3>
            </div>

            <div>
              <button
                className="flex items-center justify-between w-full text-white hover:text-yellow-300 py-2"
                onClick={() => setActiveSection(activeSection === "features" ? "" : "features")}
              >
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-3" />
                  <span>Features</span>
                </div>
                {activeSection === "features" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {mounted && activeSection === "features" && (
                <div className="pl-8 mt-2 space-y-2">
                  <Link
                    href="/learn#features"
                    className="block text-gray-400 hover:text-white py-1"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Core Capabilities
                  </Link>
                  <Link
                    href="/learn#technical"
                    className="block text-gray-400 hover:text-white py-1"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Technical Specs
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="flex items-center text-white hover:text-yellow-300 py-2"
              onClick={() => setIsNavOpen(false)}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              <span>Pricing</span>
            </Link>

            <div>
              <button
                className="flex items-center justify-between w-full text-white hover:text-yellow-300 py-2"
                onClick={() => setActiveSection(activeSection === "docs" ? "" : "docs")}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3" />
                  <span>Documentation</span>
                </div>
                {activeSection === "docs" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {mounted && activeSection === "docs" && (
                <div className="pl-8 mt-2 space-y-2">
                  <Link
                    href="/docs#introduction"
                    className="block text-gray-400 hover:text-white py-1"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Introduction
                  </Link>
                  <Link
                    href="/docs#quickstart"
                    className="block text-gray-400 hover:text-white py-1"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Quick Start
                  </Link>
                  <Link
                    href="/docs#api"
                    className="block text-gray-400 hover:text-white py-1"
                    onClick={() => setIsNavOpen(false)}
                  >
                    API Reference
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="mt-auto space-y-4">
            <Link href="/login" onClick={() => setIsNavOpen(false)}>
              <Button variant="outline" className="w-full text-white border-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsNavOpen(false)}>
              <Button className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
