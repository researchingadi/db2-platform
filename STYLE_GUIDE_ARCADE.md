# DB² Arcade Style Guide

How the restyled pages (BLAST, Contact, home sections, account pages, Navbar, Footer) are built.
Follow this for every remaining page. Reference code: `app/blast/page.tsx`, `components/blast/*`,
`app/contact/page.tsx`, `components/site/Navbar.tsx`, `components/site/Footer.tsx`, `app/globals.css`.

## Rules (apply to every restyle)

1. **Visual changes only.** Never change logic, state, handlers, effects, fetch calls, data, routes, ids,
   `aria-*` attributes, tab order, or any wording or number. Restyling an existing handler's colour
   string is fine; changing what the handler does is not. Wrapper elements are allowed only for styling.
2. **Colours: existing tokens only.** `--db-black` (page), `--db-charcoal` (panel fill), `--db-cream`
   (primary text, borders, title bars), `--db-stone` (secondary text), `--db-cyan` (accent, links, active),
   `--db-green` (success), `--db-violet` (extra accent), `--arcade-pink` (single main CTA, errors).
   No hex, no `rgba(...)` literals, no old slate/indigo values. Secondary text is `--db-stone`, never `--db-muted`.
3. **Readability beats authenticity.** No scanlines, no dim text, body text ≥ 14px, line-height ≥ 1.5.
4. **Pixel font (`--font-pixel`) only** on headings, labels, buttons, toggles and title bars. Never on
   paragraphs, tables, form text, sequences, accessions, e-values or other data. Prose uses `--font-sans`;
   sequences, IDs and numbers use `--font-mono`.
5. **Shapes:** `border-radius: 0`, no glows, blurs, soft gradients or `drop-shadow`s. Hard 4px borders and the
   offset shadow `var(--arcade-shadow)` only.
6. **Motion:** respect `prefers-reduced-motion`. Use `steps()` transitions; wrap framer-motion sections in
   `<MotionConfig reducedMotion="user">`; blinking uses `.blink` (already disabled under reduced motion).
7. **Responsive:** must work at 390px with no horizontal page overflow. Wide tables scroll inside their panel.

## Shared classes (`app/globals.css`)

| Class | Use |
|---|---|
| `.arcade-panel` | Card/section: 4px cream border, `--db-charcoal` fill, hard offset shadow. |
| `.arcade-panel__bar` | Panel title bar: cream fill, black pixel text, uppercase. Reuse the panel's existing heading as the bar; bleed it to the edges with negative margins equal to the panel padding (e.g. `margin: "-20px -20px 18px"`). |
| `.arcade-btn` | Secondary button/link-button: pixel font, 4px border, presses down 4px on `:active`. |
| `.arcade-btn--cta` | Pink main action. **One per page** (e.g. "Run BLAST Search", home intro's first button). |
| `.arcade-btn--small` | Compact buttons inside panels/tables. `:disabled` dims to 55% with `not-allowed` cursor. |
| `.arcade-title` | Pixel heading with 3px offset text-shadow. Set size with `clamp()`; add `overflowWrap: "anywhere"` for long headings. |
| `.arcade-label` | VT323 label text (footer credits). |
| `.db-eyebrow` | Small cyan mono kicker line above a heading. |
| `.arcade-input` | Textarea/input/select: 4px cream border, black fill, cream mono 14px text, stone placeholder, dashed cyan focus outline. |
| `.auth-input` / `.auth-label` / `.auth-help` / `.auth-alert(--error/--success)` | Account/auth forms (2px border variant). |
| `.arcade-toggle` (+ `--active`) | Choice buttons (program, scope, "Advanced options"): 2px cream border; active = cyan fill, black text. |
| `.arcade-progress` / `__fill` | Segmented progress bar with `steps(4)` width transition. |
| `.blast-table` | Data table: cream pixel header row; 14px readable body rows with `--db-line-strong` dividers. Wrap in `overflowX: auto`. |
| `.contact-table` | Grouped data table that stacks into labelled rows below 700px (`data-label` on each cell). Used by Contact, admin users, saved jobs/views. |
| `.arcade-hover` | Clickable card: cyan border + deeper shadow on hover/focus-within (no transform, safe with framer-motion). |
| `.pixel-glyphs` | Pixel font plus the "Arcade Glyphs" fallback so `→ ▾ ▴ ⚠` render (Press Start 2P lacks them). Add to any pixel text containing those symbols. `.arcade-toggle` includes it already. |
| `.focus-ring` | Dashed cyan focus outline for plain links (put it on `<Link>` that wraps a styled span). |
| `.blink` | Steps(1) blink for small status markers; off under reduced motion. |
| `sr-only` (Tailwind) | Visually hidden captions/labels. |

## Patterns

- **Page header:** `.db-eyebrow` → `<h1 className="arcade-title">` (≈ `clamp(1.3rem, 3vw, 2rem)`) → stone intro
  paragraph in `--font-sans` 15px.
- **Panel with bar:** panel `padding: 20px` (or `0 24px 28px` with the bar first), bar = existing heading.
  Error panels: pink border and pink bar with black text.
- **Status/data colours:** identity/success `--db-green`; links, accessions, coverage `--db-cyan`;
  mismatches/errors `--arcade-pink`; gaps/secondary accent `--db-violet`.
- **Species names** stay italic in `--font-sans` even inside title bars (override `textTransform: "none"`).
- **Link styled as button:** `<Link className="focus-ring"><span className="arcade-btn">…</span></Link>`.

## Verify every restyle

- Before/after Playwright screenshots at 1440 and 390, scrolled to the top (fixed navbar hides content otherwise).
- Record focusables in tab order (tag, text, id, name, aria-*, href) and API calls before/after: must be identical.
- `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba\(|--db-muted|borderRadius|gradient|blur\(|Syne"` on touched files: none.
- `document.documentElement.scrollWidth > innerWidth` must be false at 390px.
- `npm run build` passes.

## Do / Don't

| Do | Don't |
|---|---|
| Turn an existing heading into the `.arcade-panel__bar` | Add new copy to fill a title bar |
| Use `--db-stone` for secondary text | Use `--db-muted`, low opacity or tiny text |
| Keep data in `--font-mono` / prose in `--font-sans` | Put the pixel font on paragraphs, tables or sequences |
| Use `.arcade-btn--cta` once per page | Make every button pink |
| Restyle the colour string inside a hover handler | Remove or rewrite handlers, effects or fetches |
| Use `steps()` and `MotionConfig reducedMotion="user"` | Add new animations, glows or blurs |
