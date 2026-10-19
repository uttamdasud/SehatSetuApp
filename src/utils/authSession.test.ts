import { describe, expect, it } from 'vitest';
import { createAuthSession, isValidAuthSession, logoutAuthSession } from './authSession';

describe('auth session utilities', () => {
  it('creates a valid authenticated session for a known user', () => {
    const session = createAuthSession({ userName: 'Uttam Das', role: 'patient' });

    expect(session.isAuthenticated).toBe(true);
    expect(session.userName).toBe('Uttam Das');
    expect(session.role).toBe('patient');
    expect(isValidAuthSession(session)).toBe(true);
  });

  it('logs the user out and clears the session token', () => {
    const session = createAuthSession({ userName: 'Uttam Das', role: 'patient' });
    const loggedOut = logoutAuthSession(session);

    expect(loggedOut.isAuthenticated).toBe(false);
    expect(loggedOut.userName).toBeNull();
    expect(loggedOut.role).toBeNull();
    expect(loggedOut.sessionToken).toBeNull();
  });
});
