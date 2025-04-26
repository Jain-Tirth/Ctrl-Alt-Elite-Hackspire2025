"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X, HelpCircle } from "lucide-react"

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Starter",
      description: "For small businesses and single locations",
      price: annual ? "199" : "19",
      period: annual ? "/year" : "/month per location",
      features: [
        { name: "AI wait time prediction", included: true },
        { name: "Up to 100 daily customers", included: true },
        { name: "Basic notifications (email)", included: true },
        { name: "7-day historical analytics", included: true },
        { name: "Single location support", included: true },
        { name: "Time slot booking", included: false },
        { name: "Anomaly detection", included: false },
        { name: "Multi-channel notifications", included: false },
      ],
      cta: "Start Free Trial",
      ctaLink: "/signup",
      highlight: false,
    },
    {
      name: "Business",
      description: "For growing businesses with multiple locations",
      price: annual ? "499" : "49",
      period: annual ? "/year" : "/month per location",
      features: [
        { name: "Advanced AI prediction engine", included: true },
        { name: "Unlimited daily customers", included: true },
        { name: "Multi-channel notifications", included: true },
        { name: "Smart time slot booking", included: true },
        { name: "30-day historical analytics", included: true },
        { name: "Up to 5 locations", included: true },
        { name: "Basic anomaly detection", included: true },
        { name: "API access", included: false },
      ],
      cta: "Start Free Trial",
      ctaLink: "/signup?plan=business",
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex requirements",
      price: "Custom",
      period: "",
      features: [
        { name: "Enterprise-grade prediction engine", included: true },
        { name: "Unlimited customers & locations", included: true },
        { name: "Advanced anomaly detection", included: true },
        { name: "Multi-center optimization", included: true },
        { name: "Full API access & webhooks", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "SLA with 99.99% uptime guarantee", included: true },
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-800/10 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              QueueWise Pro <span className="text-yellow-300">Pricing</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Scalable solutions for businesses of all sizes, with ROI-focused plans that grow with your needs
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-700"
              >
                <span className="sr-only">Toggle billing period</span>
                <span
                  className={`${
                    annual ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-yellow-300 transition`}
                />
              </button>
              <span className={`ml-3 ${annual ? 'text-gray-400' : 'text-white'}`}>Annual</span>
              <span className="ml-2 text-yellow-300 text-sm font-medium">Save 15%</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-gray-800/30 backdrop-blur-sm rounded-xl border ${
                  plan.highlight
                    ? 'border-yellow-300/50 shadow-lg shadow-yellow-300/10'
                    : 'border-gray-700/50'
                } overflow-hidden transition-all hover:border-yellow-300/30 hover:shadow-lg hover:shadow-yellow-300/5`}
              >
                {plan.highlight && (
                  <div className="bg-yellow-300 text-black text-center py-1 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.price === "Custom" ? "" : "$"}{plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>

                  <Link href={plan.ctaLink}>
                    <Button
                      className={`w-full mb-8 ${
                        plan.highlight
                          ? 'bg-yellow-300 hover:bg-yellow-400 text-black'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      } font-semibold py-3 rounded-lg`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-200' : 'text-gray-500'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 text-yellow-300 mr-2" />
                  How quickly can we implement QueueWise Pro?
                </h3>
                <p className="text-gray-300">
                  Most businesses can be fully operational with QueueWise Pro in as little as 48 hours. Our implementation team will guide you through the setup process, including system integration, staff training, and customization to match your specific requirements.
                </p>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 text-yellow-300 mr-2" />
                  Can QueueWise Pro integrate with our existing systems?
                </h3>
                <p className="text-gray-300">
                  Yes, QueueWise Pro is designed to integrate seamlessly with most business systems including CRMs, appointment scheduling software, customer service platforms, and digital signage. Our Business and Enterprise plans include integration support, and we offer custom integrations for specific needs.
                </p>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 text-yellow-300 mr-2" />
                  How accurate are the wait time predictions?
                </h3>
                <p className="text-gray-300">
                  QueueWise Pro's AI prediction engine achieves 97.8% accuracy in most environments after just 2-3 weeks of operation. The system continuously learns from your specific patterns and improves over time. Our Enterprise plan includes custom model training for environments with unique or complex queuing patterns.
                </p>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 text-yellow-300 mr-2" />
                  What kind of ROI can we expect?
                </h3>
                <p className="text-gray-300">
                  Our customers typically see ROI within the first month of implementation. On average, businesses report a 37% reduction in wait times, 42% improvement in customer satisfaction scores, 23% increase in staff efficiency, and 15% growth in customer throughput. We provide detailed analytics to help you track your specific ROI metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready for a personalized demo?</h2>
            <p className="text-xl text-gray-300 mb-8">
              See QueueWise Pro in action with your actual data and discover how it can transform your customer experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg rounded-full">
                  Schedule Demo
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                  View Case Studies
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-gray-400">
              "QueueWise Pro reduced our average wait times by 43% and customer complaints by 67% within just two months of implementation."
              <br />
              <span className="font-semibold text-white mt-2 block">— Sarah Johnson, Operations Director, National Health Services</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
