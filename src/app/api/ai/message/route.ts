import { sendMessage } from '@/services/ai-router';
import type { AIMode, AIMessage } from '@/types/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, message, mode, language } = body as {
      conversationId: string;
      message: { content: string };
      mode: AIMode;
      language?: string;
    };

    if (!conversationId || !message?.content || !mode) {
      return Response.json(
        { error: 'conversationId, message.content, and mode are required' },
        { status: 400 },
      );
    }

    const aiMessage: AIMessage = {
      role: 'student',
      content: message.content,
      timestamp: new Date(),
    };

    const response = await sendMessage(conversationId, aiMessage, mode, language);
    return Response.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'AI message failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
