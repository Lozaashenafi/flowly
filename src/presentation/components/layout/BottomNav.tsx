"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // Using Link is better for performance/SEO
import { Home, BarChart2, Plus, Layers, Settings } from "lucide-react";

const NavItem = ({
  icon: Icon,
  label,
  active = false,
  href,
}: {
  icon: any;
  label: string;
  active?: boolean;
  href: string;
}) => (
  <Link
    href={href}
    className={`flex flex-col items-center gap-1 pt-1 transition-colors ${
      active
        ? "text-[#477A71]"
        : "text-slate-400 dark:text-slate-500 hover:text-[#477A71]/70"
    }`}
  >
    <Icon className="size-6" />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export function BottomNav() {
  const pathname = usePathname();

  // Improved matching logic:
  // 1. Check if it's the exact home path
  // 2. Check if the current pathname starts with the target path (for sub-routes)
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 pb-[env(safe-area-inset-bottom,1rem)] transition-colors duration-300">
      <div className="grid grid-cols-5 items-end px-4 pt-3 pb-4">
        {/* Home */}
        <NavItem icon={Home} label="Home" active={isActive("/")} href="/" />

        {/* Analytics */}
        <NavItem
          icon={BarChart2}
          label="Analytics"
          active={isActive("/analytics")}
          href="/analytics"
        />

        {/* Floating Action Button */}
        <div className="flex justify-center -mt-8 mb-2">
          <Link
            href="/add"
            className={`rounded-full p-4 text-white ring-4 ring-white dark:ring-slate-900 transition-all ${
              isActive("/add") ? "bg-[#3a635c]" : "bg-[#477A71]"
            }`}
          >
            <Plus className="size-7" strokeWidth={3} />
          </Link>
        </div>

        {/* Categories */}
        <NavItem
          icon={Layers}
          label="Categories"
          active={isActive("/categories")}
          href="/categories"
        />

        {/* Settings */}
        <NavItem
          icon={Settings}
          label="Settings"
          active={isActive("/settings")}
          href="/settings"
        />
      </div>
    </nav>
  );
}
