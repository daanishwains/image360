'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCw,
  ImageIcon,
  AlertCircle,
  Check,
  FileJson,
  Zap,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGenerationStore } from '@/stores/generation-store';
import { WORKFLOW_PRESETS } from '@/lib/constants';
import { validateWorkflowJson } from '@/lib/api';

const statusConfig = {
  pending: {
    icon: ImageIcon,
    color: 'text-white/40',
    bg: 'bg-white/5',
    border: 'border-white/10',
    label: 'Pending',
    dotColor: 'bg-white/30',
  },
  generating: {
    icon: Loader2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    label: 'Generating',
    dotColor: 'bg-amber-400',
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

export default function JsonWorkflow() {
  const {
    workflowJson,
    workflowTasks,
    isWorkflowRunning,
    workflowProgress,
    setWorkflowJson,
    startWorkflow,
  } = useGenerationStore();

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const validation = useMemo(() => validateWorkflowJson(workflowJson), [workflowJson]);
  const progressPercent = workflowProgress.total > 0
    ? Math.round((workflowProgress.completed / workflowProgress.total) * 100)
    : 0;

  const completedCount = workflowTasks.filter((t) => t.status === 'completed').length;
  const failedCount = workflowTasks.filter((t) => t.status === 'failed').length;
  const generatingCount = workflowTasks.filter((t) => t.status === 'generating').length;

  const handleRunWorkflow = useCallback(() => {
    if (!validation.valid || isWorkflowRunning) return;
    startWorkflow();
  }, [validation.valid, isWorkflowRunning, startWorkflow]);

  const handlePresetSelect = useCallback((preset: typeof WORKFLOW_PRESETS[number]) => {
    setSelectedPreset(preset.name);
    setWorkflowJson(JSON.stringify(preset.data, null, 2));
  }, [setWorkflowJson]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600">
          <Code2 className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">JSON Workflow</h2>
          <p className="text-sm text-white/50">Define complex generation pipelines with JSON</p>
        </div>
      </div>

      {/* Workflow Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 flex items-center gap-2">
          <Zap className="size-3.5 text-amber-400" />
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {WORKFLOW_PRESETS.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePresetSelect(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                selectedPreset === preset.name
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-white/10'
              }`}
            >
              <FileJson className="size-3" />
              {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* JSON Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Code2 className="size-3.5 text-orange-400" />
            Workflow JSON
          </label>
          {/* Validation Indicator */}
          <div className="flex items-center gap-2">
            {validation.count > 0 && (
              <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">
                {validation.count} prompt{validation.count !== 1 ? 's' : ''}
              </Badge>
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              {validation.valid ? (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Check className="size-4" />
                  <span className="text-xs font-medium">Valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <XCircle className="size-4" />
                  <span className="text-xs font-medium">Invalid</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="relative">
          <Textarea
            value={workflowJson}
            onChange={(e) => {
              setWorkflowJson(e.target.value);
              setSelectedPreset(null);
            }}
            className="min-h-[200px] bg-black/30 border-white/10 text-emerald-300/90 placeholder:text-white/20 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20 resize-none font-mono text-sm leading-relaxed"
            placeholder={'{\n  "name": "My Workflow",\n  "prompts": [\n    { "prompt": "...", "ratio": "16:9" },\n    { "prompt": "...", "ratio": "1:1" }\n  ]\n}'}
            spellCheck={false}
          />
          {/* Line number hint */}
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-white/20">
            <FileJson className="size-3" />
            JSON
          </div>
        </div>

        {/* Validation Errors */}
        <AnimatePresence>
          {validation.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {validation.errors.map((error, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-xs text-red-400/80 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2"
                >
                  <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                  {error}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Run Workflow Button */}
      <motion.button
        whileHover={{ scale: isWorkflowRunning ? 1 : 1.02 }}
        whileTap={{ scale: isWorkflowRunning ? 1 : 0.98 }}
        onClick={handleRunWorkflow}
        disabled={!validation.valid || isWorkflowRunning}
        className="w-full relative overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isWorkflowRunning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <span className="relative flex items-center justify-center gap-2">
          {isWorkflowRunning ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="size-5" />
              </motion.div>
              Running Workflow...
            </>
          ) : (
            <>
              <Play className="size-5" />
              Run Workflow
            </>
          )}
        </span>
      </motion.button>

      {/* Progress Section */}
      <AnimatePresence>
        {workflowTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Progress Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">
                Progress: {workflowProgress.completed}/{workflowProgress.total}
              </span>
              <div className="flex items-center gap-3">
                {completedCount > 0 && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    {completedCount}
                  </span>
                )}
                {generatingCount > 0 && (
                  <span className="text-amber-400 flex items-center gap-1">
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
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-600 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {isWorkflowRunning && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400/30 via-orange-300/30 to-amber-400/30"
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
                  {workflowTasks.map((task, index) => {
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

                        {/* Thumbnail */}
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

                        {/* Generating shimmer */}
                        {task.status === 'generating' && (
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-white/5">
                            <motion.div
                              className="w-full h-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10"
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
      {workflowTasks.length === 0 && (
        <div className="py-8 text-center">
          <Code2 className="size-10 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">Define your workflow JSON above and click Run</p>
        </div>
      )}
    </motion.div>
  );
}
