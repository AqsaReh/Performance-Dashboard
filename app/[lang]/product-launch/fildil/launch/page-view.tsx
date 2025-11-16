"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useMediaQuery } from "@/hooks/use-media-query";

type TabKey = "FILDIL" | "FILDIL 10MG" | "FILDIL 20MG" | "FILDIL 5MG" | "FILDIL 2.5MG";

const tabData: Record<
  TabKey,
  { saleQty: number; saleValue: number; ucc: number }
> = {
  FILDIL: {
    ucc: 28044,
    saleQty: 84963,
    saleValue: 52195576,
  },
  "FILDIL 20MG": {
    ucc: 13379,
    saleQty: 25891,
    saleValue: 21284473,
  },
  "FILDIL 10MG": {
    ucc: 25583,
    saleQty: 48901,
    saleValue: 28714667,
  },
  "FILDIL 5MG": {
    ucc: 3156,
    saleQty: 5178,
    saleValue: 1297296,
  },
  "FILDIL 2.5MG": {
    ucc: 3059,
    saleQty: 4993,
    saleValue: 899139,
  },
};

const LaunchPageView = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("FILDIL");

  const [animatedSale, setAnimatedSale] = useState(0);
  const [animatedUcc, setAnimatedUcc] = useState(0);

  const saleRef = useRef<number | null>(null);
  const uccRef = useRef<number | null>(null);

  const animateCounter = (
    end: number,
    duration: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    ref: React.MutableRefObject<number | null>
  ) => {
    let start: number | null = null;
    const fastRatio = 0.3;
    const fastTarget = Math.floor(end * 0.7);

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      let currentValue;
      if (elapsed < duration * fastRatio) {
        const progress = elapsed / (duration * fastRatio);
        currentValue = Math.floor(progress * fastTarget);
      } else {
        const slowElapsed = elapsed - duration * fastRatio;
        const slowProgress = slowElapsed / (duration * (1 - fastRatio));
        currentValue = Math.floor(
          fastTarget + (end - fastTarget) * slowProgress
        );
      }

      setter(currentValue >= end ? end : currentValue);

      if (elapsed < duration) {
        ref.current = requestAnimationFrame(step);
      } else {
        setter(end);

        if (ref === saleRef) {
          celebrate(); // 🎉 trigger only once when main sale value ends
        }
      }
    };

    cancelAnimationFrame(ref.current!);
    setter(0);
    ref.current = requestAnimationFrame(step);
  };

  const ANIMATION_DURATION = 10000; // ← set total time in ms here

  useEffect(() => {
    // Stop previous confetti if tab switches
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }

    const timeout = setTimeout(() => {
      const { saleValue, ucc } = tabData[activeTab];
      animateCounter(saleValue, ANIMATION_DURATION, setAnimatedSale, saleRef);
      animateCounter(ucc, ANIMATION_DURATION, setAnimatedUcc, uccRef);
    }, 300); // 🔄 delay animation start (300ms)

    return () => clearTimeout(timeout); // cleanup if tab switches fast
  }, [activeTab]);

  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const celebrate = () => {
    // Center confetti once (3s)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    // Left + Right confetti every 500ms for 10s
    const duration = 10000;
    const interval = 500;
    const end = Date.now() + duration;

    const intervalId = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(intervalId);
        return;
      }

      confetti({
        particleCount: 20,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
      });

      confetti({
        particleCount: 20,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
      });
    }, interval);

    confettiIntervalRef.current = intervalId;
  };

  useEffect(() => {
    return () => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }

      cancelAnimationFrame(saleRef.current!);
      cancelAnimationFrame(uccRef.current!);
    };
  }, []);

  const isMobile = useMediaQuery("(max-width: 480px)");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden">
      {/* Glow and Blur Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-primary-300 opacity-20 blur-[160px] rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[400px] h-[400px] bg-primary-400 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      <Image
        src="/images/launch/fildil/logo.webp"
        alt="Fildil Logo"
        width={120}
        height={100}
        className="mb-6 drop-shadow-md absolute top-6 sm:top-10 left-4 sm:left-10"
      />

      <div className="bg-gradient-to-tl from-primary/10 via-primary/20 to-primary/40 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8 sm:p-12 md:p-16 sm:mt-16 md:mt-0 w-full max-w-6xl">
        {/* Tabs */}

        <div className="flex justify-center">
          <div className="inline-flex gap-1 mb-8 sm:mb-16 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 backdrop-blur-sm px-4 sm:px-16 py-2 rounded-full border border-white/20 shadow-md max-w-full">
            {Object.keys(tabData).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabKey)}
                  className={`px-2.5 sm:px-8 py-2 text-xs sm:text-base font-semibold rounded-full transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
                        : "text-foreground hover:bg-white/10"
                    }`}
                >
                  {isMobile ? tab.split(" ").length > 1 ? tab.split(" ")[1] : tab : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex justify-around flex-col sm:flex-row items-center gap-6">
          {/* Sale Value */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 border-[8px] relative border-primary-500 rounded-full flex items-center justify-center bg-white/70">
              <p className="text-sm sm:text-xl md:text-2xl absolute top-1/4 font-medium text-foreground mb-4">
                Sale Value
              </p>
              <div className="text-center leading-tight">
                <p className="text-lg sm:text-2xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {animatedSale.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* UCC */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 relative border-[8px] border-primary-500 rounded-full flex items-center justify-center bg-white/70">
              <p className="text-sm sm:text-xl md:text-2xl absolute top-1/4  font-medium text-foreground mb-4">
                UCC
              </p>
              <div className="text-center leading-tight">
                <p className="text-lg sm:text-2xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {animatedUcc.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Image
        src="/images/launch/fildil/company_logo.webp"
        alt="Highnoon"
        width={120}
        height={50}
        className="absolute bottom-10 right-10"
      />
    </div>
  );
};

export default LaunchPageView;
