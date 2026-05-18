import { create } from 'zustand';
import { GenerationItem, GenerationTask, BulkPrompt } from '@/lib/types';
import { bulkGenerate } from '@/lib/api';

interface GenerationState {
  // Single generation
  currentPrompt: string;
  currentRatio: string;
  currentStyle: string;
  currentLighting: string;
  currentCamera: string;
  isGenerating: boolean;
  currentResult: GenerationItem | null;

  // Bulk generation
  bulkPrompts: string;
  bulkRatio: string;
  bulkTasks: GenerationTask[];
  isBulkGenerating: boolean;
  bulkProgress: { completed: number; total: number };

  // JSON Workflow
  workflowJson: string;
  workflowTasks: GenerationTask[];
  isWorkflowRunning: boolean;
  workflowProgress: { completed: number; total: number };

  // Gallery
  generations: GenerationItem[];
  galleryFilter: 'all' | 'favorites' | 'single' | 'bulk' | 'workflow';
  searchQuery: string;

  // Stats
  totalGenerations: number;
  totalFavorites: number;

  // Actions - Single
  setPrompt: (prompt: string) => void;
  setRatio: (ratio: string) => void;
  setStyle: (style: string) => void;
  setLighting: (lighting: string) => void;
  setCamera: (camera: string) => void;
  generateSingle: () => Promise<void>;

  // Actions - Bulk
  setBulkPrompts: (prompts: string) => void;
  setBulkRatio: (ratio: string) => void;
  startBulkGeneration: () => Promise<void>;

  // Actions - Workflow
  setWorkflowJson: (json: string) => void;
  startWorkflow: () => Promise<void>;

  // Actions - Gallery
  addGeneration: (item: GenerationItem) => void;
  addGenerations: (items: GenerationItem[]) => void;
  removeGeneration: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setGalleryFilter: (filter: 'all' | 'favorites' | 'single' | 'bulk' | 'workflow') => void;
  setSearchQuery: (query: string) => void;
  loadGenerations: (items: GenerationItem[]) => void;

  // Computed
  filteredGenerations: () => GenerationItem[];
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  // Single generation state
  currentPrompt: '',
  currentRatio: '1:1',
  currentStyle: '',
  currentLighting: '',
  currentCamera: '',
  isGenerating: false,
  currentResult: null,

  // Bulk generation state
  bulkPrompts: '',
  bulkRatio: '1:1',
  bulkTasks: [],
  isBulkGenerating: false,
  bulkProgress: { completed: 0, total: 0 },

  // JSON Workflow state
  workflowJson: JSON.stringify({
    name: "My Workflow",
    prompts: [
      { prompt: "cinematic futuristic city", ratio: "16:9" },
      { prompt: "anime warrior in battle", ratio: "9:16" },
      { prompt: "fantasy dragon flying over mountains", ratio: "16:9" },
    ]
  }, null, 2),
  workflowTasks: [],
  isWorkflowRunning: false,
  workflowProgress: { completed: 0, total: 0 },

  // Gallery state
  generations: [],
  galleryFilter: 'all',
  searchQuery: '',

  // Stats
  totalGenerations: 0,
  totalFavorites: 0,

  // Single generation actions
  setPrompt: (prompt) => set({ currentPrompt: prompt }),
  setRatio: (ratio) => set({ currentRatio: ratio }),
  setStyle: (style) => set({ currentStyle: style }),
  setLighting: (lighting) => set({ currentLighting: lighting }),
  setCamera: (camera) => set({ currentCamera: camera }),

  generateSingle: async () => {
    const { currentPrompt, currentRatio, currentStyle, currentLighting, currentCamera } = get();
    if (!currentPrompt.trim()) return;

    let enhancedPrompt = currentPrompt;
    if (currentStyle) enhancedPrompt += currentStyle;
    if (currentLighting) enhancedPrompt += currentLighting;
    if (currentCamera) enhancedPrompt += currentCamera;

    set({ isGenerating: true, currentResult: null });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt, ratio: currentRatio }),
      });

      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();

      const item: GenerationItem = {
        id: `gen-${Date.now()}`,
        prompt: currentPrompt,
        ratio: currentRatio,
        imageUrl: data.imageUrl,
        status: 'completed',
        isFavorite: false,
        source: 'single',
        createdAt: new Date(),
      };

      set((state) => ({
        isGenerating: false,
        currentResult: item,
        generations: [item, ...state.generations],
        totalGenerations: state.totalGenerations + 1,
      }));

      // Save to database
      fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {});
    } catch (error) {
      console.error('Generation failed:', error);
      set({ isGenerating: false });
    }
  },

  // Bulk generation actions
  setBulkPrompts: (prompts) => set({ bulkPrompts: prompts }),
  setBulkRatio: (ratio) => set({ bulkRatio: ratio }),

  startBulkGeneration: async () => {
    const { bulkPrompts, bulkRatio } = get();
    const lines = bulkPrompts.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return;

    const prompts: BulkPrompt[] = lines.map((line) => ({
      prompt: line.trim(),
      ratio: bulkRatio,
    }));

    set({
      isBulkGenerating: true,
      bulkTasks: prompts.map((p, i) => ({
        id: `bulk-${i}-${Date.now()}`,
        prompt: p.prompt,
        ratio: p.ratio,
        status: 'pending' as const,
      })),
      bulkProgress: { completed: 0, total: prompts.length },
    });

    const results = await bulkGenerate(prompts, (completed, total, task) => {
      set((state) => ({
        bulkProgress: { completed, total },
        bulkTasks: state.bulkTasks.map((t) =>
          t.id === task.id ? { ...task } : t
        ),
      }));
    });

    const completedItems: GenerationItem[] = results
      .filter((r) => r.status === 'completed' && r.imageUrl)
      .map((r) => ({
        id: r.id,
        prompt: r.prompt,
        ratio: r.ratio,
        imageUrl: r.imageUrl!,
        status: 'completed' as const,
        isFavorite: false,
        source: 'bulk' as const,
        createdAt: new Date(),
      }));

    set((state) => ({
      isBulkGenerating: false,
      generations: [...completedItems, ...state.generations],
      totalGenerations: state.totalGenerations + completedItems.length,
    }));

    // Save to database
    completedItems.forEach((item) => {
      fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {});
    });
  },

  // Workflow actions
  setWorkflowJson: (json) => set({ workflowJson: json }),

  startWorkflow: async () => {
    const { workflowJson } = get();
    try {
      const data = JSON.parse(workflowJson);
      if (!data.prompts || !Array.isArray(data.prompts)) return;

      const prompts: BulkPrompt[] = data.prompts.map((p: { prompt: string; ratio?: string }) => ({
        prompt: p.prompt,
        ratio: p.ratio || '1:1',
      }));

      set({
        isWorkflowRunning: true,
        workflowTasks: prompts.map((p, i) => ({
          id: `wf-${i}-${Date.now()}`,
          prompt: p.prompt,
          ratio: p.ratio,
          status: 'pending' as const,
        })),
        workflowProgress: { completed: 0, total: prompts.length },
      });

      const results = await bulkGenerate(prompts, (completed, total, task) => {
        set((state) => ({
          workflowProgress: { completed, total },
          workflowTasks: state.workflowTasks.map((t) =>
            t.id === task.id ? { ...task } : t
          ),
        }));
      });

      const completedItems: GenerationItem[] = results
        .filter((r) => r.status === 'completed' && r.imageUrl)
        .map((r) => ({
          id: r.id,
          prompt: r.prompt,
          ratio: r.ratio,
          imageUrl: r.imageUrl!,
          status: 'completed' as const,
          isFavorite: false,
          source: 'workflow' as const,
          createdAt: new Date(),
        }));

      set((state) => ({
        isWorkflowRunning: false,
        generations: [...completedItems, ...state.generations],
        totalGenerations: state.totalGenerations + completedItems.length,
      }));

      completedItems.forEach((item) => {
        fetch('/api/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        }).catch(() => {});
      });
    } catch (error) {
      console.error('Workflow error:', error);
      set({ isWorkflowRunning: false });
    }
  },

  // Gallery actions
  addGeneration: (item) => set((state) => ({
    generations: [item, ...state.generations],
    totalGenerations: state.totalGenerations + 1,
  })),

  addGenerations: (items) => set((state) => ({
    generations: [...items, ...state.generations],
    totalGenerations: state.totalGenerations + items.length,
  })),

  removeGeneration: (id) => set((state) => {
    const item = state.generations.find((g) => g.id === id);
    return {
      generations: state.generations.filter((g) => g.id !== id),
      totalGenerations: state.totalGenerations - 1,
      totalFavorites: item?.isFavorite ? state.totalFavorites - 1 : state.totalFavorites,
    };
  }),

  toggleFavorite: (id) => set((state) => {
    const generations = state.generations.map((g) =>
      g.id === id ? { ...g, isFavorite: !g.isFavorite } : g
    );
    const favCount = generations.filter((g) => g.isFavorite).length;
    return { generations, totalFavorites: favCount };
  }),

  setGalleryFilter: (filter) => set({ galleryFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  loadGenerations: (items) => set({
    generations: items,
    totalGenerations: items.length,
    totalFavorites: items.filter((i) => i.isFavorite).length,
  }),

  filteredGenerations: () => {
    const { generations, galleryFilter, searchQuery } = get();
    let filtered = generations;

    if (galleryFilter === 'favorites') {
      filtered = filtered.filter((g) => g.isFavorite);
    } else if (galleryFilter !== 'all') {
      filtered = filtered.filter((g) => g.source === galleryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((g) => g.prompt.toLowerCase().includes(q));
    }

    return filtered;
  },
}));
