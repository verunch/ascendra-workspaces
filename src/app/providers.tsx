import { useEffect, useMemo, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersonaContext, type Persona, type PersonaContextValue } from "./persona-context";

const PERSONA_STORAGE_KEY = "ascendra:persona";

function readStoredPersona(): Persona {
  if (typeof window === "undefined") {
    return "developer";
  }
  return window.localStorage.getItem(PERSONA_STORAGE_KEY) === "admin" ? "admin" : "developer";
}

/**
 * Stands in for auth (docs/architecture.md §8) — persona is client-only UI
 * state, orthogonal to server data, so it lives in Context rather than the
 * TanStack Query cache.
 */
function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(readStoredPersona);

  useEffect(() => {
    window.localStorage.setItem(PERSONA_STORAGE_KEY, persona);
  }, [persona]);

  const value = useMemo<PersonaContextValue>(() => ({ persona, setPersona }), [persona]);

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonaProvider>{children}</PersonaProvider>
    </QueryClientProvider>
  );
}
