"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Panel roles that the trigger can announce through aria-haspopup. */
export type PopoverRole = "menu" | "listbox" | "dialog";

/** Spread these onto whatever element opens the popover. */
export type PopoverTriggerProps = {
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-haspopup"?: PopoverRole;
};

export type PopoverProps = {
  /** Renders the opener. Spread `props` onto it so it toggles and is announced correctly. */
  trigger: (state: { open: boolean; props: PopoverTriggerProps }) => ReactNode;
  /** The panel's content, or a function that gets `close` for "pick and dismiss" lists. */
  children: ReactNode | ((state: { close: () => void }) => ReactNode);
  /** Which edge of the trigger the panel lines up with. */
  align?: "start" | "end";
  role?: PopoverRole;
  /** Classes for the panel: size, spacing, colours. Positioning is handled here. */
  className?: string;
};

/**
 * A floating panel anchored under a trigger. Click the trigger to toggle it;
 * a click anywhere outside or Escape closes it, and Escape hands focus back
 * to the trigger.
 *
 * Unstyled apart from placement, and not animated: the panel simply appears
 * and disappears. Closed, it's `display: none` — so it can't be clicked,
 * tabbed into, or read by a screen reader.
 */
export default function Popover({
  trigger,
  children,
  align = "start",
  role,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Found by its aria-controls, so the trigger never has to forward a ref.
      root.current?.querySelector<HTMLElement>(`[aria-controls="${id}"]`)?.focus();
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, id]);

  const panel: CSSProperties = {
    position: "absolute",
    top: "100%",
    [align === "end" ? "right" : "left"]: 0,
    zIndex: 50,
    // Inline, so a display class on the panel (flex, grid) can't override it
    // while closed. Open, the class's display applies as usual.
    display: open ? undefined : "none",
  };

  return (
    <div ref={root} style={{ position: "relative" }}>
      {trigger({
        open,
        props: {
          onClick: () => setOpen((o) => !o),
          "aria-expanded": open,
          "aria-controls": id,
          "aria-haspopup": role,
        },
      })}

      <div id={id} role={role} className={className} style={panel}>
        {typeof children === "function" ? children({ close }) : children}
      </div>
    </div>
  );
}
