import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { DeveloperShell } from "@/layouts/DeveloperShell";
import { AdminShell } from "@/layouts/AdminShell";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

// Route-level code splitting: MachinesPage pulls in recharts, which is
// large enough to push the single-bundle size past Vite's warning
// threshold. Splitting per-route keeps the initial load light and only
// downloads chart code when a chart-bearing screen is actually visited.
const EntryPage = lazy(() =>
  import("@/routes/entry/EntryPage").then((m) => ({ default: m.EntryPage })),
);
const MachinesPage = lazy(() =>
  import("@/routes/developer/MachinesPage").then((m) => ({ default: m.MachinesPage })),
);
const MachineDetailPage = lazy(() =>
  import("@/routes/developer/MachineDetailPage").then((m) => ({ default: m.MachineDetailPage })),
);
const OverviewPage = lazy(() =>
  import("@/routes/admin/OverviewPage").then((m) => ({ default: m.OverviewPage })),
);
const InventoryPage = lazy(() =>
  import("@/routes/admin/InventoryPage").then((m) => ({ default: m.InventoryPage })),
);
const TemplatesPage = lazy(() =>
  import("@/routes/admin/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <LoadingSkeleton className="w-full max-w-sm" rows={3} />
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

/** Route table matches docs/architecture.md §5 exactly. */
const router = createBrowserRouter([
  { path: "/", element: withSuspense(<EntryPage />) },
  {
    path: "/app",
    element: <DeveloperShell />,
    children: [
      { index: true, element: <Navigate to="machines" replace /> },
      { path: "machines", element: withSuspense(<MachinesPage />) },
      { path: "machines/:id", element: withSuspense(<MachineDetailPage />) },
    ],
  },
  {
    path: "/admin",
    element: <AdminShell />,
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: withSuspense(<OverviewPage />) },
      { path: "vms", element: withSuspense(<InventoryPage />) },
      { path: "templates", element: withSuspense(<TemplatesPage />) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
