import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { env } from '@/config/env';

let client: BedrockRuntimeClient | null = null;

function getClient(): BedrockRuntimeClient {
  if (!client) {
    client = new BedrockRuntimeClient({ region: env.AWS_REGION });
  }
  return client;
}

/**
 * Invoke a Bedrock foundation model with an optional system prompt and guardrail.
 */
export async function invokeModel(
  prompt: string,
  systemPrompt?: string,
  guardrailId?: string,
): Promise<string> {
  const modelId = env.BEDROCK_MODEL_ID;
  const effectiveGuardrail = guardrailId || env.BEDROCK_GUARDRAIL_ID;

  const messages = [{ role: 'user' as const, content: prompt }];
  const body: Record<string, unknown> = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1024,
    messages,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const commandInput: Record<string, unknown> = {
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(JSON.stringify(body)),
  };

  if (effectiveGuardrail) {
    commandInput.guardrailIdentifier = effectiveGuardrail;
    commandInput.guardrailVersion = 'DRAFT';
  }

  const command = new InvokeModelCommand(commandInput as never);
  const response = await getClient().send(command);

  const decoded = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(decoded);

  // Claude models return content as an array of blocks
  if (parsed.content && Array.isArray(parsed.content)) {
    return parsed.content
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('');
  }

  return parsed.completion ?? parsed.output ?? '';
}
