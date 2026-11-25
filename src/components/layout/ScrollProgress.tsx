import { m, useScroll, useSpring } from 'framer-motion';

/** Thin gold bar across the top of the page that fills as the visitor scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-light via-gold to-gold-dark rtl:origin-right" />);

}
