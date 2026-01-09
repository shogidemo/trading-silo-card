"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  {
    href: "/",
    label: "ホーム",
    labelEn: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: "/quiz",
    label: "クイズ",
    labelEn: "Quiz",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    href: "/collection",
    label: "コレクション",
    labelEn: "Collection",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* 上部の装飾ライン */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="bg-concrete-50/95 backdrop-blur-md border-t border-concrete-200">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className="relative flex flex-col items-center py-3 px-2 group"
                  >
                    {/* アクティブインジケーター */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gold-500"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* アイコン */}
                    <motion.div
                      className={`mb-1 transition-colors ${
                        isActive
                          ? "text-gold-600"
                          : "text-concrete-500 group-hover:text-concrete-700"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon}
                    </motion.div>

                    {/* ラベル */}
                    <span
                      className={`text-[10px] tracking-wider uppercase transition-colors ${
                        isActive
                          ? "text-gold-700 font-semibold"
                          : "text-concrete-500 group-hover:text-concrete-700"
                      }`}
                    >
                      {item.labelEn}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* iPhone セーフエリア対応 */}
      <div className="bg-concrete-50/95 backdrop-blur-md h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
