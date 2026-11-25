import Lenis from 'lenis';

/** Single Lenis instance driving inertia ("buttery") wheel scrolling. Null when disabled (reduced motion). */
let lenis: Lenis | null = null;
const noop = () => undefined;

export function getLenis(): Lenis | null {
  return lenis;
}

export function startSmoothScroll(): () => void {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;
  lenis = new Lenis({
    autoRaf: true,
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    // Native touch scrolling stays as-is on phones; only wheel/trackpad gets smoothed.
    syncTouch: false
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}
