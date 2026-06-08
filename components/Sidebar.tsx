"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Keyboard, LayoutDashboard, BookOpen } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Metode 1: PDF",
      href: "/",
      icon: FileText,
      description: "Ekstraksi otomatis dari KHS",
    },
    {
      name: "Metode 2: Manual",
      href: "/manual",
      icon: Keyboard,
      description: "Input nilai dan SKS manual",
    },
    {
      name: "Guide Aturan",
      href: "/guide",
      icon: BookOpen,
      description: "Dokumentasi lengkap algoritma SPK",
    },
  ];

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-white font-semibold">
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          <span>SPK Lulus Tepat Waktu</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">Sistem Pendukung Keputusan Profile Matching</p>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col px-3 py-3 rounded-lg transition-colors border",
                isActive 
                  ? "bg-zinc-900 border-zinc-700 text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-zinc-500")} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-xs text-zinc-500 mt-1 pl-7">{item.description}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
