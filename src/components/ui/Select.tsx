import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { EASE_OUT } from '../../utils/motion';

export type SelectOption<T extends string> = {value: T;label: string;};

type SelectProps<T extends string> = {
  id?: string;
  value: T | '';
  onChange: (value: T | '') => void;
  options: SelectOption<T>[];
  placeholder: string;
  /** id of the visible <label> so screen readers announce it. */
  labelledBy?: string;
  className?: string;
  /** Open the menu above the field, e.g. when the container clips overflow below. */
  placement?: 'top' | 'bottom';
};

/** Styled, keyboard-accessible replacement for a native <select> (listbox pattern). */
export function Select<T extends string>({ id, value, onChange, options, placeholder, labelledBy, className = '', placement = 'bottom' }: SelectProps<T>) {
  const uid = useId();
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Index 0 is the "no selection" placeholder row.
  const rows: {value: T | '';label: string;}[] = [{ value: '', label: placeholder }, ...options];
  const selectedIndex = Math.max(0, rows.findIndex((r) => r.value === value));
  const selectedLabel = rows[selectedIndex].label;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(rows[i].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(rows.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(rows.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy ? `${labelledBy} ${id ?? ''}`.trim() : undefined}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        onClick={() => open ? setOpen(false) : openList()}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-2 bg-transparent text-start text-[15px] font-semibold focus:outline-none ${
        value ? 'text-ink' : 'text-ink/40'}`
        }>

        <span className="truncate">{selectedLabel}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-ink/40 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
          aria-hidden="true" />

      </button>

      <AnimatePresence>
        {open &&
        <m.ul
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
          className={`absolute -start-2 z-50 w-[calc(100%+1rem)] min-w-[200px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-ink/10 ${
          placement === 'top' ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}`}>

            {rows.map((row, i) => {
            const isSelected = i === selectedIndex;
            const isActive = i === active;
            return (
              <li
                key={row.value || 'placeholder'}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[15px] transition-colors duration-150 ${
                isActive ? 'bg-primary/10 text-primary-dark' : 'text-ink/80'} ${
                isSelected ? 'font-bold' : 'font-medium'} ${i === 0 ? 'text-ink/45' : ''}`}>

                  <span>{row.label}</span>
                  {isSelected && i !== 0 && <CheckIcon className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />}
                </li>);

          })}
          </m.ul>
        }
      </AnimatePresence>
    </div>);

}
