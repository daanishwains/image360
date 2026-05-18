'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Copy,
  Heart,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RatioIcon,
  Zap,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUIStore } from '@/stores/ui-store';
import { useGenerationStore } from '@/stores/generation-store';
import { downloadImage } from '@/lib/api';
import { cn } from '@/lib/utils';

export function ImagePreviewModal() {
  const { previewImage, previewOpen, setPreviewOpen, setPreviewImage } = useUIStore();
  const { generations, toggleFavorite, removeGeneration } = useGenerationStore();

  if (!previewImage) return null;

  const currentIndex = generations.findIndex((g) => g.id === previewImage.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < generations.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setPreviewImage(generations[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setPreviewImage(generations[currentIndex + 1]);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadImage(previewImage.imageUrl, `pixelforge-${previewImage.id}.png`);
    } catch {
      window.open(previewImage.imageUrl, '_blank');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(previewImage.imageUrl);
    } catch {
      // Fallback
    }
  };

  const handleFavorite = () => {
    toggleFavorite(previewImage.id);
  };

  const handleDelete = () => {
    removeGeneration(previewImage.id);
    setPreviewImage(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PixelForge AI Generation',
          text: previewImage.prompt,
          url: previewImage.imageUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await handleCopyUrl();
    }
  };

  const handleClose = () => {
    setPreviewOpen(false);
  };

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

  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    } catch {
      return 'Unknown';
    }
  };

  return (
    <AnimatePresence>
      {previewOpen && previewImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex w-[95vw] max-w-6xl h-[90vh] rounded-2xl overflow-hidden bg-[#0d0d14] border border-white/[0.08] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <X className="size-5" />
            </button>

            {/* Navigation Arrows */}
            {hasPrev && (
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all md:right-[340px]"
              >
                <ChevronRight className="size-5" />
              </button>
            )}

            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 overflow-hidden bg-black/40">
              <motion.img
                key={previewImage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={previewImage.imageUrl}
                alt={previewImage.prompt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Details Panel */}
            <div className="hidden md:flex w-[320px] flex-col border-l border-white/[0.06] bg-white/[0.02]">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Prompt */}
                <div>
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Prompt
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {previewImage.prompt}
                  </p>
                </div>

                <Separator className="bg-white/[0.06]" />

                {/* Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    Details
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <RatioIcon className="size-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Ratio</p>
                        <p className="text-sm text-white/80">{previewImage.ratio}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Zap className="size-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Source</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'mt-0.5 text-[10px] h-5',
                            sourceBadgeMap[previewImage.source]?.className
                          )}
                        >
                          {sourceBadgeMap[previewImage.source]?.label || previewImage.source}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Calendar className="size-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Created</p>
                        <p className="text-sm text-white/80">{formatDate(previewImage.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Clock className="size-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Position</p>
                        <p className="text-sm text-white/80">
                          {currentIndex + 1} of {generations.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-white/[0.06] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          'rounded-xl text-xs h-10 backdrop-blur-sm',
                          'bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white',
                          previewImage.isFavorite && 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                        )}
                        onClick={handleFavorite}
                      >
                        <Heart className={cn('size-4 mr-1.5', previewImage.isFavorite && 'fill-current')} />
                        {previewImage.isFavorite ? 'Favorited' : 'Favorite'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle favorite</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-xl text-xs h-10 backdrop-blur-sm bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white"
                        onClick={handleDownload}
                      >
                        <Download className="size-4 mr-1.5" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download image</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-xl text-xs h-10 backdrop-blur-sm bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white"
                        onClick={handleCopyUrl}
                      >
                        <Copy className="size-4 mr-1.5" />
                        Copy URL
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy image URL</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="rounded-xl text-xs h-10 backdrop-blur-sm bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white"
                        onClick={handleShare}
                      >
                        <Share2 className="size-4 mr-1.5" />
                        Share
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share image</TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full rounded-xl text-xs h-10 backdrop-blur-sm bg-red-500/[0.06] border border-red-500/[0.1] hover:bg-red-500/20 text-red-400/70 hover:text-red-400"
                      onClick={handleDelete}
                    >
                      <Trash2 className="size-4 mr-1.5" />
                      Delete Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete this image permanently</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>

          {/* Mobile bottom bar for actions */}
          <div className="md:hidden absolute bottom-0 inset-x-0 p-4 bg-black/60 backdrop-blur-md border-t border-white/[0.06]">
            <div className="flex items-center justify-around">
              <button
                onClick={handleFavorite}
                className={cn(
                  'flex flex-col items-center gap-1 text-xs',
                  previewImage.isFavorite ? 'text-red-400' : 'text-white/50'
                )}
              >
                <Heart className={cn('size-5', previewImage.isFavorite && 'fill-current')} />
              </button>
              <button
                onClick={handleDownload}
                className="flex flex-col items-center gap-1 text-xs text-white/50"
              >
                <Download className="size-5" />
              </button>
              <button
                onClick={handleCopyUrl}
                className="flex flex-col items-center gap-1 text-xs text-white/50"
              >
                <Copy className="size-5" />
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 text-xs text-white/50"
              >
                <Share2 className="size-5" />
              </button>
              <button
                onClick={handleDelete}
                className="flex flex-col items-center gap-1 text-xs text-red-400/60"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
