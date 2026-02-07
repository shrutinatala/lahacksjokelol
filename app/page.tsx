"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

const FALL_ASLEEP_LINK =
  "https://youtu.be/J55xnFE0Ibo?list=RDJ55xnFE0Ibo&t=91";

function fireConfettiAt(clientX: number, clientY: number) {
  const x = clientX / window.innerWidth;
  const y = clientY / window.innerHeight;
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x, y },
  });
}

function fireCelebrationConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 50, y: 50 }); // default: center

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return pos;
}

export default function Home() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [centerIsBlue, setCenterIsBlue] = useState(true);
  const mousePos = useMousePosition();

  const handleReveal = useCallback(() => {
    setHasRevealed(true);
    fireCelebrationConfetti();
  }, []);

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setCenterIsBlue((prev) => !prev);
      if (hasRevealed) {
        e.preventDefault();
        fireConfettiAt(e.clientX, e.clientY);
      }
    },
    [hasRevealed]
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 cursor-pointer select-none text-white relative"
      style={
        hasRevealed
          ? { background: "#000" }
          : {
              background: centerIsBlue
                ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #2774AE 0%, #990000 70%)`
                : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #990000 0%, #2774AE 70%)`,
              transition: "background 0.1s ease-out",
            }
      }
      onClick={handlePageClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (hasRevealed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          fireConfettiAt(window.innerWidth / 2, window.innerHeight / 2);
        }
      }}
      aria-label={hasRevealed ? "Click anywhere for confetti" : undefined}
    >
      {hasRevealed && (
        <img
          src="/yawning%20dog.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill opacity-60 pointer-events-none"
          aria-hidden
        />
      )}
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl relative z-10">
        {!hasRevealed ? (
          <>
            <p className="text-xl sm:text-2xl font-medium text-white/95 drop-shadow-sm">
              Click to find out if you&apos;re a Bruin or a Trojan
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReveal();
              }}
              className="px-10 py-5 text-xl font-bold rounded-2xl bg-[#FFD700] text-[#1a1a1a] hover:bg-[#FFE44D] active:scale-[0.98] transition-all shadow-lg hover:shadow-yellow-400/40"
            >
              Find out
            </button>
          </>
        ) : (
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFD700] drop-shadow-md">
            You are tired!
          </h1>
        )}
      </main>

      {hasRevealed && (
        <a
          href={FALL_ASLEEP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-3 right-3 px-2 py-1.5 text-[10px] font-medium rounded bg-[#1db954] text-white hover:bg-[#1ed760] active:scale-[0.98] transition-all z-10"
        >
          Fall Asleep Instantly
        </a>
      )}
    </div>
  );
}
