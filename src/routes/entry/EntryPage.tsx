import { useNavigate } from "react-router-dom";
import { Monitor, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePersona } from "@/app/use-persona";
import type { Persona } from "@/app/persona-context";
import { cn } from "@/lib/utils";

interface PersonaChoice {
  persona: Persona;
  title: string;
  description: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  /** Foreshadows each shell's own tone (light sage vs dark governance) from docs/architecture.md §6. */
  iconBoxClassName: string;
}

const CHOICES: PersonaChoice[] = [
  {
    persona: "developer",
    title: "Continue as Developer",
    description: "View and manage your own machines — status, usage, and connect.",
    to: "/app/machines",
    icon: Monitor,
    iconBoxClassName: "bg-primary-subtle text-primary-700",
  },
  {
    persona: "admin",
    title: "Continue as Admin",
    description: "Monitor fleet health, utilization, cost, and templates.",
    to: "/admin/overview",
    icon: ShieldCheck,
    iconBoxClassName: "bg-primary-900 text-primary-100",
  },
];

/** Persona-switcher entry point — stands in for auth (docs/architecture.md §1). */
export function EntryPage() {
  const { setPersona } = usePersona();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-700">
          <div
            className="size-4 rotate-45 rounded-sm border-2 border-primary-300"
            aria-hidden="true"
          />
        </div>
        <img src="/company-logo.png" alt="Ascendra" className="mt-[0.3rem] h-6 w-auto object-contain" />
        <h1 className="mt-8 text-display text-text-heading">Ascendra Workspaces</h1>
        <p className="mt-2 max-w-measure text-body text-text-secondary">
          Choose how you&apos;d like to continue. This switcher stands in for sign-in — no
          account is required.
        </p>
      </div>

      <div className="grid w-full max-w-[640px] grid-cols-2 gap-4 max-md:grid-cols-1">
        {CHOICES.map(({ persona, title, description, to, icon: Icon, iconBoxClassName }) => (
          <Card key={persona}>
            <CardContent className="flex h-full flex-col gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-md",
                  iconBoxClassName,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm text-text-heading">{title}</p>
                <p className="mt-1 text-body-sm text-text-muted">{description}</p>
              </div>
              <Button
                className="self-start"
                onClick={() => {
                  setPersona(persona);
                  navigate(to);
                }}
              >
                {title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
