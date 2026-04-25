"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/common/Icon";

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: "home", label: "Home", href: "/" },
  { icon: "handshake", label: "Mentors", href: "/mentors" },
  { icon: "menu_book", label: "Library", href: "/resources" },
  { icon: "smart_toy", label: "Coach", href: "/ai-coach" },
  { icon: "workspace_premium", label: "Wins", href: "/community/win-board" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white dark:bg-gray-950 z-50 rounded-t-lg border-t border-[#E0E0E0] dark:border-gray-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg touch-manipulation transition-transform ${
              active
                ? "text-[#8C1D40] dark:text-[#FFC627] scale-110"
                : "text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={item.icon} filled={active} className="mb-1" size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
