"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, BarChart2, Plus, Layers, Settings } from "lucide-react";

const NavItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 pt-1 ${
      active ? "text-[#477A71]" : "text-slate-400"
    }`}
  >
    <Icon className="size-6" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom,1rem)]">
      {/* Main flex container with grid for perfect alignment */}
      <div className="grid grid-cols-5 items-end px-4 pt-3 pb-4">
        {/* Home */}
        <NavItem
          icon={Home}
          label="Home"
          active={isActive("/")}
          onClick={() => navigateTo("/")}
        />

        {/* Analytics */}
        <NavItem
          icon={BarChart2}
          label="Analytics"
          active={isActive("/analytics")}
          onClick={() => navigateTo("/analytics")}
        />

        {/* Floating Action Button - centered in column 3 */}
        <div className="flex justify-center -mt-8 mb-2">
          <button
            onClick={() => navigateTo("/add")}
            className="rounded-full bg-[#477A71] p-4 text-white shadow-[0_8px_25px_rgba(71,122,113,0.4)] ring-4 ring-white"
          >
            <Plus className="size-7" strokeWidth={3} />
          </button>
        </div>

        {/* Categories */}
        <NavItem
          icon={Layers}
          label="Categories"
          active={isActive("/categories")}
          onClick={() => navigateTo("/categories")}
        />

        {/* Settings */}
        <NavItem
          icon={Settings}
          label="Settings"
          active={isActive("/settings")}
          onClick={() => navigateTo("/settings")}
        />
      </div>
    </nav>
  );
}
