export type AuthRole = 'patient' | 'doctor' | 'admin' | null;

export interface AuthSession {
  isAuthenticated: boolean;
  userName: string | null;
  role: AuthRole;
  sessionToken: string | null;
}

export function createAuthSession({ userName, role }: { userName: string; role: Exclude<AuthRole, null> }): AuthSession {
  return {
    isAuthenticated: true,
    userName,
    role,
    sessionToken: `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
  };
}

export function isValidAuthSession(session: Partial<AuthSession> | null | undefined): boolean {
  if (!session) return false;
  return Boolean(
    session.isAuthenticated &&
      typeof session.userName === 'string' &&
      session.userName.trim().length > 0 &&
      session.role &&
      typeof session.sessionToken === 'string' &&
      session.sessionToken.trim().length > 0
  );
}

export function logoutAuthSession(): AuthSession {
  return {
    isAuthenticated: false,
    userName: null,
    role: null,
    sessionToken: null,
  };
}
