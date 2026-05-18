import { create } from 'zustand';
import { GenerationItem, GenerationTask, ViewMode } from '@/lib/types';

interface UIState {
  view: ViewMode;
  sidebarOpen: boolean;
  previewImage: GenerationItem | null;
  previewOpen: boolean;
  setView: (view: ViewMode) => void;
  toggleSidebar: () => void;
  setPreviewImage: (item: GenerationItem | null) => void;
  setPreviewOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  view: 'landing',
  sidebarOpen: true,
  previewImage: null,
  previewOpen: false,
  setView: (view) => set({ view }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setPreviewImage: (item) => set({ previewImage: item, previewOpen: !!item }),
  setPreviewOpen: (open) => set({ previewOpen: open, previewImage: open ? undefined : null }),
}));
