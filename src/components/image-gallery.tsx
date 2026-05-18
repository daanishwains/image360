'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  Download,
  Trash2,
  Expand,
  ImageIcon,
  Layers,
  Sparkles,
  Workflow,
  Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGenerationStore } from '@/stores/generation-store';
import { useUIStore } from '@/stores/ui-store';
import { downloadImage } from '@/lib/api';
import { cn } from '@/lib/utils';

const filterTabs = [
  { value: 'all' as const, label: 'All', icon: Layers },
  { value: 'favorites' as const, label: 'Favorites', icon: Heart },
  { value: 'single' as const, label: 'Single', icon: Sparkles },
  { value: 'bulk' as const, label: 'Bulk', icon: Layers },
  { value: 'workflow' as const, label: 'Workflow', icon: Workflow },
];

const sourceBadgeMap: Record<string, { label: string; className: string }> = {
  single: {
    label: 'Single',
    className: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  bulk: {
    label: 'Bulk',
    className: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  workflow: {
    label: 'Workflow',
    className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
};

export function ImageGallery() {
  const {
    galleryFilter,
    setGalleryFilter,
    searchQuery,
    setSearchQuery,
    filteredGenerations,
    toggleFavorite,
    removeGeneration,
    generations,
  } = useGenerationStore();
  const { setPreviewImage } = useUIStore();

  const items = filteredGenerations();

  const handleDownload = async (e: React.MouseEvent, imageUrl: string, id: string) => {
    e.stopPropagation();
    try {
      await downloadImage(imageUrl, `pixelforge-${id}.png`);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeGeneration(id);
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Gallery</h2>
            <p className="text-sm text-white/50 mt-1">
              {generations.length} generation{generations.length !== 1 ? 's' : ''} &middot; {items.length} shown
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = galleryFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setGalleryFilter(tab.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  'border border-white/[0.06]',
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-lg shadow-white/[0.03] backdrop-blur-sm'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                )}
              >
                <Icon className="size-4" />
                {tab.label}
                {tab.value === 'favorites' && (
                  <span className="ml-1 text-xs bg-white/10 rounded-full px-1.5 py-0.5">
                    {useGenerationStore.getState().totalFavorites}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'pl-10 h-10 rounded-xl text-sm',
              'bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/30',
              'focus-visible:border-white/20 focus-visible:ring-white/10 focus-visible:ring-[3px]',
              'backdrop-blur-sm'
            )}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-xl" />
              <div className="relative w-full h-full rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <ImageIcon className="size-10 text-white/20" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white/60 mb-2">
              No generations yet
            </h3>
            <p className="text-sm text-white/30 text-center max-w-xs">
              Start creating amazing images with PixelForge AI. Your creations will appear here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="break-inside-avoid group"
                >
                  <div
                    className={cn(
                      'relative rounded-2xl overflow-hidden cursor-pointer',
                      'bg-white/[0.04] border border-white/[0.06]',
                      'transition-all duration-300',
                      'hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20'
                    )}
                    onClick={() => setPreviewImage(item)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient Overlay - always visible at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-3">
                        <div className="flex items-center gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  'size-9 rounded-xl backdrop-blur-md',
                                  'bg-white/10 border border-white/10 hover:bg-white/20 text-white',
                                  item.isFavorite && 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-400'
                                )}
                                onClick={(e) => handleFavorite(e, item.id)}
                              >
                                <Heart className={cn('size-4', item.isFavorite && 'fill-current')} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-xl backdrop-blur-md bg-white/10 border border-white/10 hover:bg-white/20 text-white"
                                onClick={(e) => handleDownload(e, item.imageUrl, item.id)}
                              >
                                <Download className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-xl backdrop-blur-md bg-white/10 border border-white/10 hover:bg-white/20 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewImage(item);
                                }}
                              >
                                <Expand className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-xl backdrop-blur-md bg-white/10 border border-white/10 hover:bg-red-500/20 hover:text-red-400 text-white"
                                onClick={(e) => handleDelete(e, item.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Favorite indicator (when not hovered) */}
                      {item.isFavorite && (
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30">
                            <Heart className="size-3 fill-red-400 text-red-400" />
                          </div>
                        </div>
                      )}

                      {/* Badges at bottom */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className="bg-black/40 backdrop-blur-md border-white/10 text-white/80 text-[10px] px-1.5 py-0 h-5"
                          >
                            {item.ratio}
                          </Badge>
                          {sourceBadgeMap[item.source] && (
                            <Badge
                              variant="outline"
                              className={cn(
                                'backdrop-blur-md text-[10px] px-1.5 py-0 h-5',
                                sourceBadgeMap[item.source].className
                              )}
                            >
                              {sourceBadgeMap[item.source].label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Prompt Text */}
                    <div className="p-3">
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
