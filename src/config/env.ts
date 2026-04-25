/** Typed environment variable access */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  get DATABASE_URL() {
    return required('DATABASE_URL');
  },
  get REDIS_URL() {
    return required('REDIS_URL');
  },
  get NODE_ENV() {
    return optional('NODE_ENV', 'development');
  },
  get SESSION_TTL_SECONDS() {
    return parseInt(optional('SESSION_TTL_SECONDS', '86400'), 10); // 24h default
  },
  get AWS_REGION() {
    return optional('AWS_REGION', 'us-east-1');
  },
  get BEDROCK_MODEL_ID() {
    return optional('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0');
  },
  get BEDROCK_GUARDRAIL_ID() {
    return optional('BEDROCK_GUARDRAIL_ID', '');
  },
  get NOVA_SONIC_MODEL_ID() {
    return optional('NOVA_SONIC_MODEL_ID', 'amazon.nova-sonic-v1:0');
  },
} as const;
