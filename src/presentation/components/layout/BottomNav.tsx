import { Home, BarChart2, Plus, Layers, Settings } from "lucide-react";

const NavItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex flex-col items-center gap-1 ${
      active ? "text-[#477A71]" : "text-slate-400"
    }`}
  >
    <Icon size={22} />
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
      <NavItem icon={Home} label="Home" active />
      <NavItem icon={BarChart2} label="Analytics" />

      {/* Floating Action Button */}
      <div className="relative -top-8">
        <button className="rounded-full border-4 border-white bg-[#477A71] p-4 text-white shadow-[0_8px_20px_rgba(71,122,113,0.4)]">
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      <NavItem icon={Layers} label="Categories" />
      <NavItem icon={Settings} label="Settings" />
    </nav>
  );
}
