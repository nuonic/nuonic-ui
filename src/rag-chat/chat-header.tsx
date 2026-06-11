import { Sparkles, Trash2, X } from 'lucide-react';

type ChatHeaderProps = {
  isSending: boolean;
  onClear: () => void;
  onClose: () => void;
};

export function ChatHeader({ isSending, onClear, onClose }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="flex flex-col leading-tight">
          <h2 className="text-sm font-semibold">Help chat</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by Nuonic AI</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Clear conversation"
          title="Clear conversation"
          onClick={onClear}
          disabled={isSending}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Close help chat"
          title="Close help chat"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
