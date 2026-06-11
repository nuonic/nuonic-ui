export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type RagChatSource = {
  title: string;
  section?: string;
  url?: string;
};

export type RagChatImage = {
  url: string;
  alt?: string;
};

export type UiMessage = ChatMessage & {
  sources?: RagChatSource[];
  images?: RagChatImage[];
};

export type RagChatResponse = {
  answer: string;
  conversation_id?: string;
  sources?: RagChatSource[];
  images?: RagChatImage[];
  escalation?: { status: string };
};

export type RagChatWidgetProps = {
  /** Posts the conversation to the app's chat endpoint and returns the assistant's reply. */
  sendChat: (messages: ChatMessage[], conversationId: string | null) => Promise<RagChatResponse>;
  /** Suggested questions shown on the welcome screen. */
  suggestions: string[];
  /** Maps image URLs from the chat response before rendering (e.g. prefixing relative URLs). */
  resolveImageUrl?: (url: string) => string;
  /** When set, only the most recent N messages are sent to the endpoint. */
  maxHistoryMessages?: number;
  /** When set, dispatching this window event opens the widget. */
  openEventName?: string;
};
