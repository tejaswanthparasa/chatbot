'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Phone, Video, MoreVertical } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function MobileChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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

  return (
    <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-800 relative">
      {/* Status Bar */}
      <div className="bg-black h-6 rounded-t-[1.5rem] flex items-center justify-center">
        <div className="w-12 h-1 bg-white rounded-full"></div>
      </div>
      
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-500 text-white">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 flex flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Say hello to start chatting!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  {message.role === 'assistant' && (
                    <Avatar className="w-6 h-6 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2">
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
        
        {/* Chat Input */}
        <div className="p-3 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="border-none p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              size="icon"
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="bg-black h-4 rounded-b-[1.5rem] flex items-center justify-center">
        <div className="w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}