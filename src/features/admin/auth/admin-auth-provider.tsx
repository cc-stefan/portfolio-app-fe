"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildBackendApiUrl } from "@/lib/backend";
import type { AdminUser, AuthResponse } from "../model/types";
import {
  getBackendErrorMessage,
  readBackendError,
} from "../lib/backend-errors";

type AdminAuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "access-denied";

interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface LoginResult {
  ok: boolean;
  error?: string;
}

interface AdminAuthContextValue {
  status: AdminAuthStatus;
  user: AdminUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  clearAccessDenied: () => void;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const ACCESS_TOKEN_STORAGE_KEY = "portfolio-admin-access-token";
const REFRESH_TOKEN_STORAGE_KEY = "portfolio-admin-refresh-token";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

interface AdminAuthState {
  status: AdminAuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
}

function getStoredTokens(): StoredTokens {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  };
}

function storeTokens(tokens: StoredTokens) {
  if (typeof window === "undefined") {
    return;
  }

  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

function buildAuthenticatedHeaders(
  accessToken: string | null,
  headers?: HeadersInit,
) {
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return nextHeaders;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [state, setState] = useState<AdminAuthState>({
    status: "loading",
    accessToken: null,
    refreshToken: null,
    user: null,
  });
  const refreshPromiseRef = useRef<Promise<AuthResponse | null> | null>(null);

  const clearAuthState = useCallback(
    (status: Exclude<AdminAuthStatus, "authenticated">, user: AdminUser | null = null) => {
      storeTokens({
        accessToken: null,
        refreshToken: null,
      });
      setState({
        status,
        accessToken: null,
        refreshToken: null,
        user,
      });
    },
    [],
  );

  const applyAuthenticatedSession = useCallback((session: AuthResponse) => {
    storeTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    setState({
      status: "authenticated",
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    });
  }, []);

  const refreshSession = useCallback(
    async (refreshToken: string | null) => {
      if (!refreshToken) {
        clearAuthState("unauthenticated");
        return null;
      }

      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const promise = (async () => {
        const response = await fetch(buildBackendApiUrl("/auth/refresh"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearAuthState("unauthenticated");
          return null;
        }

        const session = (await response.json()) as AuthResponse;

        if (session.user.role !== "ADMIN") {
          clearAuthState("access-denied", session.user);
          return null;
        }

        applyAuthenticatedSession(session);
        return session;
      })().finally(() => {
        refreshPromiseRef.current = null;
      });

      refreshPromiseRef.current = promise;
      return promise;
    },
    [applyAuthenticatedSession, clearAuthState],
  );

  const bootstrapSession = useCallback(async () => {
    const storedTokens = getStoredTokens();

    if (!storedTokens.refreshToken && !storedTokens.accessToken) {
      clearAuthState("unauthenticated");
      return;
    }

    if (!storedTokens.accessToken) {
      await refreshSession(storedTokens.refreshToken);
      return;
    }

    const response = await fetch(buildBackendApiUrl("/auth/me"), {
      headers: buildAuthenticatedHeaders(storedTokens.accessToken),
    });

    if (response.status === 401) {
      await refreshSession(storedTokens.refreshToken);
      return;
    }

    if (!response.ok) {
      clearAuthState("unauthenticated");
      return;
    }

    const user = (await response.json()) as AdminUser;

    if (user.role !== "ADMIN") {
      clearAuthState("access-denied", user);
      return;
    }

    setState({
      status: "authenticated",
      accessToken: storedTokens.accessToken,
      refreshToken: storedTokens.refreshToken,
      user,
    });
  }, [clearAuthState, refreshSession]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void bootstrapSession();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [bootstrapSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const response = await fetch(buildBackendApiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorBody = await readBackendError(response);

        return {
          ok: false,
          error: getBackendErrorMessage(
            errorBody,
            "Unable to sign in with those credentials",
          ),
        };
      }

      const session = (await response.json()) as AuthResponse;

      if (session.user.role !== "ADMIN") {
        clearAuthState("access-denied", session.user);
        return {
          ok: false,
          error: "Access denied. Admin role required.",
        };
      }

      applyAuthenticatedSession(session);
      return { ok: true };
    },
    [applyAuthenticatedSession, clearAuthState],
  );

  const logout = useCallback(async () => {
    const accessToken = state.accessToken;

    try {
      if (accessToken) {
        await fetch(buildBackendApiUrl("/auth/logout"), {
          method: "POST",
          headers: buildAuthenticatedHeaders(accessToken),
        });
      }
    } finally {
      clearAuthState("unauthenticated");
    }
  }, [clearAuthState, state.accessToken]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const currentAccessToken = state.accessToken;
      const currentRefreshToken = state.refreshToken;

      const attemptRequest = async (accessToken: string | null) =>
        fetch(buildBackendApiUrl(path), {
          ...init,
          headers: buildAuthenticatedHeaders(accessToken, init.headers),
        });

      let response = await attemptRequest(currentAccessToken);

      if (response.status === 401) {
        const refreshedSession = await refreshSession(currentRefreshToken);

        if (!refreshedSession) {
          return response;
        }

        response = await attemptRequest(refreshedSession.accessToken);
      }

      if (response.status === 403) {
        setState((currentState) => ({
          ...currentState,
          status: "access-denied",
        }));
      }

      return response;
    },
    [refreshSession, state.accessToken, state.refreshToken],
  );

  const clearAccessDenied = useCallback(() => {
    clearAuthState("unauthenticated");
  }, [clearAuthState]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      accessToken: state.accessToken,
      login,
      logout,
      clearAccessDenied,
      authFetch,
    }),
    [
      authFetch,
      clearAccessDenied,
      login,
      logout,
      state.accessToken,
      state.status,
      state.user,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}
