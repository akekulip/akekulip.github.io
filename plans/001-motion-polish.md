# Motion polish — easing tokens, press feedback, mobile-nav entrance

Commit at audit time: 07b5290. Findings from an `improve-animations` audit of
`style.css` / `script.js`; all verified at their locations.

## Changes

1. **Easing token** (`style.css` `:root`): add
   `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`
   Replace bare `ease` with `var(--ease-out)` in `.btn`, `.proj-card`,
   `.menu-toggle span`, `.copy-btn` (if transitioned), and `wire-draw`'s
   `ease-out`.

2. **Card glow transition** (`.proj-card`): transition list becomes
   `border-color 150ms var(--ease-out), transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out)`
   so the hover glow eases with the lift instead of snapping.

3. **Button press feedback**: `.btn:active { transform: translateY(0) scale(0.97); }`
   with the 150ms transition above. Subtle (0.97), no bounce.

4. **Mobile nav entrance** (`.nav.open` under 860px): add
   `animation: nav-in 180ms var(--ease-out);`
   `@keyframes nav-in { from { opacity: 0; transform: translateY(-6px); } }`
   Global reduced-motion rule already truncates it.

5. **Skip link** (`.skip-link`): replace `top` animation with
   `transform: translateY(-120%)` at rest, `translateY(0)` on focus,
   `transition: transform 150ms var(--ease-out)`; keep `top: 0` static.

6. **Stats stagger** (`script.js` count-up observer): start each stat's
   count 90ms after the previous (`setTimeout(fn, index * 90)`).

## Verify

- Hover a project card in dark theme: lift and glow ease in together.
- Click-hold any hero button: subtle press-down.
- Mobile viewport: menu fades/slides in over ~180ms; instant under
  reduced motion.
- Tab from page load: skip link slides down.
- Stats count in a left-to-right cascade.

Status: DONE (applied in the same session, commit follows).
