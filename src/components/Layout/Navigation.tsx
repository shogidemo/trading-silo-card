"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/quiz", label: "クイズ", icon: "❓" },
  { href: "/collection", label: "コレクション", icon: "📚" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-6 transition-colors ${
                    isActive
                      ? "text-leaf-600"
                      : "text-earth-500 hover:text-earth-700"
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span
                    className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
