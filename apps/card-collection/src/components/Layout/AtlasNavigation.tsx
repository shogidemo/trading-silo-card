"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const items = [
  { href: "/map", label: "探す", icon: "⌖" },
  { href: "/quiz", label: "学ぶ", icon: "◒" },
  { href: "/collection", label: "図鑑", icon: "▥" },
];

export default function AtlasNavigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => (nav.closest(".atlas-shell") as HTMLElement | null)?.style.setProperty("--atlas-nav-height", `${Math.ceil(nav.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    measure();
    return () => observer.disconnect();
  }, []);
  return <nav ref={navRef} className="atlas-navigation" aria-label="主な画面">{items.map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>
    <span aria-hidden="true">{item.icon}</span><span>{item.label}</span>
  </Link>)}</nav>;
}
