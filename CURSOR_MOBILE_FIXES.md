# Mobile & Global UI Fixes — Cursor Instructions

You are a senior frontend developer performing **surgical fixes** on a completed, production-ready website. The desktop version is final and must **NOT be modified** under any circumstance, unless a fix is explicitly marked as **[GLOBAL — applies to all viewports]**.

---

## Ground Rules

- Modify **ONLY** what is explicitly listed below, in the exact files and sections described.
- Preserve **all existing desktop styles** — do not touch any `min-width` breakpoints already defined.
- Mobile overrides must be scoped strictly inside `@media (max-width: 375px)` unless the fix is marked **[GLOBAL]**.
- **No refactoring, no "improvements", no changes outside the listed items.**
- If a fix requires touching shared/global styles, use **breakpoint-scoped overrides only** — never edit the base rule directly — unless the item is explicitly marked **[GLOBAL]**.
- Before making any change, read the existing CSS for that selector to understand the current values. Apply the minimum delta needed.

---

## Fixes by File

---

### `index.html` / its associated CSS

#### 1. Hero title — "Lo que te pasa tiene un sentido" `@media (max-width: 375px)`

**Problem:** The title wraps into 3 lines ("Lo que te pasa" / "tiene un" / "sentido"), the font size is too large and line-height is excessive.

**Goal:** Reduce to a maximum of **2 lines**, visually balanced, without feeling cramped.

**Reference:** Use the title in `terapias.html` — "Acompañamiento personalizado para tu sanación" — as your typographic reference for weight, size feel, and line-height rhythm. Match that aesthetic quality.

**Instructions:**
- Reduce `font-size` of the hero `<h1>` (or its equivalent selector) until the text comfortably fits in 2 lines at 375px viewport width.
- Reduce `line-height` proportionally to eliminate excessive vertical spacing.
- Do **not** change `font-weight`, `font-family`, `color`, or any other property.
- Scope the override strictly to `@media (max-width: 375px)`.

---

#### 2. "Sobre mí" section — title and CTA button alignment `@media (max-width: 375px)`

**Problem:** The section title and the "Conocer más sobre mí" button are left-aligned on mobile.

**Goal:** Both elements should be **horizontally centered** at 375px.

**Instructions:**
- Add `text-align: center` to the title element of the "Sobre mí" section.
- Add `display: block; margin-left: auto; margin-right: auto;` (or `text-align: center` on the parent) to the "Conocer más sobre mí" button/link so it centers correctly.
- Do **not** change padding, font, color, or any other property.
- Scope strictly to `@media (max-width: 375px)`.

---

### `terapias.html` / its associated CSS

#### 3. "Sesiones Online" & "Consultorio Presencial" mirror sections `@media (max-width: 375px)`

**Problem (Online):** Bullet point text appears centered but the middle bullet ("Conexión simple (Google Meet, Zoom, Whatsapp)") appears misaligned relative to its bullet marker.

**Problem (Presencial):** The section title wraps to 2 lines relative to the small icon/logo next to it, which looks broken. Both sections are mirrors of each other and must look identical in structure.

**Goal:** Both sections must look visually identical in layout and alignment — only content differs.

**Instructions:**
- Fix bullet alignment: ensure `text-align: left` on list items, and that the bullet marker and text are properly inline-aligned (check for any `text-align: center` on `<li>` or `<ul>` that may be causing the issue).
- Fix the title+icon layout in "Consultorio Presencial": ensure the icon and title sit on the same baseline/row without wrapping. Consider using `display: flex; align-items: center; gap: [existing value or small value];` on the title container if not already set, or reduce font-size slightly to prevent wrapping.
- Apply the same structural fix to "Sesiones Online" title+icon for consistency (even if it's not currently broken — both must be identical).
- Scope all changes to `@media (max-width: 375px)`.

---

#### 4. "Qué dicen los que nos eligieron" — background color differentiation **[GLOBAL — applies to all viewports and all screen sizes]**

**Problem:** The sections "Qué trabajamos en cada sesión", "Qué dicen los que nos eligieron", and "Preguntas sobre las sesiones" share the same background color, making them visually indistinguishable.

**Goal:** Give "Qué dicen los que nos eligieron" a **distinct background color** that differentiates it from its neighbors. Use the same background color currently applied to the "Cómo es una sesión" section as the new color for this testimonials section.

**Instructions:**
- Identify the `background-color` (or `background`) CSS value currently applied to the "Cómo es una sesión" section.
- Apply that exact same value to the "Qué dicen los que nos eligieron" section.
- This change goes in the **base/global styles**, NOT inside any media query — it must apply to desktop, tablet, and mobile equally.
- Do **not** change any other property of any of these sections.

---

### `talleres.html` / its associated CSS

#### 5. Workshop cards — internal spacing `@media (max-width: 375px)`

**Problem:** Inside each individual workshop card, the following elements feel too cramped vertically:
- Main title
- Descriptive paragraph
- Duration/dates bullets
- "Qué aprenderás" bullets
- CTA buttons ("Inscribirme" / "Consultar")

**Goal:** Increase vertical breathing room between these grouped elements.

**Instructions:**
- Add `margin-top` to the descriptive paragraph relative to the card title (a moderate increase — do not double the current value, aim for ~1.25–1.5× the current spacing).
- Add `margin-top` to separate the **duration/dates bullet group** from the **"Qué aprenderás" bullet group** — they should feel like distinct sections within the card.
- Add `margin-top` to the CTA buttons container ("Inscribirme" / "Consultar") to separate them clearly from the last bullet group above.
- Do **not** change font sizes, colors, widths, card borders, or any other property.
- Scope all changes to `@media (max-width: 375px)`.

---

### `sobre-mi.html` / its associated CSS

#### 6. Hero title — "Hola soy Andrea Blangino" `@media (max-width: 375px)`

**Problem:** Same wrapping and oversized font issue as the hero title in `index.html`.

**Goal:** Apply the **exact same fix** described in Fix #1 above.

**Instructions:**
- Mirror the `font-size` and `line-height` values you applied to the `index.html` hero `<h1>` onto the equivalent hero `<h1>` in `sobre-mi.html`.
- Same constraints apply: max 2 lines, no other properties changed.
- Scope to `@media (max-width: 375px)`.

---

#### 7. Card icon colors — "El síntoma como mensaje", "Transgeneracional y linaje", "Conciencia y empoderamiento" **[GLOBAL — applies to all viewports and all screen sizes]**

**Problem:** The logos/icons inside these three cards are currently white, which makes them feel flat and undifferentiated.

**Goal:** Give each icon/logo a **non-white color** that feels intentional and harmonizes with the existing site palette.

**Instructions:**
- Identify the existing brand/accent colors in the site's CSS variables or color palette.
- Apply a distinct, on-brand color to each of the three card icons (they can share a single accent color, or each have a different one from the palette — use your judgment based on the existing visual language).
- Use `fill`, `color`, or `stroke` as appropriate depending on whether the icons are SVG or icon-font based.
- This change goes in **base/global styles** — NOT inside a media query. It must apply to all viewports.
- Do **not** change icon size, card layout, background, or any other property.

---

## Summary Checklist

| # | File | Fix | Scope |
|---|------|-----|-------|
| 1 | `index.html` | Hero H1: reduce font-size + line-height → max 2 lines | `@media (max-width: 375px)` |
| 2 | `index.html` | "Sobre mí" title + button → center aligned | `@media (max-width: 375px)` |
| 3 | `terapias.html` | Mirror sections: fix bullet alignment + title/icon wrap | `@media (max-width: 375px)` |
| 4 | `terapias.html` | Testimonials section bg color = "Cómo es una sesión" bg | **GLOBAL** |
| 5 | `talleres.html` | Card internal spacing: title→para, bullets, CTAs | `@media (max-width: 375px)` |
| 6 | `sobre-mi.html` | Hero H1: same fix as #1 | `@media (max-width: 375px)` |
| 7 | `sobre-mi.html` | Card icons: apply non-white brand color | **GLOBAL** |
