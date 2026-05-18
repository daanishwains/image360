'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Download,
  Heart,
  Copy,
  RefreshCw,
  Camera,
  Sun,
  Palette,
  Wand2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGenerationStore } from '@/stores/generation-store';
import {
  ASPECT_RATIOS,
  STYLE_PRESETS,
  LIGHTING_PRESETS,
  CAMERA_PRESETS,
} from '@/lib/constants';
import { downloadImage } from '@/lib/api';

export default function GenerationPanel() {
  const {
    currentPrompt,
    currentRatio,
    currentStyle,
    currentLighting,
    currentCamera,
    isGenerating,
    currentResult,
    setPrompt,
    setRatio,
    setStyle,
    setLighting,
    setCamera,
    generateSingle,
    toggleFavorite,
  } = useGenerationStore();

  const [copied, setCopied] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (!currentPrompt.trim() || isGenerating) return;
    generateSingle();
  }, [currentPrompt, isGenerating, generateSingle]);

  const handleDownload = useCallback(() => {
    if (currentResult?.imageUrl) {
      downloadImage(currentResult.imageUrl, `pixelforge-${currentResult.id}.png`);
    }
  }, [currentResult]);

  const handleCopyUrl = useCallback(() => {
    if (currentResult?.imageUrl) {
      navigator.clipboard.writeText(currentResult.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentResult]);

  const handleFavorite = useCallback(() => {
    if (currentResult?.id) {
      toggleFavorite(currentResult.id);
    }
  }, [currentResult, toggleFavorite]);

  // Group style presets by category
  const styleCategories = STYLE_PRESETS.reduce<Record<string, typeof STYLE_PRESETS>>((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
          <Wand2 className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Image Generation</h2>
          <p className="text-sm text-white/50">Describe your imagination and bring it to life</p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 flex items-center gap-2">
          <Sparkles className="size-3.5 text-purple-400" />
          Prompt
        </label>
        <Textarea
          placeholder="Describe your imagination..."
          value={currentPrompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
          }}
        />
        <p className="text-xs text-white/30">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono">Ctrl+Enter</kbd> to generate
        </p>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 flex items-center gap-2">
          <ImageIcon className="size-3.5 text-pink-400" />
          Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <motion.button
              key={ratio.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRatio(ratio.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                currentRatio === ratio.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/10'
              }`}
            >
              {ratio.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Style / Lighting / Camera Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Style Preset */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Palette className="size-3.5 text-violet-400" />
            Style
          </label>
          <Select value={currentStyle} onValueChange={setStyle}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
              <SelectValue placeholder="Select style" className="text-white/50" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 max-h-72">
              <SelectGroup>
                <SelectItem value="none" className="text-white/70 focus:bg-white/10 focus:text-white">
                  None
                </SelectItem>
                {Object.entries(styleCategories).map(([category, presets]) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-white/40 text-xs uppercase tracking-wider">
                      {category}
                    </SelectLabel>
                    {presets.map((preset) => (
                      <SelectItem
                        key={preset.id}
                        value={preset.suffix}
                        className="text-white/70 focus:bg-white/10 focus:text-white"
                      >
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Lighting Preset */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Sun className="size-3.5 text-amber-400" />
            Lighting
          </label>
          <Select value={currentLighting} onValueChange={setLighting}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
              <SelectValue placeholder="Select lighting" className="text-white/50" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {LIGHTING_PRESETS.map((preset) => (
                <SelectItem
                  key={preset.id}
                  value={preset.suffix}
                  className="text-white/70 focus:bg-white/10 focus:text-white"
                >
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Camera Preset */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Camera className="size-3.5 text-cyan-400" />
            Camera
          </label>
          <Select value={currentCamera} onValueChange={setCamera}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
              <SelectValue placeholder="Select camera" className="text-white/50" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {CAMERA_PRESETS.map((preset) => (
                <SelectItem
                  key={preset.id}
                  value={preset.suffix}
                  className="text-white/70 focus:bg-white/10 focus:text-white"
                >
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Presets Badges */}
      {(currentStyle || currentLighting || currentCamera) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          {currentStyle && (
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30 gap-1">
              <Palette className="size-3" />
              {STYLE_PRESETS.find((s) => s.suffix === currentStyle)?.name || 'Custom'}
              <button onClick={() => setStyle('')} className="ml-1 hover:text-white">
                x
              </button>
            </Badge>
          )}
          {currentLighting && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1">
              <Sun className="size-3" />
              {LIGHTING_PRESETS.find((l) => l.suffix === currentLighting)?.name || 'Custom'}
              <button onClick={() => setLighting('')} className="ml-1 hover:text-white">
                x
              </button>
            </Badge>
          )}
          {currentCamera && (
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 gap-1">
              <Camera className="size-3" />
              {CAMERA_PRESETS.find((c) => c.suffix === currentCamera)?.name || 'Custom'}
              <button onClick={() => setCamera('')} className="ml-1 hover:text-white">
                x
              </button>
            </Badge>
          )}
        </motion.div>
      )}

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: isGenerating ? 1 : 1.02 }}
        whileTap={{ scale: isGenerating ? 1 : 0.98 }}
        onClick={handleGenerate}
        disabled={!currentPrompt.trim() || isGenerating}
        className="w-full relative overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {/* Animated background shimmer */}
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <span className="relative flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="size-5" />
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Generate
            </>
          )}
        </span>
      </motion.button>

      {/* Preview Area */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-xl"
            >
              <Skeleton className="w-full aspect-square rounded-xl bg-white/5" />
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="size-8 text-purple-400 mx-auto" />
                  </motion.div>
                  <p className="text-sm text-white/50">Creating your masterpiece...</p>
                </div>
              </div>
            </motion.div>
          ) : currentResult?.imageUrl ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative group rounded-xl overflow-hidden"
            >
              <img
                src={currentResult.imageUrl}
                alt={currentResult.prompt}
                className="w-full rounded-xl"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center"
            >
              <div className="text-center space-y-3">
                <ImageIcon className="size-12 text-white/20 mx-auto" />
                <p className="text-sm text-white/30">Your creation will appear here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <AnimatePresence>
          {currentResult?.imageUrl && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    onMouseEnter={() => setHoveredAction('regenerate')}
                    onMouseLeave={() => setHoveredAction(null)}
                    className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <motion.div animate={{ rotate: hoveredAction === 'regenerate' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <RefreshCw className="size-4" />
                    </motion.div>
                    Regenerate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate another version</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Download className="size-4" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download image</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFavorite}
                    className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <motion.div animate={{ scale: currentResult?.isFavorite ? [1, 1.3, 1] : 1 }}>
                      <Heart className={`size-4 ${currentResult?.isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </motion.div>
                    Favorite
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{currentResult?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                    {copied ? 'Copied' : 'Copy URL'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy image URL</TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
