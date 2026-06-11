import { useState } from 'react';

import type { RagChatWidgetProps, UiMessage } from './types';

type UseRagChatOptions = Pick<RagChatWidgetProps, 'sendChat' | 'maxHistoryMessages'>;

export function useRagChat({ sendChat, maxHistoryMessages }: UseRagChatOptions) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const clearMessages = () => {
    setMessages([]);
    setConversationId(null);
    setInput('');
    setIsClosed(false);
  };

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isSending || isClosed) return;

    const nextMessages: UiMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const chatMessages = nextMessages
        .map(({ role, content }) => ({ role, content }))
        .slice(maxHistoryMessages ? -maxHistoryMessages : 0);
      const response = await sendChat(chatMessages, conversationId);
      setConversationId(response.conversation_id ?? conversationId);
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: response.answer, sources: response.sources, images: response.images },
      ]);
      if (response.escalation?.status === 'escalated' || response.escalation?.status === 'closed') {
        setIsClosed(true);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'I could not reach the help chat right now. Please try again later.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return { input, setInput, messages, isSending, isClosed, send, clearMessages };
}
