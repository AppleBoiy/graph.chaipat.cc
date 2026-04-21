'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const CustomSun = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

const CustomMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <circle cx="12" cy="12" r="9" strokeOpacity="0.1" strokeDasharray="2 2" />
  </svg>
);

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  const toggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      const transition = document.startViewTransition(async () => {
        setIsDark((prev) => !prev);
      });

      transition.ready.then(() => {
        const clipPath = ['inset(100% 0 0 0)', 'inset(0 0 0 0)'];
        document.documentElement.animate(
          { clipPath: isDark ? [...clipPath].reverse() : clipPath },
          { 
            duration: 1200, 
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
          }
        );
      });
    } else {
      setIsDark((prev) => !prev);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsToggling(false);
  };

  if (!mounted) return <div className="w-6 h-6" />;

  return (
    <>
      <button
        onClick={toggle}
        className="group flex p-[3px] items-center justify-center hover:bg-foreground/10 rounded transition-colors w-10 h-10 outline-none relative"
      >
        {isDark ? (
          <CustomMoon className="h-5 w-5 text-foreground/80 group-hover:text-foreground transition-colors" />
        ) : (
          <CustomSun className="h-5 w-5 text-foreground/80 group-hover:text-foreground transition-colors" />
        )}
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isToggling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xl bg-background/40"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 8, rotate: 0, opacity: 1 }}
                exit={{ scale: 16, opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {isDark ? (
                  <CustomMoon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                ) : (
                  <CustomSun className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
