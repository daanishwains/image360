'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useGenerationStore } from '@/stores/generation-store';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import Landing from '@/components/landing';
import GenerationPanel from '@/components/generation-panel';
import BulkGenerator from '@/components/bulk-generator';
import JsonWorkflow from '@/components/json-workflow';
import { ImageGallery } from '@/components/image-gallery';
import { ImagePreviewModal } from '@/components/image-preview-modal';
import { Dashboard } from '@/components/dashboard';
import Pricing from '@/components/pricing';
import ApiDocs from '@/components/api-docs';

function ViewRenderer({ view }: { view: string }) {
  switch (view) {
    case 'landing':
      return <Landing />;
    case 'studio':
      return <GenerationPanel />;
    case 'bulk':
      return <BulkGenerator />;
    case 'workflow':
      return <JsonWorkflow />;
    case 'gallery':
      return <ImageGallery />;
    case 'dashboard':
      return <Dashboard />;
    case 'pricing':
      return <Pricing />;
    case 'apidocs':
      return <ApiDocs />;
    default:
      return <Landing />;
  }
}

export default function Home() {
  const { view, sidebarOpen } = useUIStore();
  const loadGenerations = useGenerationStore((s) => s.loadGenerations);

  useEffect(() => {
    // Load saved generations from DB on mount
    fetch('/api/generations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          loadGenerations(
            data.map((g: Record<string, unknown>) => ({
              id: g.id as string,
              prompt: g.prompt as string,
              ratio: g.ratio as string,
              imageUrl: g.imageUrl as string,
              status: (g.status as string) || 'completed',
              isFavorite: (g.isFavorite as boolean) || false,
              collection: (g.collection as string) || undefined,
              source: (g.source as string) || 'single',
              createdAt: new Date(g.createdAt as string),
            }))
          );
        }
      })
      .catch(() => {});
  }, [loadGenerations]);

  const isLanding = view === 'landing';

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[128px] animate-float" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-[128px] animate-float-delayed" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[128px] animate-float-slow" />
      </div>

      <div className="relative z-10 flex flex-1 min-h-screen">
        {/* Sidebar */}
        {!isLanding && <Sidebar />}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {!isLanding && <Header />}

          {/* View content */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={isLanding ? '' : 'p-4 md:p-6 max-w-[1600px] mx-auto w-full'}
              >
                <ViewRenderer view={view} />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer - sticky to bottom */}
          {!isLanding && (
            <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm px-6 py-3">
              <div className="flex items-center justify-between text-xs text-white/30 max-w-[1600px] mx-auto">
                <span>PixelForge AI &copy; {new Date().getFullYear()}</span>
                <div className="flex items-center gap-4">
                  <span>Powered by AI</span>
                  <span>&bull;</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Image Preview Modal - global */}
      <ImagePreviewModal />
    </div>
  );
}
