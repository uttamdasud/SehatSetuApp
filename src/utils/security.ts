export type RuntimeConfigShape = Record<string, string | undefined>;

export interface PublicRuntimeConfig {
  apiUrl: string | null;
  authApi: string | null;
  abhaApi: string | null;
}

export function sanitizeUserInput(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }

  const withoutHtml = value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  return withoutHtml;
}

export function validateExternalUrl(value: string | undefined): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const allowedProtocols = new Set(['https:', 'http:']);
    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
    return allowedProtocols.has(parsed.protocol) && (parsed.protocol === 'https:' || isLocalhost);
  } catch {
    return false;
  }
}

export function readPublicRuntimeConfig(env: RuntimeConfigShape): PublicRuntimeConfig {
  const apiUrl = validateExternalUrl(env.VITE_API_URL) ? env.VITE_API_URL!.trim() : null;
  const authApi = validateExternalUrl(env.VITE_AUTH_API) ? env.VITE_AUTH_API!.trim() : null;
  const abhaApi = validateExternalUrl(env.VITE_ABHA_API) ? env.VITE_ABHA_API!.trim() : null;

  return {
    apiUrl,
    authApi,
    abhaApi,
  };
}
