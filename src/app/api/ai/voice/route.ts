import {
  startVoiceSession,
  endVoiceSession,
} from '@/services/voice-session';
import type { VoiceConfig } from '@/types/ai';

/**
 * POST — Start a voice session.
 * Returns session config for the client to establish a WebSocket connection.
 * Note: Real WebSocket upgrade requires a custom server; this provides the API structure.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, config } = body as {
      conversationId: string;
      config?: Partial<VoiceConfig>;
    };

    if (!conversationId) {
      return Response.json(
        { error: 'conversationId is required' },
        { status: 400 },
      );
    }

    const voiceConfig: VoiceConfig = {
      language: config?.language ?? 'en',
      sampleRate: config?.sampleRate ?? 16000,
      encoding: config?.encoding ?? 'pcm',
    };

    const session = startVoiceSession(conversationId, voiceConfig);

    return Response.json({
      session: {
        sessionId: session.sessionId,
        conversationId: session.conversationId,
        modelId: session.modelId,
        region: session.region,
        status: session.status,
        config: session.config,
      },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to start voice session';
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE — End a voice session.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json(
        { error: 'sessionId query parameter is required' },
        { status: 400 },
      );
    }

    const ended = endVoiceSession(sessionId);
    if (!ended) {
      return Response.json(
        { error: 'Voice session not found' },
        { status: 404 },
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to end voice session';
    return Response.json({ error: message }, { status: 500 });
  }
}
