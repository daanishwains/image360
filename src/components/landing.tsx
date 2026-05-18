'use client';

import { motion } from 'framer-motion';
import { Zap, Layers, FileJson, Palette, ImageIcon, Wrench, Sparkles, ArrowRight, Play, Loader2 } from 'lucide-react';
import { useGenerationStore } from '@/stores/generation-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useCallback } from 'react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Single image generation in seconds with our optimized rendering pipeline.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Layers,
    title: 'Bulk Engine',
    description: 'Generate up to 50 images simultaneously with parallel processing.',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: FileJson,
    title: 'JSON Workflows',
    description: 'Create automated generation pipelines with JSON-based workflows.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Style Presets',
    description: '16+ curated artistic styles from cinematic to anime and beyond.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: ImageIcon,
    title: 'HD Gallery',
    description: 'Beautiful masonry image gallery with favorites and collections.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Wrench,
    title: 'Studio Tools',
    description: 'Professional editing suite with lighting, camera, and style controls.',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

const stats = [
  { value: '10M+', label: 'Images Generated' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<5s', label: 'Generation Time' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Landing() {
  const { generateSingle, setPrompt, isGenerating, currentResult, currentPrompt } = useGenerationStore();
  const { setView } = useUIStore();
  const [demoPrompt, setDemoPrompt] = useState('cinematic futuristic city at sunset, ultra detailed');

  const handleDemoGenerate = useCallback(async () => {
    setPrompt(demoPrompt);
    // Small delay to ensure state is set
    await new Promise((r) => setTimeout(r, 50));
    await generateSingle();
  }, [demoPrompt, setPrompt, generateSingle]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#0a0a14] to-pink-950/30 animate-gradient-shift" />
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-float" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[100px] animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/2 w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[100px] animate-float-slow" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Create Stunning{' '}
            <span className="gradient-text">AI Art</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Professional-grade AI image generation platform. Single, bulk, and workflow modes
            with ultra-fast parallel rendering.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              onClick={() => setView('studio')}
              className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 rounded-xl"
              size="lg"
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 text-base font-semibold border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Everything you need to create professional AI-generated images at scale.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.06)' }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Try It <span className="gradient-text">Live</span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg">
              Experience the power of AI image generation right here.
            </p>
          </motion.div>

          <motion.div
            className="glass-strong rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
                placeholder="Describe your image..."
                className="flex-1 h-12 bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) handleDemoGenerate();
                }}
              />
              <Button
                onClick={handleDemoGenerate}
                disabled={isGenerating || !demoPrompt.trim()}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 rounded-xl font-semibold min-w-[160px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {/* Result Area */}
            <div className="mt-6 min-h-[200px] sm:min-h-[300px] rounded-xl border border-white/5 bg-black/20 flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-sm">Creating your masterpiece...</p>
                </div>
              ) : currentResult?.imageUrl ? (
                <motion.div
                  className="w-full h-full p-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <img
                    src={currentResult.imageUrl}
                    alt={currentResult.prompt}
                    className="w-full h-[200px] sm:h-[300px] object-cover rounded-lg"
                  />
                  <p className="mt-2 text-xs text-gray-500 truncate px-1">{currentResult.prompt}</p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <ImageIcon className="h-12 w-12 opacity-30" />
                  <p className="text-sm">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Create?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of creators using PixelForge AI to bring their visions to life.
            </p>
            <Button
              onClick={() => setView('studio')}
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 rounded-xl animate-pulse-glow"
              size="lg"
            >
              Start Generating for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 py-8 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="font-semibold text-white">PixelForge AI</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; 2024 PixelForge AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
