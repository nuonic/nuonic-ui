import { useState } from 'react';

const DEFAULT_W = 448; // 28rem
const DEFAULT_H = 640; // 40rem
const MIN_W = 320;
const MIN_H = 360;

type DragState = { startX: number; startY: number; startW: number; startH: number };

// Resizes from the top-left corner, so dragging up/left grows the panel.
export function useResizablePanel() {
  const [size, setSize] = useState({ width: DEFAULT_W, height: DEFAULT_H });

  const onResizeMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const drag: DragState = {
      startX: event.clientX,
      startY: event.clientY,
      startW: size.width,
      startH: size.height,
    };

    const onMouseMove = (e: MouseEvent) => {
      const maxW = window.innerWidth - 40;
      const maxH = window.innerHeight - 40;
      setSize({
        width: Math.max(MIN_W, Math.min(maxW, drag.startW + drag.startX - e.clientX)),
        height: Math.max(MIN_H, Math.min(maxH, drag.startH + drag.startY - e.clientY)),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return { size, onResizeMouseDown };
}
