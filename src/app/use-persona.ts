import { useContext } from "react";
import { PersonaContext, type PersonaContextValue } from "./persona-context";

export function usePersona(): PersonaContextValue {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider.");
  }
  return context;
}
