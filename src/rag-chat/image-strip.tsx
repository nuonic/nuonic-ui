import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { ImageLightbox } from './image-lightbox';
import { isSafeImageUrl } from './markdown';
import type { RagChatImage } from './types';

type ImageStripProps = {
  images: RagChatImage[];
  resolveImageUrl?: (url: string) => string;
};

export function ImageStrip({ images, resolveImageUrl }: ImageStripProps) {
  const safeImages = images
    .filter((image) => image.url && isSafeImageUrl(image.url))
    .map((image) => (resolveImageUrl ? { ...image, url: resolveImageUrl(image.url) } : image));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    setCanScrollLeft(scroller.scrollLeft > 0);
    setCanScrollRight(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      scroller.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [safeImages.length]);

  const scrollImages = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: direction * 272, behavior: 'smooth' });
  };

  if (safeImages.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      {safeImages.length > 1 && (
        <div className="mb-2 flex justify-end gap-1">
          <button
            type="button"
            aria-label="Previous screenshot"
            title="Previous screenshot"
            disabled={!canScrollLeft}
            onClick={() => scrollImages(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            title="Next screenshot"
            disabled={!canScrollRight}
            onClick={() => scrollImages(1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <div ref={scrollerRef} className="flex gap-2 overflow-x-auto pb-1">
        {safeImages.map((image, index) => (
          <button
            key={image.url}
            type="button"
            aria-label={`Preview ${image.alt || 'help centre screenshot'}`}
            title={image.alt || 'Preview screenshot'}
            onClick={() => setSelectedImageIndex(index)}
            className="shrink-0 rounded-md text-left outline-none ring-primary transition hover:opacity-90 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt || 'Help centre screenshot'}
              loading="lazy"
              className="h-36 w-64 rounded-md border border-slate-200 bg-white object-contain dark:border-slate-700"
              onError={(event) => {
                const button = event.currentTarget.closest('button');
                if (button) button.style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={safeImages}
        selectedIndex={selectedImageIndex}
        onSelectIndex={setSelectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
      />
    </div>
  );
}
