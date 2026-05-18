export interface GenerationItem {
  id: string;
  prompt: string;
  ratio: string;
  imageUrl: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  isFavorite: boolean;
  collection?: string;
  source: 'single' | 'bulk' | 'workflow';
  createdAt: Date;
  retryCount?: number;
}

export interface BulkPrompt {
  prompt: string;
  ratio: string;
}

export interface WorkflowPrompt {
  prompt: string;
  ratio: string;
  style?: string;
  negativePrompt?: string;
}

export interface WorkflowData {
  name: string;
  prompts: WorkflowPrompt[];
}

export interface GenerationTask {
  id: string;
  prompt: string;
  ratio: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  suffix: string;
  preview?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: string;
  ratio: string;
}

export type ViewMode = 'landing' | 'studio' | 'bulk' | 'workflow' | 'gallery' | 'dashboard' | 'pricing' | 'apidocs';

export interface ApiStats {
  totalGenerations: number;
  totalCredits: number;
  storageUsed: string;
  favoriteCount: number;
}
