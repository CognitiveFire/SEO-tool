"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CheckSquare2, Upload, WandSparkles } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils/cn";

const navigationItems = [
  { href: "/", label: "Overview", icon: WandSparkles },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/tasks", label: "Tasks", icon: CheckSquare2 },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 border-r border-[color:var(--border)] bg-[color:var(--sidebar)] px-6 py-8 lg:flex lg:flex-col">
      <div className="mb-10">
        <Logo className="h-auto w-[192px] text-[color:var(--foreground)]" variant="full" />
      </div>

      <nav className="space-y-1.5">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-200",
                isActive
                  ? "border-l-2 border-[color:var(--accent)] bg-[color:var(--surface)] pl-[14px] text-[color:var(--foreground)] shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
                  : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]",
              )}
              href={item.href}
              key={item.href}
            >
          <Icon className={cn("size-4", isActive && "text-[color:var(--accent)]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">Operating model</p>
        <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]">
          Upload Screaming Frog exports, normalise the crawl, then work from clustered operational findings instead of raw issue counts.
        </p>
      </div>
    </aside>
  );
}
