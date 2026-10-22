# popkit

An unstyled floating panel for React that opens under its trigger: dropdowns,
pickers, small menus.

- Click the trigger to toggle; click outside or press Escape to close.
- Escape hands focus back to the trigger.
- No animation: the panel appears and disappears instantly. Closed, it's
  `display: none`: not clickable, not focusable, not read by screen readers.
- Sets `aria-expanded`, `aria-controls` and `aria-haspopup` for you.
- No styles beyond placement. Size, colours and spacing are yours.

## Install

```bash
npm install github:flatband/popkit
```

It compiles itself on install (the `prepare` script builds `src/` into
`dist/`), so no bundler config is needed. `react` is a peer dependency: the
app's own copy is used.

## How to use

```tsx
"use client";
import { Popover } from "popkit";

<Popover
  align="end"
  role="menu"
  className="mt-2 w-64 border bg-white p-1 shadow-lg"
  trigger={({ props }) => <button {...props}>Theme</button>}
>
  {({ close }) => (
    <>
      <button role="menuitem" onClick={close}>Light</button>
      <button role="menuitem" onClick={close}>Dark</button>
    </>
  )}
</Popover>
```

`trigger` renders the opener. Spread `props` onto it: it carries the click
handler and the aria attributes. Use your own button component if you like,
as long as it passes those through to the real `<button>`. `open` is passed
alongside `props` if the trigger should look different while open.

`children` is the panel's content: plain JSX, or a function that receives
`close` for lists where picking something should dismiss the panel.

## Props

| Prop | Default | |
|---|---|---|
| `trigger` | — | `({ open, props }) => ReactNode`. Required. |
| `children` | — | Content, or `({ close }) => ReactNode`. |
| `align` | `"start"` | Line the panel up with the trigger's left (`"start"`) or right (`"end"`) edge. |
| `role` | none | `"menu"`, `"listbox"` or `"dialog"`. Also sets the trigger's `aria-haspopup`. |
| `className` | none | Classes for the panel. |

## Versioning

The version bumps itself: a pre-commit hook in `.githooks/` runs
`npm version patch` on every commit. `npm install` in this folder switches the
hook on (through the `prepare` script).
