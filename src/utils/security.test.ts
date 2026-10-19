import { describe, expect, it } from 'vitest';
import { sanitizeUserInput, validateExternalUrl, readPublicRuntimeConfig } from './security';

describe('security utilities', () => {
  it('strips unsafe HTML and normalizes whitespace from user input', () => {
    const result = sanitizeUserInput('  <script>alert(1)</script> Hello <b>world</b>  ');
    expect(result).toBe('Hello world');
  });

  it('allows secure external URLs and blocks unsafe protocols', () => {
    expect(validateExternalUrl('https://example.com/path')).toBe(true);
    expect(validateExternalUrl('mailto:test@example.com')).toBe(false);
    expect(validateExternalUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects private or unsafe runtime configuration', () => {
    const config = readPublicRuntimeConfig({
      VITE_API_URL: 'https://api.example.com',
      VITE_AUTH_API: 'javascript:alert(1)',
      VITE_ABHA_API: 'https://abha.example.com',
    });

    expect(config.apiUrl).toBe('https://api.example.com');
    expect(config.authApi).toBeNull();
    expect(config.abhaApi).toBe('https://abha.example.com');
  });
});
