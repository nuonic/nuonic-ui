import { Send } from 'lucide-react';

import { FormEvent, KeyboardEvent } from 'react';

type ChatInputProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, isSending, onChange, onSubmit }: ChatInputProps) {
  const inputRows = Math.min(3, Math.max(1, value.split('\n').length));
  const inputHeightClass = inputRows === 1 ? 'h-10 overflow-hidden' : 'overflow-y-auto';

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={submitMessage}
      className="flex shrink-0 items-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={inputRows}
        placeholder="Ask a question"
        className={`${inputHeightClass} min-h-10 flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white`}
      />
      <button
        type="submit"
        aria-label="Send message"
        title="Send message"
        disabled={!value.trim() || isSending}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
