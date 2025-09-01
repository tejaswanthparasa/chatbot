"use client"

import { useState } from "react"
import { Bot } from "lucide-react"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { AIChatInput } from "@/components/ui/ai-chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

export default function ExpandableChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "ai",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (files: FileList) => {
    console.log("Files uploaded:", files);
    // Handle file upload logic here
    // You can process files, send them to API, etc.
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`File ${i + 1}:`, file.name, file.type, file.size);
    }
  }

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      content: message.trim(),
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("")
    setIsLoading(true)

    try {
      // Filter out empty assistant messages before sending
      const filteredMessages = [...messages, userMessage].filter(msg => 
        msg.sender === 'user' || (msg.sender === 'ai' && msg.content.trim() !== '')
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: filteredMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
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
        id: messages.length + 2,
        content: '',
        sender: 'ai',
      };

      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          // Handle text stream format
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + parsed.choices[0].delta.content }
                    : msg
                ));
              }
            } catch (e) {
              // Handle plain text streaming
              if (data && data !== '[DONE]') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + data }
                    : msg
                ));
              }
            }
          } else if (line.startsWith('0:')) {
            // Handle Vercel AI SDK text stream format
            const data = line.slice(2);
            if (data) {
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: msg.content + data }
                  : msg
              ));
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      }]);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="h-screen relative bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Expandable Chat Widget Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          This expandable chat widget can be embedded on any website. It uses your Gemini API for AI responses.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sample Website Content</h2>
          <p className="text-gray-600 mb-4">
            This is a demo of how the chat widget would appear on a real website. 
            The widget floats in the bottom-right corner and can be toggled open/closed.
          </p>
          <p className="text-gray-600">
            Click the chat button in the bottom-right corner to start chatting with the AI assistant!
          </p>
        </div>
      </div>

      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with AI ✨</h1>
          <p className="text-sm text-muted-foreground">
            Powered by Gemini API
          </p>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={
                    message.sender === "user"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                  }
                  fallback={message.sender === "user" ? "U" : "AI"}
                />
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="AI"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <AIChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onFileUpload={handleFileUpload}
            placeholder="Type your message..."
            disabled={isLoading}
          />
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  )
}