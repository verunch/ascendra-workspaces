import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Layers, Server } from "lucide-react";
import { AppLayout } from "./AppLayout";
import { usePersona } from "@/app/use-persona";
import type { SidebarNavItem } from "@/components/shared/Sidebar";

const NAV_ITEMS: SidebarNavItem[] = [
  { label: "Overview", to: "/admin/overview", icon: LayoutDashboard },
  { label: "VMs", to: "/admin/vms", icon: Server },
  { label: "Templates", to: "/admin/templates", icon: Layers },
];

export function AdminShell() {
  const { setPersona } = usePersona();

  // Keep the persona context truthful even when this shell is reached by
  // direct URL navigation rather than through the PersonaSwitcher.
  useEffect(() => {
    setPersona("admin");
  }, [setPersona]);

  return (
    <AppLayout
      tone="dark"
      brandLabel="Ascendra"
      brandSublabel="Admin"
      homeHref="/admin/overview"
      navItems={NAV_ITEMS}
      sidebarWidthClassName="w-sidebar-admin"
    >
      <Outlet />
    </AppLayout>
  );
}
