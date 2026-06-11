'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Grip, MessageCircle } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ClosedNotice } from './closed-notice';
import { LoadingDots } from './loading-dots';
import { MessageRow } from './message-row';
import type { RagChatWidgetProps } from './types';
import { useRagChat } from './use-rag-chat';
import { useResizablePanel } from './use-resizable-panel';
import { WelcomeScreen } from './welcome-screen';

export default function RagChatWidget({
  sendChat,
  suggestions,
  resolveImageUrl,
  maxHistoryMessages,
}: RagChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { input, setInput, messages, isSending, isClosed, send, clearMessages } = useRagChat({
    sendChat,
    maxHistoryMessages,
  });
  const { size, onResizeMouseDown } = useResizablePanel();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const showWelcome = messages.length === 0 && !isSending;

  return (
    <>
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.button
            key="launcher"
            type="button"
            aria-label="Open help chat"
            title="Open help chat"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 ring-1 ring-white/20 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="panel"
            style={{ width: size.width, height: size.height, transformOrigin: 'bottom right' }}
            initial={{ scale: 0.5, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.5,
              opacity: 0,
              y: 16,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            transition={{ type: 'spring', stiffness: 360, damping: 26, mass: 0.9 }}
            className="fixed bottom-5 right-5 z-[100] flex max-h-[calc(100vh-2.5rem)] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-black/25 ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:ring-white/10"
          >
            {/* Resize handle — drag from the top-left corner to grow the widget */}
            <div
              onMouseDown={onResizeMouseDown}
              aria-hidden="true"
              className="absolute left-0 top-0 z-10 h-5 w-5 cursor-nw-resize"
            >
              <Grip className="absolute left-1 top-1 h-3 w-3 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            </div>

            <ChatHeader isSending={isSending} onClear={clearMessages} onClose={() => setIsOpen(false)} />

            {showWelcome ? (
              <WelcomeScreen suggestions={suggestions} isSending={isSending} onSuggestionClick={send} />
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((message, index) => (
                  <MessageRow key={`${message.role}-${index}`} message={message} resolveImageUrl={resolveImageUrl} />
                ))}
                {isSending && <LoadingDots />}
                <div ref={bottomRef} />
              </div>
            )}

            {isClosed ? (
              <ClosedNotice onStartNewChat={clearMessages} />
            ) : (
              <ChatInput value={input} isSending={isSending} onChange={setInput} onSubmit={() => send(input)} />
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
