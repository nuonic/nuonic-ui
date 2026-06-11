import { Sparkles } from 'lucide-react';

type WelcomeScreenProps = {
  suggestions: string[];
  isSending: boolean;
  onSuggestionClick: (suggestion: string) => void;
};

export function WelcomeScreen({ suggestions, isSending, onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20">
        <Sparkles className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">Help Centre Chat</p>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Ask about Nuonic&apos;s features, guides, and account management.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={isSending}
            onClick={() => onSuggestionClick(suggestion)}
            className="group w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5 hover:text-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:text-primary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
