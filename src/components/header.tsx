'use client';

import { motion } from 'framer-motion';
import { Menu, Search, Bell, User } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { ViewMode } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const viewTitles: Record<ViewMode, string> = {
  landing: 'Home',
  studio: 'AI Studio',
  bulk: 'Bulk Generate',
  workflow: 'JSON Workflow',
  gallery: 'Gallery',
  dashboard: 'Dashboard',
  pricing: 'Pricing',
  apidocs: 'API Docs',
};

export function Header() {
  const { view, toggleSidebar } = useUIStore();
  const currentTitle = viewTitles[view];

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/[0.06] bg-black/30 px-4 backdrop-blur-xl">
        {/* Gradient border bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {/* Hamburger Menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 shrink-0 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Current View Title */}
        <motion.h2
          key={view}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-semibold text-white"
        >
          {currentTitle}
        </motion.h2>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Bar */}
        <div className="relative hidden max-w-xs flex-1 sm:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search generations..."
            className="h-8 border-white/[0.06] bg-white/[0.04] pl-8 text-xs text-zinc-300 placeholder:text-zinc-600 focus-visible:border-purple-500/40 focus-visible:ring-purple-500/20"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:bg-white/[0.06] hover:text-white sm:hidden"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-zinc-900 text-white">
              Search
            </TooltipContent>
          </Tooltip>

          {/* Notification Bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              >
                <Bell className="h-4 w-4" />
                {/* Notification dot */}
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-zinc-900 text-white">
              Notifications
            </TooltipContent>
          </Tooltip>

          {/* User Avatar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative ml-1 flex h-8 w-8 items-center justify-center rounded-full p-[1.5px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-950">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-zinc-900 text-white">
              Profile
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
