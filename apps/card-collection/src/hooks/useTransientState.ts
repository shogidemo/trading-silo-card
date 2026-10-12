"use client";

import { useEffect, useState } from "react";

// 表示状態だけをタブ内のメモリに保持する。収集保存や再読込後の記録には使わない。
const values = new Map<string, unknown>();
let historyNavigation = false;
export const isHistoryNavigation = () => historyNavigation;
export const getTransientValue = <T,>(key: string) => values.get(key) as T | undefined;
export const setTransientValue = <T,>(key: string, value: T) => { values.set(key, value); };
export const clearTransientState = () => values.clear();

export function UiNavigationMemory() {
  useEffect(() => {
    const back = () => { historyNavigation = true; };
    const link = (event: MouseEvent) => { if ((event.target as Element)?.closest?.("a[href]")) historyNavigation = false; };
    window.addEventListener("popstate", back);
    document.addEventListener("click", link, true);
    return () => { window.removeEventListener("popstate", back); document.removeEventListener("click", link, true); };
  }, []);
  return null;
}

export function useTransientState<T>(key: string, initial: T | (() => T), restoreCached = true) {
  const [value, setValue] = useState<T>(() => restoreCached && values.has(key) ? values.get(key) as T : typeof initial === "function" ? (initial as () => T)() : initial);
  useEffect(() => { values.set(key, value); }, [key, value]);
  return [value, setValue] as const;
}
