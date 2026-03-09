export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "SEOX",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-3-7-sonnet-latest"
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function isConfigured(name: string): boolean {
  return Boolean(process.env[name] && process.env[name]?.trim().length);
}
