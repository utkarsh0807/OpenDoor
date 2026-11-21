'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  ChevronDown,
  Loader2,
  ShieldCheck,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { useRegion } from '@/lib/context/RegionContext';
import { StorageManager } from '@/lib/storage';
import { ChatMessage, ChatCitation } from '@/lib/types';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Hi! I'm your ChanceDeck AI Assistant. I can search opportunities, discover scholarships, compare hackathons, explain eligibility and answer general questions. What would you like to explore?`,
  timestamp: new Date().toISOString(),
  suggestedFollowUps: [
    'Discover hackathons in my region',
    'How do I apply for MahaDBT scholarships?',
    'What are the best tech stacks for a hackathon?',
    'Explain required documents for college schemes'
  ]
};

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { region, regionLabel } = useRegion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMinimized]);

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Fetch student profile preferences
      const profile = StorageManager.getProfile();

      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.map(m => ({ role: m.role, content: m.content })),
          preferences: {
            region,
            stream: profile?.stream,
            course: profile?.course,
            educationLevel: profile?.educationLevel,
            academicYear: profile?.academicYear,
            skills: profile?.skills,
            interests: profile?.interests
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || "I've processed your question based on current opportunity intelligence.",
        timestamp: new Date().toISOString(),
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Failed to get assistant response:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `I ran into a network difficulty connecting to the assistant service. Please check your connection or tap Retry.`,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: ['Retry previous question', 'Show hackathons near me']
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
          aria-label="Open ChanceDeck AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white ring-1 ring-emerald-300"></span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold leading-tight flex items-center gap-1">
              ChanceDeck AI
              <Sparkles className="w-3 h-3 text-amber-300 inline" />
            </div>
            <div className="text-[10px] text-purple-100 font-medium">Ask Gemini Assistant</div>
          </div>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div 
          className={`flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 w-[95vw] sm:w-[420px] transition-all duration-200 overflow-hidden ${
            isMinimized ? 'h-14' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-sm select-none">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Bot className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  ChanceDeck AI Assistant
                  <span className="text-[10px] bg-purple-500/40 text-purple-100 px-1.5 py-0.5 rounded-full border border-purple-300/30 font-medium">
                    Gemini
                  </span>
                </h3>
                <p className="text-[11px] text-purple-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-300 inline" />
                  Region: {regionLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-purple-200">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Anti-hallucination guard active
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="hover:text-indigo-600 flex items-center gap-0.5 transition-colors"
                    title="Retry last query"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                  <button
                    onClick={handleClear}
                    className="hover:text-rose-600 flex items-center gap-0.5 transition-colors"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs text-slate-700 bg-slate-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {/* Markdown rendering with simple line breaks and bold formatting */}
                      <div className="whitespace-pre-line space-y-1">
                        {msg.content}
                      </div>

                      {/* Source Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Verified Citations & Sources
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cite, idx) => (
                              <a
                                key={idx}
                                href={cite.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                              >
                                {cite.sourceName}
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Actions */}
                      <div className="mt-1 flex items-center justify-between text-[10px] opacity-75 pt-1">
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="hover:opacity-100 ml-2 inline-flex items-center gap-0.5 text-slate-500 hover:text-purple-600"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedId === msg.id ? 'Copied' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Follow-up question chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                        {msg.suggestedFollowUps.map((chip, chipIdx) => (
                          <button
                            key={chipIdx}
                            onClick={() => handleSendMessage(chip)}
                            className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-left transition-colors"
                          >
                            {chip} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-1">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span>Gemini is synthesizing opportunity intelligence...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about hackathons, scholarships, prep..."
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-xl shadow transition-colors shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-1.5 text-center text-[10px] text-slate-400">
                  Powered by Google Gemini • ChanceDeck Student Intelligence
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
