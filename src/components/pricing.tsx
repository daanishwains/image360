'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Pricing() {
  const { setView } = useUIStore();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#0a0a14] to-pink-950/30 animate-gradient-shift" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[100px] animate-float-delayed" />
      </div>

      <div className="relative px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              Simple, Transparent{' '}
              <span className="gradient-text">Pricing</span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Choose the plan that fits your creative needs. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className={`relative rounded-2xl ${
                  plan.highlighted
                    ? 'glass-strong md:scale-105 md:-my-4'
                    : 'glass'
                } p-6 sm:p-8 transition-all duration-300`}
              >
                {/* Gradient border for highlighted card */}
                {plan.highlighted && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-500 -z-10 opacity-20 blur-sm" />
                    <div className="absolute inset-[1px] rounded-2xl bg-[#0f0f1a] -z-10" />
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500/40 via-pink-500/40 to-violet-500/40 -z-20" />
                  </>
                )}

                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-500/30">
                      <Sparkles className="h-3.5 w-3.5" />
                      Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gray-600'
                      }`}>
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => setView('studio')}
                  className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Note */}
          <motion.p
            className="mt-12 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            All plans include SSL encryption, 24/7 monitoring, and automatic backups.
            <br />
            Need a custom plan?{' '}
            <button className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
              Contact our sales team
            </button>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
