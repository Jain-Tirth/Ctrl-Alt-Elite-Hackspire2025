"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  MapPin
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ContactPage() {
  // Use client-side only rendering to prevent hydration errors
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  })

  const [formSubmitted, setFormSubmitted] = useState(false)

  // Only render the form after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send the form data to your backend
    console.log("Form submitted:", formData)
    setFormSubmitted(true)

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      company: "",
      message: ""
    })

    // Reset submission status after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Get in <span className="text-yellow-300">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Have questions about VeloAI? Our team is here to help you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 mb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <div className="lg:w-1/3">
                <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 h-full">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-yellow-300/10 p-3 rounded-lg mr-4">
                        <Mail className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-300">support@veloai.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yellow-300/10 p-3 rounded-lg mr-4">
                        <Phone className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-300">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yellow-300/10 p-3 rounded-lg mr-4">
                        <MapPin className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office</h3>
                        <p className="text-gray-300">
                          123 AI Boulevard<br />
                          San Francisco, CA 94107<br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yellow-300/10 p-3 rounded-lg mr-4">
                        <MessageSquare className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Live Chat</h3>
                        <p className="text-gray-300">
                          Available Monday to Friday<br />
                          9:00 AM - 6:00 PM EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:w-2/3">
                <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                  {formSubmitted ? (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                      <p className="text-green-300 font-medium">
                        Thank you for your message! We'll get back to you shortly.
                      </p>
                    </div>
                  ) : null}

                  {/* Only render the form on the client to prevent hydration errors */}
                  {mounted ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                        />
                      </div>

                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                          required
                        ></textarea>
                      </div>

                      <Button
                        type="submit"
                        className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg flex items-center"
                      >
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-pulse text-gray-400">Loading form...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Create your free account and start exploring the power of VeloAI today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg rounded-full">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
