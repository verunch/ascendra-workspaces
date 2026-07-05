import type { ReactNode } from "react";
import { Sidebar, type SidebarNavItem } from "@/components/shared/Sidebar";
import { TopHeader } from "@/components/shared/TopHeader";

export interface AppLayoutProps {
  tone: "light" | "dark";
  brandLabel: string;
  brandSublabel: string;
  navItems: SidebarNavItem[];
  sidebarWidthClassName: string;
  children: ReactNode;
}

/**
 * Shared shell chassis reused by DeveloperShell and AdminShell — only the
 * nav config and tone differ between the two (docs/architecture.md §6).
 * Presentational only; no router dependency of its own.
 */
export function AppLayout({
  tone,
  brandLabel,
  brandSublabel,
  navItems,
  sidebarWidthClassName,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        tone={tone}
        brandLabel={brandLabel}
        brandSublabel={brandSublabel}
        items={navItems}
        widthClassName={sidebarWidthClassName}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader tone={tone} />
        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
