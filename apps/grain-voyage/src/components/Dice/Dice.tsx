"use client";

import { useState, useCallback } from "react";

interface DiceProps {
  onRoll?: (value: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

// Dice dot patterns
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

// Size configuration
const sizeConfig = {
  sm: { box: 64, dot: 10 },
  md: { box: 80, dot: 12 },
  lg: { box: 96, dot: 14 },
};

export default function Dice({ onRoll, disabled = false, size = "md" }: DiceProps) {
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);

  const { box, dot } = sizeConfig[size];

  const roll = useCallback(() => {
    if (disabled || isRolling) return;

    setIsRolling(true);

    const rollDuration = 600;
    const intervalTime = 60;
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
      {/* Dice */}
      <button
        onClick={roll}
        disabled={disabled || isRolling}
        className={`
          dice-game relative
          ${isRolling ? "dice-rolling" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        style={{ width: box, height: box }}
        aria-label={`サイコロ（現在の目: ${value}）`}
      >
        {dotPatterns[value].map(([x, y], index) => (
          <div
            key={index}
            className="dice-dot absolute"
            style={{
              width: dot,
              height: dot,
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </button>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={disabled || isRolling}
        className={`
          btn-game font-display text-game-body
          ${disabled || isRolling ? "btn-game-secondary opacity-50" : "btn-game-gold"}
        `}
      >
        {isRolling ? "振ってます..." : "サイコロを振る"}
      </button>

      {/* Result display */}
      {!isRolling && (
        <div className="game-panel-highlight px-4 py-2 text-center">
          <span className="text-game-small text-retro-navy">出目:</span>
          <span className="ml-2 text-game-title text-retro-navy">{value}</span>
          <span className="ml-1 text-game-small text-retro-navy">マス</span>
        </div>
      )}
    </div>
  );
}
