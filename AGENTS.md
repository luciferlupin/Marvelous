# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Current Product Direction

- Expansion: Ashok Vihar is open; Model Town opens 22 September; Pitampura and Punjabi Bagh are coming soon. Franchise opportunities are available. Do not invent opening dates, investment terms, or contact details. Franchise enquiry preparation must clearly state it is not submitted until a real endpoint is connected.

- Choose photography by section subject: hair colour imagery for colour stories, bridal styling for occasions, and scalp treatment imagery for care. Keep warm ivory, bronze, and champagne surroundings cohesive with page backgrounds. Pair photography with original 2D artwork and purposeful scroll motion; do not imply editorial inspiration images are verified client results.

- Extend the homepage with original, premium 2D editorial graphics, spacious Apple-like bento layouts, and sticky section-overlap scroll choreography while preserving the established warm ivory, champagne, and espresso luxury palette.
- Treat the site as an expensive, high-luxury digital experience: continue adding substantive editorial sections, refined micro-interactions, reversible scroll-linked motion, layered 2D creative assets, and more complex but silky animation systems rather than static card grids.

- Build only the Marvelous Salon splash-to-hero transition for now. Do not add navigation or the rest of the website until the user provides that direction.
- Use the supplied Marvelous Salon lockup as the source of truth. Rebuild its letterforms as crisp real typography (including the custom crossbar-less chevron `Λ` for the second letter).
- Reveal the hero image directly through the logo letters using an SVG cutout mask on the warm beige background (`#f3ede7`), keeping the rest of the screen hidden until exit.
- Maintain zero blur on the hero image, typography, or exit transition. The hero photo remains at 100% resolution, fixed position, and sharp clarity.
- Animate the brand letters entering one by one with staggered timing.
- Keep the logo lockup and forward zoom precisely centered in the viewport (`transform-origin: center center`).
- As the zoom into the logo begins, the warm beige background fades out continuously (`opacity: 1 -> 0`) while the full hero photograph smoothly and continuously emerges into view with zero flickering, flashing, or GPU texture drops.
- The hero section now functions as the primary luxury salon main page, featuring a refined top navigation header, editorial description, elevated Call-to-Action controls ("Reserve an Experience" / "Explore Services"), and curated specialty details alongside the interactive replay button.
- Fast loading is guaranteed by preloading `/assets/marvelous-salon-hero.png` with high fetch priority in `index.html`.
- The hero section content (header, brand editorial, CTAs, and footer) is pre-mounted and preloaded behind the splash, revealing in direct, harmonious synchronization as the camera zooms into the logo aperture.
- The intro sequence is brisk and silky: snappy letter entrance (320ms), graceful hold (1.4s), and fluid continuous zoom and fade (1.35s) directly into the main page experience.
- Clutter-free luxury branding & visual hierarchy:
  - Top navigation uses clean, spacious typographic links (`Services`, `The Atelier`, `Stylists`, `Editorial`) with champagne hover underlines, omitting heavy pill containers for an airy architectural feel.
  - Top-left header features a minimalist monogram lockup (`M | ATELIER`) to prevent visual repetition with the central brand name.
  - The hero centerpiece maintains clear, scannable focal points: `MΛRVELOUS` title, champagne `SALON` row with flanking hairlines, `BEAUTY BEYOND ORDINARY` accent tag, and a punchy 12-word editorial statement.
  - Calls-to-Action feature a dominant, luminous primary button (`Reserve an Experience`) paired with a refined, quiet secondary action (`Explore Services →`).
  - Hero footer is completely clutter-free: bottom specialties removed per user direction, keeping the lower vista open with the interactive frosted glass replay button resting in the bottom-right corner.
- Motion scroll transitions & interactive depth:
  - Scrolling is smoothly enabled once the splash zoom finishes (`phase === "complete"`).
  - The hero typography features differential parallax rates: `MΛRVELOUS` shifts upward with subtle letter-spacing expansion, while the category, tagline, description, and CTAs float with staggered vertical velocity and silky blur-free dissolves.
  - The hero photograph features subtle depth parallax anchoring.
  - An animated golden hairline scroll cue ("Scroll to Discover") invites exploration and dissolves as soon as the user starts scrolling.
  - The top navigation bar transitions into a pinned frosted glass header (`backdrop-filter: blur(18px)`) with champagne borders when scrolled.
  - A kinetic infinite motion marquee ticker smoothly flows at the transition seam into the curated Atelier Philosophy, Services Rituals, and Private Consultation sections.
  - The Replay Intro button seamlessly scrolls to the top (`scrollTo(0, 0)`) and restarts the entrance sequence.
- Color motion scroll animation across all sections (light to dark original luxury brand palette):
  - **Hero Section**:
    - As the user scrolls through the hero section (`scrollY: 0 -> 320px`), brand typography dynamically transitions from luminous alabaster ivory (`#FAF7F2`) into the original deep bronze espresso brand color (`#2C1A0E`).
    - Subtitle (`SALON`) and hairline rules transition from champagne gold (`#E5CEB0`) to the original bronze tone (`#765942`).
    - Tagline (`BEAUTY BEYOND ORDINARY`) transitions from `#D9BA8F` to `#5A3E2B`.
    - An ambient warm backlight softly emerges behind the lockup proportionally (`rgba(250, 245, 238)`), guaranteeing that the dark original letters pop with sculpted depth and crystal-clear contrast over the salon interior.
    - Primary and secondary CTA buttons adapt their colors and contrast in sync with the scroll progress.
    - Hero footer specialties and Replay Intro button seamlessly transition their typography, borders, and glass backgrounds.
  - **Kinetic Motion Ticker**:
    - Marquee strip dynamically transitions its background from deep obsidian espresso (`#140D09`) into a warm champagne gold ribbon (`#E5CEB0`), while text shifts into dark original bronze (`#2C1A0E`) and separator starbursts (`✦`) transition into deep bronze tone (`#765942`).
  - **The Atelier Philosophy Section (`#atelier`)**:
    - Section background smoothly morphs from dark obsidian (`#120B08`) into warm limestone alabaster (`#F7F2EB`).
    - Eyebrow (`THE ATELIER PHILOSOPHY`), heading title, and decorative divider transition from champagne and ivory into rich original bronze tones.
    - The 3 craft cards transform from dark tinted glass into luminous alabaster porcelain cards (`rgba(255, 255, 255, 0.94)`) with sculpted bronze borders, champagne-to-bronze index numbers (`01`, `02`, `03`), and deep espresso body copy (`#3E2A1C`).
  - **Curated Signature Rituals Section**: Removed per user direction to streamline the luxury editorial flow directly into House Codes and Visionary Leadership.
  - **Private Booking Concierge Section (`#booking`)**:
    - Section background dynamically shifts into warm limestone alabaster (`#F5EFE7`).
    - Grand pavilion box transitions its radial gradient into luminous travertine marble with sculpted bronze borders.
    - Eyebrow, title (`Begin Your Transformation`), description, and address typography transition into deep original bronze tones.
    - Concierge Call primary button and Replay Experience secondary button adapt their contrast, fills, and borders seamlessly.
  - **Atelier Site Footer (`.site-footer`)**:
    - Site footer background transitions from obsidian (`#0D0705`) into warm champagne travertine (`#E8DFD5`).
    - Monogram `M`, brand title `MΛRVELOUS SALON`, and copyright credit dynamically transition into original dark bronze couture tones.
  - **Reversibility**: All transitions are fully bi-directional and fluidly reverse when scrolling back toward the top of the page.
- **Ultra-Smooth LERP Physics Engine & Typographic Color Motion**:
  - Replaced stepped frame-by-frame state updates with a high-performance, hardware-accelerated **Linear Interpolation (LERP)** animation loop running on `requestAnimationFrame`.
  - Color and transform values ease with a damping factor (`0.09`), eliminating all scroll stepping, mouse-wheel tick jumps, and jitter for pure liquid smoothness at 60/120 FPS.
  - Custom properties are updated directly via a DOM ref, bypassing virtual DOM diffing during scrolling for maximum performance.
  - **Typographic Character Wave & Text Color Motion**:
    - The 9 letters of `MΛRVELOUS` (`M`, `Λ`, `R`, `V`, `E`, `L`, `O`, `U`, `S`) feature a progressive, staggered liquid color wave (`--char-progress-0` through `8`), shifting from luminous ivory to dark bronze letter-by-letter as the user scrolls.
    - The editorial description, tagline, and salon hairlines transition smoothly alongside the wave.
    - Each of the 3 craft cards in The Atelier Philosophy features individual scroll tracking for its index numbers (`01`, `02`, `03`), headings, and body text.
    - Each of the 3 signature service rows features independent color motion across its category badge, title, description, and reserve CTA.
    - Booking Concierge and Atelier Footer typography glide seamlessly into dark original bronze.
- **Visionary Leadership & Academy Section (`#leadership`)**:
  - Positioned seamlessly between Curated Signature Rituals (`#services`) and Private Booking Concierge (`#booking`), providing a natural storytelling progression from atelier rituals to visionary leadership and private appointments.
  - Featured Founders & Leadership:
    - **Hridhan Pahwa**: Founder of Marvelous Salon & Academy; Advocate & Legal Counsel. Represents enterprise strategy, academic expansion, and legal intellect combined with luxury salon design.
    - **Ashna Pahwa**: Managing Director & Celebrity Makeup Artist (MUA) at Marvelous Salon; Glam India Award Winner (holding the BRO Business Award plaque). Represents haute bridal transformations, high-fashion artistry, and creative direction.
  - Cards feature individual LERP scroll progress tracking (`--founder-card-p-0`, `--founder-card-p-1`) with dynamic color transitions across cards, typography, roles, and pill tags.
  - Crisp zero-blur photography with custom object positioning (`center 15%` for Hridhan Pahwa, `center 25%` for Ashna Pahwa), frosted luxury glass badges, and smooth hover elevation.
  - Top navigation bar includes direct link to `Leadership` (`#leadership`).
- **Comprehensive Motion Scroll Transitions (Sections & Typography)**:
  - Fixed animation loop lifecycle: decoupled `isScrolled` and `isNearTop` state updates from the scroll effect dependency array using refs (`isScrolledRef`, `isNearTopRef`) and resetting `isAnimating.current = false` during cleanup, ensuring the continuous requestAnimationFrame LERP loop never halts or deadlocks.
  - Exposed unitless `--scroll-y-val` alongside pixel-based `--scroll-y`, eliminating CSS `calc()` syntax errors when combining dimensionless numbers with scroll offsets in `opacity`, `scale`, and `letter-spacing`.
  - Applied hardware-accelerated `translate3d` and `opacity` motion scroll transitions across all headers, cards, and typography in Atelier Philosophy, Signature Rituals, Visionary Leadership, and Booking Concierge sections, fully synchronized with the continuous LERP physics engine.
- **Hero Typography & CTA High-Contrast Visibility Architecture**:
  - Balanced cinematic scrim with calibrated center contrast (`rgba(12, 7, 5, 0.52)` tapering to `0.85`), maintaining the natural warmth and sunlight of the salon photograph while preventing white-out.
  - Implemented initial-state dark focal vignette (`.hero__lockup::after`) with dynamic scroll counterbalancing (`calc(0.72 * (1 - var(--color-progress)))`), which seamlessly yields to the warm alabaster backlight on scroll.
  - Enhanced text shadows across `brand-word`, `brand-salon`, `brand-tagline`, and `hero__description` to multi-layered close-range + soft-ambient shadows (`0 1px 3px rgba(0, 0, 0, 0.98), 0 3px 20px rgba(0, 0, 0, 0.96)`).
  - Strengthened `SALON` letterforms with `-webkit-text-stroke: 0.35px` and luminous champagne ivory colors (`#fff2e0`), increased hairlines to `1.5px`.
  - Elevated `BEAUTY BEYOND ORDINARY` to `font-weight: 600` with radiant gold contrast (`#fdf0dc`).
  - Solidified secondary CTA (`EXPLORE SERVICES →`) with frosted obsidian glass backdrop (`rgba(18, 11, 7, 0.75)`), champagne gold border (`1.5px`), and white typography.
  - Enhanced top navigation links, logo sub-mark, and scroll cue with crisp text shadows and typography weights.
