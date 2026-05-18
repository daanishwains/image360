'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Play,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCw,
  Clock,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerationStore } from '@/stores/generation-store';
import { ASPECT_RATIOS } from '@/lib/constants';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-white/40',
    bg: 'bg-white/5',
    border: 'border-white/10',
    label: 'Pending',
    dotColor: 'bg-white/30',
  },
  generating: {
    icon: Loader2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    label: 'Generating',
    dotColor: 'bg-blue-400',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    label: 'Completed',
    dotColor: 'bg-emerald-400',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Failed',
    dotColor: 'bg-red-400',
  },
} as const;

export default function BulkGenerator() {
  const {
    bulkPrompts,
    bulkRatio,
    bulkTasks,
    isBulkGenerating,
    bulkProgress,
    setBulkPrompts,
    setBulkRatio,
    startBulkGeneration,
  } = useGenerationStore();

  const handleBulkGenerate = useCallback(() => {
    if (!bulkPrompts.trim() || isBulkGenerating) return;
    startBulkGeneration();
  }, [bulkPrompts, isBulkGenerating, startBulkGeneration]);

  const promptLines = bulkPrompts.split('\n').filter((l) => l.trim());
  const progressPercent = bulkProgress.total > 0
    ? Math.round((bulkProgress.completed / bulkProgress.total) * 100)
    : 0;

  const completedCount = bulkTasks.filter((t) => t.status === 'completed').length;
  const failedCount = bulkTasks.filter((t) => t.status === 'failed').length;
  const generatingCount = bulkTasks.filter((t) => t.status === 'generating').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
          <Layers className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Bulk Generation</h2>
          <p className="text-sm text-white/50">Generate multiple images at once — one prompt per line</p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 flex items-center gap-2">
          <Layers className="size-3.5 text-cyan-400" />
          Prompts
          {promptLines.length > 0 && (
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
              {promptLines.length} prompt{promptLines.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </label>
        <Textarea
          placeholder={"A majestic mountain landscape at sunrise\nA futuristic city with flying cars\nA cute cat wearing a tiny hat\nAn underwater coral reef scene"}
          value={bulkPrompts}
          onChange={(e) => setBulkPrompts(e.target.value)}
          className="min-h-[140px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:border-cyan-500/50 focus-visible:ring-cyan-500/20 resize-none font-mono text-sm"
        />
      </div>

      {/* Ratio Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <motion.button
              key={ratio.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBulkRatio(ratio.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                bulkRatio === ratio.value
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/10'
              }`}
            >
              {ratio.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: isBulkGenerating ? 1 : 1.02 }}
        whileTap={{ scale: isBulkGenerating ? 1 : 0.98 }}
        onClick={handleBulkGenerate}
        disabled={promptLines.length === 0 || isBulkGenerating}
        className="w-full relative overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isBulkGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <span className="relative flex items-center justify-center gap-2">
          {isBulkGenerating ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="size-5" />
              </motion.div>
              Generating All...
            </>
          ) : (
            <>
              <Play className="size-5" />
              Generate All ({promptLines.length})
            </>
          )}
        </span>
      </motion.button>

      {/* Progress Section */}
      <AnimatePresence>
        {bulkTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Progress Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">
                Progress: {bulkProgress.completed}/{bulkProgress.total}
              </span>
              <div className="flex items-center gap-3">
                {completedCount > 0 && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    {completedCount}
                  </span>
                )}
                {generatingCount > 0 && (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Loader2 className="size-3.5 animate-spin" />
                    {generatingCount}
                  </span>
                )}
                {failedCount > 0 && (
                  <span className="text-red-400 flex items-center gap-1">
                    <XCircle className="size-3.5" />
                    {failedCount}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {isBulkGenerating && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-400/30 via-cyan-300/30 to-blue-400/30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '30%' }}
                />
              )}
            </div>

            {/* Task Grid */}
            <ScrollArea className="max-h-96">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pr-2">
                <AnimatePresence>
                  {bulkTasks.map((task, index) => {
                    const config = statusConfig[task.status];
                    const StatusIcon = config.icon;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${config.bg} ${config.border} border rounded-xl p-3 space-y-2 transition-colors duration-300`}
                      >
                        {/* Status Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <motion.div
                              className={`w-2 h-2 rounded-full ${config.dotColor}`}
                              animate={
                                task.status === 'generating'
                                  ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
                                  : {}
                              }
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className={`text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/10 text-white/40">
                            {task.ratio}
                          </Badge>
                        </div>

                        {/* Prompt Text */}
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {task.prompt}
                        </p>

                        {/* Thumbnail / Error */}
                        {task.status === 'completed' && task.imageUrl && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-lg overflow-hidden"
                          >
                            <img
                              src={task.imageUrl}
                              alt={task.prompt}
                              className="w-full h-24 object-cover"
                            />
                          </motion.div>
                        )}

                        {task.status === 'failed' && task.error && (
                          <p className="text-xs text-red-400/70 line-clamp-1">{task.error}</p>
                        )}

                        {/* Failed Retry */}
                        {task.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <RotateCw className="size-3 mr-1" />
                            Retry
                          </Button>
                        )}

                        {/* Generating animation overlay */}
                        {task.status === 'generating' && (
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-white/5">
                            <motion.div
                              className="w-full h-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {bulkTasks.length === 0 && (
        <div className="py-8 text-center">
          <ImageIcon className="size-10 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">Enter multiple prompts above to start bulk generation</p>
        </div>
      )}
    </motion.div>
  );
}
