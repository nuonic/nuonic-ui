import { Check, Copy } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

export function CopyButton({ text, html, ariaLabel }: { text: string; html?: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      if (html && typeof window !== 'undefined' && typeof window.ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new window.ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently ignore clipboard failures (e.g. permissions denied).
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      title={copied ? 'Copied' : ariaLabel}
      className="flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium text-slate-500 opacity-0 transition hover:bg-slate-200/60 hover:text-slate-900 focus:opacity-100 group-hover:opacity-100 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" aria-hidden="true" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
