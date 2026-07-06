import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Monitor } from "lucide-react";
import { AppLayout } from "./AppLayout";
import { usePersona } from "@/app/use-persona";
import type { SidebarNavItem } from "@/components/shared/Sidebar";

const NAV_ITEMS: SidebarNavItem[] = [{ label: "Machines", to: "/app/machines", icon: Monitor }];

export function DeveloperShell() {
  const { setPersona } = usePersona();

  // Keep the persona context truthful even when this shell is reached by
  // direct URL navigation rather than through the PersonaSwitcher.
  useEffect(() => {
    setPersona("developer");
  }, [setPersona]);

  return (
    <AppLayout
      tone="light"
      brandLabel="Ascendra"
      brandSublabel="Workspaces"
      homeHref="/app/machines"
      navItems={NAV_ITEMS}
      sidebarWidthClassName="w-sidebar-dev"
    >
      <Outlet />
    </AppLayout>
  );
}
