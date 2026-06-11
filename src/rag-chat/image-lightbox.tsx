import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

import { useEffect } from 'react';

import type { RagChatImage } from './types';

type ImageLightboxProps = {
  images: RagChatImage[];
  selectedIndex: number | null;
  onSelectIndex: (updater: (currentIndex: number | null) => number | null) => void;
  onClose: () => void;
};

export function ImageLightbox({ images, selectedIndex, onSelectIndex, onClose }: ImageLightboxProps) {
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        onSelectIndex((currentIndex) => {
          if (currentIndex === null) return currentIndex;
          return Math.max(0, currentIndex - 1);
        });
      }

      if (event.key === 'ArrowRight') {
        onSelectIndex((currentIndex) => {
          if (currentIndex === null) return currentIndex;
          return Math.min(images.length - 1, currentIndex + 1);
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, selectedIndex]);

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt || 'Help centre screenshot'}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-slate-900"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <div className="flex shrink-0 items-center justify-end gap-1 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <a
                href={selectedImage.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open screenshot in new tab"
                title="Open screenshot in new tab"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                aria-label="Close screenshot preview"
                title="Close screenshot preview"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-100 p-3 dark:bg-slate-950">
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous screenshot"
                    title="Previous screenshot"
                    disabled={selectedIndex === 0}
                    onClick={() => onSelectIndex((currentIndex) => Math.max(0, (currentIndex ?? 0) - 1))}
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-primary"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next screenshot"
                    title="Next screenshot"
                    disabled={selectedIndex === images.length - 1}
                    onClick={() =>
                      onSelectIndex((currentIndex) => Math.min(images.length - 1, (currentIndex ?? 0) + 1))
                    }
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-primary"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || 'Help centre screenshot'}
                className="max-h-[calc(100vh-8rem)] w-auto max-w-full rounded-md bg-white object-contain shadow-sm"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
