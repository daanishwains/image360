'use client';

import { motion } from 'framer-motion';
import {
  Home,
  Wand2,
  Layers,
  FileJson,
  Image,
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ViewMode } from '@/lib/types';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  view: ViewMode;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, view: 'landing' },
  { label: 'AI Studio', icon: Wand2, view: 'studio' },
  { label: 'Bulk Generate', icon: Layers, view: 'bulk' },
  { label: 'JSON Workflow', icon: FileJson, view: 'workflow' },
  { label: 'Gallery', icon: Image, view: 'gallery' },
  { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
  { label: 'Pricing', icon: CreditCard, view: 'pricing' },
  { label: 'API Docs', icon: BookOpen, view: 'apidocs' },
];

export function Sidebar() {
  const { view, setView, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex h-screen flex-col border-r border-white/[0.06] bg-black/40 backdrop-blur-xl"
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-sm font-bold tracking-tight text-white">
                PixelForge AI
              </h1>
            </motion.div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const isActive = view === item.view;
            const Icon = item.icon;

            const button = (
              <motion.button
                key={item.view}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView(item.view)}
                className={cn(
                  'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                )}
              >
                {/* Left border accent for active state */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-purple-400 to-pink-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]" />

                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-purple-400'
                      : 'text-zinc-500 group-hover:text-zinc-300'
                  )}
                />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            );

            if (!sidebarOpen) {
              return (
                <Tooltip key={item.view}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="border-white/10 bg-zinc-900 text-white">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Bottom Section - Pro Upgrade Card */}
        <div className="border-t border-white/[0.06] p-3">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-xl p-[1px]"
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
              {/* Inner card */}
              <div className="relative rounded-[11px] bg-zinc-950/90 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    Pro Upgrade
                  </span>
                </div>
                <p className="mb-3 text-[11px] leading-relaxed text-zinc-400">
                  Unlock unlimited generations, priority processing & API access.
                </p>
                <Button
                  size="sm"
                  className="h-7 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-[11px] font-semibold text-white hover:from-purple-500 hover:to-pink-500"
                >
                  Upgrade Now
                </Button>
              </div>
            </motion.div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex w-full items-center justify-center rounded-lg py-2.5 text-zinc-400 transition-colors hover:text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-white/10 bg-zinc-900 text-white">
                Upgrade to Pro
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
