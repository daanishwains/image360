'use client';

import { motion } from 'framer-motion';
import {
  ImageIcon,
  Zap,
  HardDrive,
  Heart,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGenerationStore } from '@/stores/generation-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const statCards = [
  {
    key: 'totalGenerations',
    label: 'Total Generations',
    icon: ImageIcon,
    gradient: 'from-violet-500/20 to-purple-600/20',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-500/20',
  },
  {
    key: 'creditsUsed',
    label: 'Credits Used',
    icon: Zap,
    gradient: 'from-amber-500/20 to-orange-600/20',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'storage',
    label: 'Storage',
    icon: HardDrive,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    icon: Heart,
    gradient: 'from-rose-500/20 to-pink-600/20',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
  },
] as const;

// Simple bar chart data - mock for the last 7 days
function getDayLabels(): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => days[(today - 6 + i + 7) % 7]);
}

function getActivityData(generations: { createdAt: Date }[]): { day: string; count: number }[] {
  const labels = getDayLabels();
  const now = new Date();
  const counts = new Array(7).fill(0);

  generations.forEach((gen) => {
    const genDate = new Date(gen.createdAt);
    const diffDays = Math.floor((now.getTime() - genDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      counts[6 - diffDays]++;
    }
  });

  return labels.map((day, i) => ({ day, count: counts[i] }));
}

function getPopularPrompts(generations: { prompt: string }[]): { text: string; count: number }[] {
  const prefixMap = new Map<string, number>();

  generations.forEach((gen) => {
    const words = gen.prompt.trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
    if (words) {
      prefixMap.set(words, (prefixMap.get(words) || 0) + 1);
    }
  });

  return Array.from(prefixMap.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function Dashboard() {
  const {
    generations,
    totalGenerations,
    totalFavorites,
    currentPrompt,
    setPrompt,
    generateSingle,
    isGenerating,
  } = useGenerationStore();
  const { setPreviewImage } = useUIStore();

  const recentGenerations = generations.slice(0, 8);
  const activityData = getActivityData(generations);
  const popularPrompts = getPopularPrompts(generations);
  const maxCount = Math.max(...activityData.map((d) => d.count), 1);

  const creditsUsed = totalGenerations;
  const storageMB = (totalGenerations * 2.4).toFixed(1);

  const statValues: Record<string, string | number> = {
    totalGenerations,
    creditsUsed,
    storage: `${storageMB} MB`,
    favorites: totalFavorites,
  };

  const handleQuickGenerate = () => {
    if (currentPrompt.trim()) {
      generateSingle();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className={cn(
                'relative overflow-hidden rounded-2xl p-5',
                'bg-white/[0.04] border border-white/[0.06]',
                'backdrop-blur-sm',
                'hover:border-white/[0.1] transition-all duration-300',
                stat.borderColor
              )}
            >
              {/* Gradient accent */}
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', stat.gradient)} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {statValues[stat.key]}
                  </p>
                </div>
                <div className={cn('size-10 rounded-xl flex items-center justify-center', stat.iconBg)}>
                  <Icon className={cn('size-5', stat.iconColor)} />
                </div>
              </div>

              <div className="relative mt-3 flex items-center gap-1 text-[10px] text-white/30">
                <ArrowUpRight className="size-3" />
                <span>This month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Recent Generations + Quick Generate */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent Generations */}
          <motion.div
            variants={itemVariants}
            className={cn(
              'rounded-2xl p-6',
              'bg-white/[0.04] border border-white/[0.06]',
              'backdrop-blur-sm'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-white/40" />
                <h3 className="text-sm font-semibold text-white/80">Recent Generations</h3>
              </div>
              <Badge
                variant="outline"
                className="bg-white/[0.06] border-white/[0.08] text-white/40 text-[10px]"
              >
                Last 8
              </Badge>
            </div>

            {recentGenerations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
                  <ImageIcon className="size-7 text-white/15" />
                </div>
                <p className="text-sm text-white/30">No generations yet</p>
                <p className="text-xs text-white/20 mt-1">Create your first image below</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recentGenerations.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={cn(
                      'relative group rounded-xl overflow-hidden cursor-pointer aspect-square',
                      'bg-white/[0.04] border border-white/[0.06]',
                      'hover:border-white/[0.12] transition-all duration-300'
                    )}
                    onClick={() => setPreviewImage(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[10px] text-white/80 line-clamp-1">{item.prompt}</p>
                    </div>
                    {item.isFavorite && (
                      <div className="absolute top-1.5 right-1.5">
                        <Heart className="size-3 fill-red-400 text-red-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            variants={itemVariants}
            className={cn(
              'rounded-2xl p-6',
              'bg-white/[0.04] border border-white/[0.06]',
              'backdrop-blur-sm'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-white/40" />
                <h3 className="text-sm font-semibold text-white/80">Activity</h3>
              </div>
              <span className="text-[10px] text-white/30">Last 7 days</span>
            </div>

            <div className="flex items-end gap-2 h-32">
              {activityData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex items-end justify-center" style={{ height: '100px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 8 : 3)}%` }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className={cn(
                        'w-full max-w-[40px] rounded-t-lg',
                        d.count > 0
                          ? 'bg-gradient-to-t from-violet-500/40 to-violet-400/20 border border-violet-500/20'
                          : 'bg-white/[0.04] border border-white/[0.06]'
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-white/30">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column - Quick Generate + Popular Prompts */}
        <div className="flex flex-col gap-6">
          {/* Quick Generate */}
          <motion.div
            variants={itemVariants}
            className={cn(
              'rounded-2xl p-6',
              'bg-white/[0.04] border border-white/[0.06]',
              'backdrop-blur-sm'
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-violet-400/60" />
              <h3 className="text-sm font-semibold text-white/80">Quick Generate</h3>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Describe your image..."
                value={currentPrompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickGenerate();
                }}
                className={cn(
                  'h-11 rounded-xl text-sm',
                  'bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30',
                  'focus-visible:border-violet-500/30 focus-visible:ring-violet-500/10 focus-visible:ring-[3px]',
                  'backdrop-blur-sm'
                )}
              />
              <Button
                onClick={handleQuickGenerate}
                disabled={isGenerating || !currentPrompt.trim()}
                className={cn(
                  'w-full h-11 rounded-xl text-sm font-medium',
                  'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500',
                  'text-white shadow-lg shadow-violet-500/20',
                  'disabled:opacity-40 disabled:shadow-none',
                  'transition-all duration-200'
                )}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4" />
                    Generate
                  </div>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Popular Prompts */}
          <motion.div
            variants={itemVariants}
            className={cn(
              'rounded-2xl p-6',
              'bg-white/[0.04] border border-white/[0.06]',
              'backdrop-blur-sm',
              'flex-1'
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="size-4 text-amber-400/60" />
              <h3 className="text-sm font-semibold text-white/80">Popular Prompts</h3>
            </div>

            {popularPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-xs text-white/20 text-center">
                  Generate images to see popular prompts
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {popularPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt.text}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setPrompt(prompt.text)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left',
                      'bg-white/[0.03] border border-white/[0.04]',
                      'hover:bg-white/[0.06] hover:border-white/[0.08]',
                      'transition-all duration-200 group'
                    )}
                  >
                    <span className="size-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-[10px] text-white/30 font-medium shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">
                        {prompt.text}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/[0.04] border-white/[0.06] text-white/30 text-[10px] shrink-0 h-5"
                    >
                      {prompt.count}x
                    </Badge>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
