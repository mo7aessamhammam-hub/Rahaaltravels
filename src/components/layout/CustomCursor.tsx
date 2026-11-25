import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], [role="option"], [role="tab"], label, summary, select';
const TEXT_FIELD = 'input, textarea, [contenteditable="true"]';

/**
 * Branded cursor for mouse users: a gold dot that tracks the pointer exactly and a ring that
 * glides after it, growing over clickable things. Not rendered on touch devices or with reduced motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const setState = (el: Element | null) => {
      const overText = !!el?.closest(TEXT_FIELD);
      const overLink = !overText && !!el?.closest(INTERACTIVE);
      ring.dataset.state = overText ? 'text' : overLink ? 'link' : 'idle';
      dot.dataset.state = ring.dataset.state;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      setState(e.target as Element);
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onDown = () => ring.classList.add('is-pressed');
    const onUp = () => ring.classList.remove('is-pressed');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" data-state="idle" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" data-state="idle" />
    </>);

}
