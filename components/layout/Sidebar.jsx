"use client";

import {
  Home,
  Rocket,
  BarChart3,
  Clock,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavItem from "./NavItem.jsx";
import { api, clearAuth } from "../../lib/api";

const NAV_ITEMS = [
  { href: "/Dashboard/home", icon: Home, label: "Home" },
  { href: "/Dashboard/missions", icon: Rocket, label: "Missions" },
  { href: "/Dashboard/assessment", icon: BarChart3, label: "Assessment" },
  { href: "/Dashboard/progress", icon: Clock, label: "Progress" },
  { href: "/Dashboard/opportunities", icon: Briefcase, label: "Opportunity" },
];

export default function Sidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await api.logout();
    } catch {
    } finally {
      clearAuth();
      sessionStorage.clear();
      router.replace("/login");
    }
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#072540] px-5 py-8">
      <div className="mb-12 flex items-center gap-2 px-2">
        <Image
          src="/images/vuka_logo.png"
          alt="Vuka Logo"
          width={145}
          height={71}
          priority
        />
      </div>

      <nav className="flex flex-1 flex-col gap-3" aria-label="Primary">
        {NAV_ITEMS.map((item, index) => (
          <NavItem
            key={item.href || index}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-6">
        <NavItem href="/settings" icon={Settings} label="Settings" />
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Sign out"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <LogOut size={22} strokeWidth={2} aria-hidden="true" />
          </span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
