"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiceProps {
  onRoll?: (value: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

// サイコロの目の配置パターン
const dotPatterns: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 25],
    [75, 25],
    [25, 50],
    [75, 50],
    [25, 75],
    [75, 75],
  ],
};

// サイズ設定
const sizeConfig = {
  sm: { box: 60, dot: 8 },
  md: { box: 80, dot: 10 },
  lg: { box: 100, dot: 12 },
};

export default function Dice({ onRoll, disabled = false, size = "md" }: DiceProps) {
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);

  const { box, dot } = sizeConfig[size];

  const roll = useCallback(() => {
    if (disabled || isRolling) return;

    setIsRolling(true);

    // ランダムな中間値を表示してから最終値を決定
    const rollDuration = 800;
    const intervalTime = 80;
    let elapsed = 0;

    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      elapsed += intervalTime;

      if (elapsed >= rollDuration) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
        onRoll?.(finalValue);
      }
    }, intervalTime);
  }, [disabled, isRolling, onRoll]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={roll}
        disabled={disabled || isRolling}
        className={`
          relative rounded-xl bg-white shadow-lg border-2 border-navy-200
          transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-ocean-400"}
        `}
        style={{ width: box, height: box }}
        animate={
          isRolling
            ? {
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 1, 1.1, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={
          isRolling
            ? { duration: 0.4, repeat: 2, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        whileHover={!disabled && !isRolling ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.95 } : {}}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="absolute inset-0"
          >
            {dotPatterns[value].map(([x, y], index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-navy-800"
                style={{
                  width: dot,
                  height: dot,
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* ロールボタン */}
      <motion.button
        onClick={roll}
        disabled={disabled || isRolling}
        className={`
          px-6 py-2 rounded-lg font-display text-white
          transition-colors
          ${
            disabled || isRolling
              ? "bg-navy-300 cursor-not-allowed"
              : "bg-ocean-600 hover:bg-ocean-700"
          }
        `}
        whileHover={!disabled && !isRolling ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.98 } : {}}
      >
        {isRolling ? "振っています..." : "サイコロを振る"}
      </motion.button>

      {/* 結果表示 */}
      {!isRolling && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-sm text-navy-500">出目:</span>
          <span className="ml-2 text-2xl font-display text-navy-900">{value}</span>
          <span className="ml-1 text-navy-600">マス進める</span>
        </motion.div>
      )}
    </div>
  );
}
