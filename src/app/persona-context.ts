import { createContext } from "react";

export type Persona = "developer" | "admin";

export interface PersonaContextValue {
  persona: Persona;
  setPersona: (persona: Persona) => void;
}

export const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);
