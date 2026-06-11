export function ClosedNotice({ onStartNewChat }: { onStartNewChat: () => void }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 border-t border-slate-200 bg-slate-50 px-4 py-4 text-center dark:border-slate-700 dark:bg-slate-800/50">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">This conversation has been closed.</p>
      <button type="button" onClick={onStartNewChat} className="text-xs font-medium text-primary hover:underline">
        Start a new chat
      </button>
    </div>
  );
}
