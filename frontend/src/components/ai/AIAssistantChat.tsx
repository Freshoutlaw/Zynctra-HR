/**
 * /frontend/src/components/ai/AIAssistantChat.tsx
 *
 * AI-powered HR assistant chat interface.
 * Supports freeform questions, HR context, and action suggestions.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  isLoading?: boolean;
}

export interface ChatAction {
  label: string;
  type: 'primary' | 'secondary';
  onClick: () => void;
}

interface AIAssistantChatProps {
  title?: string;
  placeholder?: string;
  systemContext?: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => Promise<string>;
  suggestions?: string[];
  compact?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  'How many employees are on leave this week?',
  'Draft a performance improvement plan',
  'What are the top retention risks?',
  'Summarise payroll anomalies this month',
  'Generate a leave policy for remote workers',
];

const TypingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
      />
    ))}
  </div>
);

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  title = 'Zynctra AI Assistant',
  placeholder = 'Ask me anything about your HR data…',
  onSendMessage,
  suggestions = DEFAULT_SUGGESTIONS,
  compact = false,
  initialMessages = [],
}) => {
  const { effectiveTheme } = useTheme();
  const { user } = useAuth();
  const isDark = effectiveTheme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi${user?.firstName ? ` ${user.firstName}` : ''}! I'm your Zynctra HR AI Assistant. I can help you with employee insights, policy drafting, anomaly analysis, and much more. What would you like to know?`,
      timestamp: new Date(),
    },
    ...initialMessages,
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg.id;
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setShowSuggestions(false);

    addMessage({ role: 'user', content: trimmed });

    setIsLoading(true);
    const loadingId = addMessage({ role: 'assistant', content: '', isLoading: true });

    try {
      let response = 'I\'m processing your request. In a fully connected environment, I\'ll pull live HR data to give you accurate insights.';
      if (onSendMessage) {
        response = await onSendMessage(trimmed);
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId ? { ...m, content: response, isLoading: false } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend(input);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
  };

  return (
    <div className={`flex flex-col rounded-xl border overflow-hidden ${
      compact ? 'h-96' : 'h-[600px]'
    } ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-slate-50 to-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-900 font-bold text-sm">
              AI
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isLoading ? 'Thinking…' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className={`text-xs px-2 py-1 rounded transition ${
            isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for assistant */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-900 text-xs font-bold flex-shrink-0 mr-2 mt-0.5">
                  AI
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-tr-sm'
                    : isDark
                      ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.isLoading ? <TypingDots /> : msg.content}
                </div>

                {/* Actions */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {msg.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                          action.type === 'primary'
                            ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-600'
                            : isDark
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-right' : ''
                } ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && !compact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-4 py-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
          >
            <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try asking:</p>
            <div className="flex gap-2 flex-wrap">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => void handleSend(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition truncate max-w-[200px] ${
                    isDark
                      ? 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5'
                      : 'border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`flex gap-2 items-end rounded-xl border px-3 py-2 transition ${
          isDark
            ? 'border-slate-600 bg-slate-800 focus-within:border-cyan-500/50'
            : 'border-slate-300 bg-white focus-within:border-cyan-400 focus-within:shadow-sm'
        }`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className={`flex-1 resize-none bg-transparent text-sm outline-none placeholder-opacity-60 ${
              isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            } disabled:opacity-50`}
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
            }}
          />
          <motion.button
            onClick={() => void handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-900 font-bold text-sm flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? '⟳' : '↑'}
          </motion.button>
        </div>
        <p className={`text-xs mt-1.5 text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIAssistantChat;