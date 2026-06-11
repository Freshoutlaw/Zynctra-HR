import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAt: string;
}

interface AiState {
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  setProcessing: (isProcessing: boolean) => void;
  appendMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  clearChat: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  chatHistory: [],
  isProcessing: false,
  setProcessing: (isProcessing) => set({ isProcessing }),
  appendMessage: (message) =>
    set((state) => ({
      chatHistory: [
        {
          ...message,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
        ...state.chatHistory,
      ],
    })),
  clearChat: () => set({ chatHistory: [] }),
}));
