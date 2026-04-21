import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <OfflineBanner />
      <main className="mx-auto w-full max-w-screen-md flex-1 px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
