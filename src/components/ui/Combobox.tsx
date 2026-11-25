import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { EASE_OUT } from '../../utils/motion';

type ComboboxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  /** Open the menu above the field, e.g. when the container clips overflow below. */
  placement?: 'top' | 'bottom';
  emptyText?: string;
};

const normalize = (s: string) =>
s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();

/** Free-text input with a styled, filterable suggestion list (combobox pattern). */
export function Combobox({ id, value, onChange, suggestions, placeholder, placement = 'bottom', emptyText }: ComboboxProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    const q = normalize(filter);
    const unique = Array.from(new Set(suggestions));
    return q ? unique.filter((s) => normalize(s).includes(q)) : unique;
  }, [filter, suggestions]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const show = (nextFilter: string) => {
    setFilter(nextFilter);
    setActive(-1);
    setOpen(true);
  };

  const choose = (s: string) => {
    onChange(s);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) return show('');
        setActive((i) => Math.min(items.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) setActive((i) => Math.max(0, i - 1));
        break;
      case 'Enter':
        // Pick the highlighted suggestion; otherwise let the form submit as usual.
        if (open && active >= 0 && items[active]) {
          e.preventDefault();
          choose(items[active]);
        } else {
          setOpen(false);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${uid}-opt-${active}` : undefined}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          show(e.target.value);
        }}
        onFocus={() => show('')}
        onClick={() => !open && show('')}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent text-[15px] font-semibold text-ink placeholder:text-ink/40 focus:outline-none" />

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => open ? setOpen(false) : (inputRef.current?.focus(), show(''))}
        className="shrink-0 text-ink/40">

        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (items.length > 0 || emptyText) &&
        <m.ul
          id={listId}
          role="listbox"
          data-lenis-prevent
          initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
          className={`absolute -start-2 z-50 max-h-72 w-[calc(100%+1rem)] min-w-[220px] overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-ink/10 ${
          placement === 'top' ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}`}>

            {items.length === 0 ?
          <li className="px-4 py-2.5 text-sm text-ink/50">{emptyText}</li> :

          items.map((s, i) =>
          <li
            key={s}
            id={`${uid}-opt-${i}`}
            role="option"
            aria-selected={s === value}
            onPointerEnter={() => setActive(i)}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => choose(s)}
            className={`cursor-pointer rounded-xl px-4 py-2.5 text-[15px] transition-colors duration-150 ${
            i === active ? 'bg-primary/10 text-primary-dark' : 'text-ink/80'} ${
            s === value ? 'font-bold' : 'font-medium'}`}>

                  {s}
                </li>
          )}
          </m.ul>
        }
      </AnimatePresence>
    </div>);

}
