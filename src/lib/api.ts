import { GenerationTask, BulkPrompt } from './types';

const API_BASE = 'https://pixelster.vercel.app';

export async function generateImage(prompt: string, ratio: string): Promise<{ success: boolean; imageUrl: string; prompt: string; ratio: string }> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ratio }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(error.error || 'Generation failed');
  }

  return response.json();
}

export async function bulkGenerate(
  prompts: BulkPrompt[],
  onProgress?: (completed: number, total: number, task: GenerationTask) => void,
  maxRetries: number = 2
): Promise<GenerationTask[]> {
  const total = prompts.length;
  let completed = 0;

  const tasks: GenerationTask[] = prompts.map((p, i) => ({
    id: `task-${i}-${Date.now()}`,
    prompt: p.prompt,
    ratio: p.ratio,
    status: 'pending' as const,
  }));

  const executeTask = async (task: GenerationTask, retryCount = 0): Promise<GenerationTask> => {
    task.status = 'generating';
    task.startTime = Date.now();
    onProgress?.(completed, total, { ...task });

    try {
      const result = await generateImage(task.prompt, task.ratio);
      task.status = 'completed';
      task.imageUrl = result.imageUrl;
      task.endTime = Date.now();
      completed++;
      onProgress?.(completed, total, { ...task });
      return task;
    } catch (error) {
      if (retryCount < maxRetries) {
        return executeTask(task, retryCount + 1);
      }
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.endTime = Date.now();
      completed++;
      onProgress?.(completed, total, { ...task });
      return task;
    }
  };

  const results = await Promise.allSettled(
    tasks.map(task => executeTask(task))
  );

  return results.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    tasks[i].status = 'failed';
    tasks[i].error = result.reason?.message || 'Unknown error';
    return tasks[i];
  });
}

export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export function enhancePrompt(prompt: string, style?: string, lighting?: string, camera?: string): string {
  let enhanced = prompt;
  if (style) enhanced += `, ${style}`;
  if (lighting) enhanced += `, ${lighting}`;
  if (camera) enhanced += `, ${camera}`;
  enhanced += ', masterpiece, best quality, highly detailed';
  return enhanced;
}

export function parseJsonWorkflow(json: string): BulkPrompt[] | null {
  try {
    const data = JSON.parse(json);
    if (data.prompts && Array.isArray(data.prompts)) {
      return data.prompts.map((p: { prompt: string; ratio?: string }) => ({
        prompt: p.prompt,
        ratio: p.ratio || '1:1',
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export function validateWorkflowJson(json: string): { valid: boolean; errors: string[]; count: number } {
  const errors: string[] = [];
  try {
    const data = JSON.parse(json);
    if (!data.prompts) {
      errors.push('Missing "prompts" array');
    } else if (!Array.isArray(data.prompts)) {
      errors.push('"prompts" must be an array');
    } else if (data.prompts.length === 0) {
      errors.push('"prompts" array is empty');
    } else {
      data.prompts.forEach((p: Record<string, unknown>, i: number) => {
        if (!p.prompt || typeof p.prompt !== 'string') {
          errors.push(`Item ${i + 1}: missing or invalid "prompt" string`);
        }
        if (p.ratio && typeof p.ratio !== 'string') {
          errors.push(`Item ${i + 1}: "ratio" must be a string`);
        }
      });
    }
    return { valid: errors.length === 0, errors, count: data.prompts?.length || 0 };
  } catch (e) {
    return { valid: false, errors: ['Invalid JSON syntax'], count: 0 };
  }
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
