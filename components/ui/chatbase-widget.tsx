'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MoreHorizontal } from "lucide-react";
import { defaultChatbaseConfig, type ChatbaseConfig as ConfigType } from "@/lib/chatbase-config";
import { AIChatInput } from "@/components/ui/ai-chat-input";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbaseConfig {
  // Branding
  agentName: string;
  agentLogo?: string;
  headerBackground: string;
  headerTextColor: string;
  
  // Colors
  userMessageBackground: string;
  userMessageTextColor: string;
  botMessageBackground: string;
  botMessageTextColor: string;
  backgroundColor: string;
  
  // Watermark
  watermarkText: string;
  watermarkTextColor: string;
  
  // Privacy
  privacyText: string;
  privacyLinkText: string;
  privacyLink: string;
  
  // Suggested questions
  suggestedQuestions: string[];
  
  // Welcome message
  welcomeMessage: string;
  welcomeEmoji: string;
}

// Remove the local defaultConfig since we're importing it from the config file

interface ChatbaseWidgetProps {
  config?: Partial<ConfigType>;
  className?: string;
}

export default function ChatbaseWidget({ config = {}, className = "" }: ChatbaseWidgetProps) {
  const finalConfig = { ...defaultChatbaseConfig, ...config };
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `${finalConfig.welcomeEmoji} ${finalConfig.welcomeMessage}`,
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const filteredMessages = [...messages, userMessage].filter(msg => 
        msg.role === 'user' || (msg.role === 'assistant' && msg.content.trim() !== '')
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: filteredMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSubmit(question);
  };

  // Function to determine if a color is light
  const isLightColor = (color: string): boolean => {
    if (!color.startsWith('#')) return false;
    
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className={`w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden ${className} dark:bg-gray-800 bg-white`} style={{ height: '600px' }}>
      {/* Header */}
      <div 
        className={`px-4 py-3 flex items-center justify-between ${
          finalConfig.headerBackground?.startsWith('#') 
            ? (isLightColor(finalConfig.headerBackground) ? 'text-black' : 'text-white')
            : finalConfig.headerTextColor || 'text-white'
        } ${
          finalConfig.headerBackground?.startsWith('#') 
            ? '' 
            : finalConfig.headerBackground || 'bg-gray-900'
        }`}
        style={{
          backgroundColor: finalConfig.headerBackground?.startsWith('#') 
            ? finalConfig.headerBackground 
            : undefined
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-white text-gray-900">
              C
            </AvatarFallback>
            {finalConfig.agentLogo && (
              <AvatarImage src={finalConfig.agentLogo} />
            )}
          </Avatar>
          <span className="font-medium text-sm">{finalConfig.agentName}</span>
        </div>
        <MoreHorizontal className="w-4 h-4" />
      </div>

      {/* Chat Area */}
      <div className={`flex flex-col ${finalConfig.backgroundColor} dark:bg-gray-800`} style={{ height: 'calc(600px - 60px)' }}>
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-4" style={{ maxHeight: 'calc(100% - 100px)' }}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.role === 'assistant' && index === 0 && (
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gray-900 text-white">
                        C
                      </AvatarFallback>
                      {finalConfig.agentLogo && (
                        <AvatarImage src={finalConfig.agentLogo} />
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {finalConfig.agentName}
                      </div>
                      <div className={`${finalConfig.botMessageBackground} ${finalConfig.botMessageTextColor} rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                )}
                
                {message.role === 'assistant' && index > 0 && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gray-900 text-white">
                        C
                      </AvatarFallback>
                    </Avatar>
                    <div className={`${finalConfig.botMessageBackground} ${finalConfig.botMessageTextColor} rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed max-w-[80%]`}>
                      {message.content}
                    </div>
                  </div>
                )}
                
                {message.role === 'user' && (
                  <div className="flex justify-end">
                    <div 
                      className={`rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed max-w-[80%] ${
                        finalConfig.userMessageBackground?.startsWith('#') 
                          ? (isLightColor(finalConfig.userMessageBackground) ? 'text-black' : 'text-white')
                          : finalConfig.userMessageTextColor || 'text-white'
                      } ${
                        finalConfig.userMessageBackground?.startsWith('#') 
                          ? '' 
                          : finalConfig.userMessageBackground || 'bg-blue-500'
                      }`}
                      style={{
                        backgroundColor: finalConfig.userMessageBackground?.startsWith('#') 
                          ? finalConfig.userMessageBackground 
                          : undefined
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Questions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {finalConfig.suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="inline-block bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black transition-all duration-200"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gray-900 text-white">
                    C
                  </AvatarFallback>
                </Avatar>
                <div className={`${finalConfig.botMessageBackground} rounded-2xl rounded-tl-md px-4 py-3`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Privacy Notice */}
        {showPrivacyNotice && (
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>
              {finalConfig.privacyText}{' '}
              <a href={finalConfig.privacyLink} className="underline">
                {finalConfig.privacyLinkText}
              </a>
              .
            </span>
            <button
              onClick={() => setShowPrivacyNotice(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Area - moved to bottom */}
        <div className="mt-auto">
          {/* Watermark - above input */}
          <div className="px-4 py-2 text-center border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <span className={`text-xs ${finalConfig.watermarkTextColor} dark:text-gray-300 flex items-center justify-center gap-1`}>
              <Avatar className="w-4 h-4">
                <AvatarFallback className="bg-gray-400 text-white text-xs">
                  C
                </AvatarFallback>
              </Avatar>
              {finalConfig.watermarkText}
            </span>
          </div>
          
          {/* Input */}
          <div className="px-2 py-2">
            <div className="scale-100 origin-bottom">
              <AIChatInput
                onSubmit={handleSubmit}
                disabled={isLoading}
                placeholder=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}