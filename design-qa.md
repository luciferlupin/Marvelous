# Marvelous Salon Splash-to-Hero — Design QA

## Evidence

- Supplied logo source of truth: `/var/folders/sz/zr_fytr90z12zs7kynzxzg340000gn/T/codex-clipboard-702939fb-c59e-4863-abd4-0bb761b39e44.png`
- Shared generated photograph: `/Users/harshitgoyal/marvelous/public/assets/marvelous-salon-hero.png`
- Desktop word-fill state: `/Users/harshitgoyal/marvelous/implementation-word-fill-v2.png`
- Desktop zoom state: `/Users/harshitgoyal/marvelous/implementation-zoom-v2.png`
- Desktop hero state: `/Users/harshitgoyal/marvelous/implementation-hero.png`
- Mobile word-fill state: `/Users/harshitgoyal/marvelous/implementation-mobile-word-fill.png`
- Mobile zoom state: `/Users/harshitgoyal/marvelous/implementation-mobile-zoom.png`
- Mobile hero state: `/Users/harshitgoyal/marvelous/implementation-mobile-hero.png`
- Combined full-view comparison: `/Users/harshitgoyal/marvelous/qa-comparison-splash-to-hero.png`
- Source dimensions: logo 481 x 498 px; shared hero photograph 1672 x 941 px.
- Desktop viewport and screenshots: 1440 x 900 CSS px and 1440 x 900 image px at device scale factor 1.
- Mobile viewport and screenshots: 390 x 844 CSS px and 390 x 844 image px at device scale factor 1.
- States compared: settled word-fill at 1.6 seconds, mid-zoom at 3.1 seconds, and completed hero after 4.4 seconds.

## Findings

- No actionable P0, P1, or P2 issues remain.
- Fonts and typography: the supplied raster logo is used as the alpha mask, preserving its exact custom letterforms, spacing, salon separator rules, and tagline. No substitute web font or reconstructed logo was introduced.
- Spacing and layout rhythm: the masked lockup remains optically centered with generous negative space on desktop and mobile. The zoom origin targets the main MARVELOUS word and expands beyond the viewport without horizontal overflow.
- Colors and visual tokens: the initial field uses source-sampled ivory `#f3ede7`. Warm taupe and bronze image tones remain legible inside the letterforms and carry naturally into the hero.
- Image quality and asset fidelity: one exact photograph file powers both the masked word-fill and the full-bleed hero. The logo mask is derived from the supplied source, and the 1672 x 941 hero stays sharp at the tested desktop and phone sizes.
- Copy and content: MARVELOUS, SALON, and BEAUTY BEYOND ORDINARY remain exactly as supplied. No navigation, hero copy, or additional website sections were added.
- Motion: the lockup enters softly, holds, accelerates into a 12x zoom through the main word, and hands off to the same photograph while the hero resolves from a subtle cinematic blur.
- Responsiveness: desktop and 390 px mobile captures show centered logo states, intentional zoom crops, a full-bleed hero, and no horizontal overflow.
- Accessibility: the full splash remains a keyboard-focusable skip control with a descriptive accessible label, meaningful hero alt text is present, and reduced-motion handling remains in place.

## Comparison History

### Pass 1 — blocked

- [P2] The first photographic word-fill was too faint in the lightest portions of the salon image, making some logo strokes appear incomplete.
- Fix: derived a stronger alpha-only mask from the supplied lockup and adjusted only the masked photograph's brightness and contrast. The full hero photograph remains unmodified.
- Post-fix evidence: `implementation-word-fill-v2.png` and `implementation-zoom-v2.png` show complete, readable letterforms with visible photographic variation.

### Pass 2 — passed

- The combined comparison confirms that the supplied logo anatomy is preserved, the same salon image is visible inside the words and in the hero, and the transition reads as a zoom through the lettering.
- Desktop and mobile final states use the same hero asset with responsive `cover` cropping.
- No further P0/P1/P2 fixes were required.

## Browser Verification

- Automatic sequence verified from entrance through completed hero.
- Tap/click-to-skip verified during entrance; the splash unmounted and the shared hero remained.
- Shared-image check verified that both transition and hero reference `/assets/marvelous-salon-hero.png`.
- Desktop and mobile browser console checks returned no warnings or errors.
- Mobile document width remained 390 px at a 390 px viewport, confirming no horizontal overflow.

## Follow-up Polish

- [P3] Replace the supplied raster logo with an official vector master later if one becomes available; this would make the mask even sharper during the deepest part of the zoom.

final result: passed

---

# Luxury Motion Expansion — Studio, House Codes, and Founder Story QA

## Evidence

- Source visual truth: `/Users/harshitgoyal/marvelous/public/assets/marvelous-ribbon-profile-2d.png`, `/Users/harshitgoyal/marvelous/public/assets/marvelous-tools-still-life-2d.png`, `/Users/harshitgoyal/marvelous/public/assets/marvelous-color-prism-2d.png`, `/Users/harshitgoyal/marvelous/public/assets/marvelous-hair-flow-2d.png`, and `/Users/harshitgoyal/marvelous/design-source-founders-before.jpg`.
- Rendered implementation: `/Users/harshitgoyal/marvelous/design-qa-studio.png`, `/Users/harshitgoyal/marvelous/design-qa-codes-mid.png`, `/Users/harshitgoyal/marvelous/design-qa-codes-end.png`, and `/Users/harshitgoyal/marvelous/design-qa-founders-top.png`.
- Combined comparison inputs: `/Users/harshitgoyal/marvelous/design-qa-comparison-new-sections.jpg` and `/Users/harshitgoyal/marvelous/design-qa-comparison-founders.jpg`.
- Browser and viewport: Codex in-app browser, 1027 × 781 CSS px, device density 1.
- Implementation screenshots: 1027 × 781 px. New-section comparison board: 2078 × 1562 px. Founder comparison board: 2078 × 781 px.
- Source assets: 1586 × 992, 1254 × 1254, 1586 × 992, and 1122 × 1402 px. Founder source capture: 1295 × 781 px.
- Normalization: source assets were aspect-filled without stretching into a fixed mosaic; implementation captures were preserved at their native browser dimensions. Founder before/after panels were aspect-filled to equal 1027 × 781 frames.
- States: Illuminate selected in the consultation studio; House Codes at approximately 38% and 76% scroll progress; founder section at its entrance and first-card reveal.

## Full-view comparison evidence

- The generated source language—hair ribbons, museum-like tool still life, prism light, travertine, champagne, espresso, and muted rose—is preserved consistently in the rendered Studio and House Codes sections.
- The Studio balances a dark editorial control column against a luminous artwork stage, while House Codes translates the same art system into a light, horizontally progressing gallery.
- The founder redesign replaces the earlier generic centered-card treatment with a more distinctive asymmetric editorial composition while retaining both real founder photographs and factual identity content.
- The pinned navigation, section transitions, visual density, and typography remain coherent with the established homepage.

## Focused region comparison evidence

- Hair strands, metallic tool edges, paper texture, and prism highlights remain crisp at the tested viewport; no blur, stretching, masking halo, or obvious compression damage was visible.
- The Studio's selected row, live detail copy, image crossfade, and caption all synchronize to the same active mode. Pointer movement adds restrained depth without changing selection.
- House Codes advanced from the Movement/Precision pairing to the Dimension/Signature pairing under vertical scroll. The document width remained exactly 1027 px, confirming no unintended horizontal page overflow.
- Founder card photography remains sharp with an intentional crop; the new heading and supporting copy establish hierarchy before the portrait enters.

## Required fidelity surfaces

- Fonts and typography: the existing Montserrat system is retained. Oversized light display copy, compact tracked labels, and readable body copy maintain appropriate optical contrast across dark and light sections.
- Spacing and layout rhythm: Studio uses a stable two-column split; House Codes uses large editorial panels and generous gutters; Founder spacing intentionally shifts from a conventional grid to a magazine-like vertical narrative.
- Colors and visual tokens: the warm ivory, champagne, blush, espresso, and bronze palette maps cleanly between the generated assets and implementation surfaces.
- Image quality and asset fidelity: every visible editorial graphic is a real raster asset generated for its measured slot. No placeholder, CSS drawing, inline SVG illustration, or emoji substitute is used.
- Copy and content: all new copy is concise, salon-specific, and aligned to consultation, technique, movement, colour, and individual signature. The final House Codes CTA links to booking.
- States and accessibility: Studio uses real buttons with selected state, focus-visible treatment, keyboard focus behavior, and a polite live detail region. Images use useful alt text or are correctly hidden when decorative/inactive. Reduced-motion fallbacks disable spatial motion and crossfades.

## Findings

- No actionable P0, P1, or P2 findings remain.
- [P3] The selected in-app browser offered only a fixed desktop viewport, so a fresh small-screen screenshot could not be captured in this pass. The implemented mobile CSS converts the Studio to a single column and House Codes to a non-sticky vertical stack.

## Comparison History

### Pass 1 — blocked

- [P2] Studio selection could change unintentionally when the pointer crossed another mode during visual review.
- Fix: removed pointer-enter selection and retained deliberate click and keyboard-focus activation; visual hover feedback remains in CSS.
- Post-fix evidence: `/Users/harshitgoyal/marvelous/design-qa-studio.png` shows Illuminate remaining selected with its matching copy and artwork.

### Pass 2 — passed

- Combined comparisons show source artwork, rendered crops, typography, palette, content, and interaction states aligned with the intended luxury editorial direction.
- House Codes scroll progression and page-width stability were verified at two positions; browser console returned no errors or warnings.
- No remaining P0/P1/P2 fixes were required.

## Browser Verification

- Tested Studio click selection for Illuminate and verified matching text, artwork, and pressed state.
- Tested House Codes vertical-to-horizontal scroll progression at multiple positions.
- Checked document width against viewport width: 1027 px equals 1027 px.
- Checked browser console: no warnings or errors.
- Verified founder-section deep link and first portrait reveal.
- Production build passed and all four Sites packaging tests passed.

## Implementation Checklist

- [x] Interactive consultation selector and synchronized imagery.
- [x] Pointer-depth microinteraction without accidental state switching.
- [x] Long-form horizontal editorial scroll gallery.
- [x] Responsive vertical fallback and reduced-motion behavior.
- [x] Asymmetric founder editorial redesign with real photography.
- [x] Console, overflow, build, and Sites package verification.

## Follow-up Polish

- [P3] Add a 390 px browser evidence capture when the selected in-app browser exposes a resizable viewport.

final result: passed

---

# Homepage Expansion — Bento and Scroll-Overlap QA

## Evidence

- Source visual truth: `/Users/harshitgoyal/marvelous/design-source-2d-board.jpg`
- Original generated assets: `/Users/harshitgoyal/marvelous/public/assets/marvelous-hair-flow-2d.png`, `/Users/harshitgoyal/marvelous/public/assets/marvelous-color-prism-2d.png`, `/Users/harshitgoyal/marvelous/public/assets/marvelous-follicle-botanical-2d.png`
- Bento implementation: `/Users/harshitgoyal/marvelous/design-qa-method.jpg`
- Overlap implementation: `/Users/harshitgoyal/marvelous/design-qa-chapters.jpg`
- Combined side-by-side evidence: `/Users/harshitgoyal/marvelous/design-qa-comparison.jpg`
- Browser: Codex in-app browser.
- CSS viewport and implementation captures: 1295 × 781 px at density 1.
- Source comparison board: 1295 × 781 px at density 1.
- Original source-art dimensions: 1122 × 1402, 1586 × 992, and 1254 × 1254 px.
- Normalization: source art was aspect-filled into three equal columns without stretching; source and implementation panels were compared at equal 1295 × 781 pixel dimensions.
- States: desktop light bento reveal and desktop dark sticky-overlap opening chapter, both with pinned header visible.

## Full-view comparison evidence

- The implementation retains the source art's warm ivory, espresso, champagne, copper, and muted-rose palette across both new sections.
- The bento gives the hair-flow asset a tall anchor role, the colour-prism asset a wide focal role, and the follicle illustration a compact science role without stretching or visible compression artifacts.
- The overlap chapter maintains the same crisp artwork and changes the surface context to deep espresso, creating a clear section transition while preserving brand continuity.
- Large display type, restrained small caps, generous gutters, and rounded editorial surfaces create the requested calm, Apple-like hierarchy.

## Focused region comparison evidence

- Fine strand lines, prism edges, circular science details, and paper texture remain visibly sharp in both implementation captures.
- Copy overlays remain readable over the light artwork, with text positioned in visually quiet regions.
- The sticky chapter card's number, eyebrow, heading, body copy, and image align on a consistent three-column axis with no collision at the captured viewport.

## Required fidelity surfaces

- Fonts and typography: Montserrat optical weights remain consistent with the existing site. Display text uses light weight and tight tracking; labels use compact uppercase spacing.
- Spacing and layout rhythm: 12-column bento proportions, card radii, gutters, and section spacing are consistent. No desktop clipping or unintended overflow was observed.
- Colors and visual tokens: warm beige `#f3ede7`, espresso `#2c1a0e`, champagne, and bronze map directly to the established brand palette.
- Image quality and asset fidelity: all visible graphics are real generated raster assets, not CSS/div/SVG substitutes. Crops preserve their subjects and remain sharp.
- Copy and content: section copy is salon-specific and concise. CTAs link to the existing Services and Booking journeys.
- Accessibility and motion: semantic headings, useful alt text, hidden decorative chapter images, reduced-motion overrides, and non-motion mobile fallbacks are present.

## Findings

- No actionable P0, P1, or P2 visual mismatches found.
- [P3] A dedicated small-screen screenshot was not captured because the selected in-app browser remained at a fixed desktop viewport. Responsive and reduced-motion fallbacks are implemented; a future device capture would add evidence rather than require a design change.

## Open Questions

- None blocking handoff.

## Comparison History

### Pass 1 — passed

- No P0/P1/P2 findings. No visual fixes were required after the side-by-side comparison.

## Implementation Checklist

- [x] Original 2D artwork placed as real image assets.
- [x] Bento grid preserves source aspect and visual hierarchy.
- [x] Sticky overlap opening frame verified in the in-app browser.
- [x] Navigation deep links resolve after React mount.
- [x] Reduced-motion and mobile fallbacks included.
- [x] Production build passes.
- [x] Sites packaging tests pass.

## Follow-up Polish

- [P3] Capture a 390 px mobile evidence pass when a resizable selected-browser viewport is available.

final result: passed
