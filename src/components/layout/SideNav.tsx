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
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "groups", label: "Mentors", href: "/mentors" },
  { icon: "library_books", label: "Resources", href: "/resources" },
  { icon: "psychology_alt", label: "AI Coach", href: "/ai-coach" },
  { icon: "forum", label: "Community", href: "/community" },
  { icon: "emoji_events", label: "Win Board", href: "/community/win-board" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // For /community, only match exact path to avoid overlap with /community/win-board
  if (href === "/community") return pathname === "/community";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="bg-[#F4F4F4] dark:bg-gray-900 h-screen w-64 border-r border-[#E0E0E0] dark:border-gray-800 hidden lg:flex flex-col sticky left-0 top-0 py-8 z-40 shrink-0"
    >
      <div className="px-6 mb-8">
        <span className="text-lg font-bold text-[#8C1D40]">FirstBridge</span>
        <p className="text-sm font-medium text-gray-600">
          Student Success Suite
        </p>
      </div>

      <ul className="flex flex-col flex-1 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium ease-in-out duration-200 cursor-pointer ${
                  active
                    ? "bg-white dark:bg-gray-800 text-[#8C1D40] dark:text-[#FFC627] font-bold border-r-4 border-[#8C1D40]"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#8C1D40] hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  name={item.icon}
                  filled={active}
                  className="mr-4"
                  size={24}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
