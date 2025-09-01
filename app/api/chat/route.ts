import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const messages = body.messages || [];
    
    if (!Array.isArray(messages)) {
      return new Response('Messages must be an array', { status: 400 });
    }

    // Filter out empty assistant messages and convert to proper format
    const filteredMessages = messages
      .filter(msg => msg.content && msg.content.trim() !== '')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
    
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: 'You are a helpful AI assistant. Be concise and helpful in your responses.',
      messages: filteredMessages,
    });
    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}