import { Link } from "@tanstack/react-router";
import { Home, PlusCircle, MessageSquare, LayoutGrid, Heart } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/saved", label: "Saved", Icon: Heart },
  { to: "/sell", label: "Sell", Icon: PlusCircle },
  { to: "/inbox", label: "Inbox", Icon: MessageSquare },
  { to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-40 border-t border-border bg-card"
    >
      <ul className="mx-auto flex max-w-screen-md items-center justify-around">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex min-h-12 min-w-12 flex-col items-center justify-center px-3 py-2 text-xs text-muted-foreground"
              activeProps={{ className: "flex min-h-12 min-w-12 flex-col items-center justify-center px-3 py-2 text-xs text-primary font-semibold" }}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="mt-0.5">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
