# Design QA — Kiwango landing visual story

- Selected visual direction: `/workspace/scratch/9f4de7a6690c/generated_images/exec-fd78d8a6-065e-424f-a86a-38b4d47c01dc.png`
- New photographic source assets:
  - `/workspace/scratch/9f4de7a6690c/generated_images/exec-676c065e-bc7e-44a2-a778-9ced198be18b.png`
  - `/workspace/scratch/9f4de7a6690c/generated_images/exec-22c09479-1a23-4e9c-9e62-1b548a56f7fa.png`
  - `/workspace/scratch/9f4de7a6690c/generated_images/exec-e3b35cf6-01df-44b2-9795-f949f5c119e9.png`
- Browser implementation captures:
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-landing-visual-story-top.jpg`
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-story-preparation.jpg`
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-story-rate-check.jpg`
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-story-offline.jpg`
- Combined comparison evidence:
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-landing-direction-comparison.jpg`
  - `/workspace/scratch/9f4de7a6690c/qa/kiwango-story-assets-comparison.jpg`
- Browser viewport: 1363 × 936 CSS px, device scale factor 1
- Source pixels: selected direction 1487 × 1058; each new photo 1448 × 1086
- Implementation pixels: each focused capture 1363 × 936
- Normalization: the direction comparison uses equal 1000 × 720 cells; the asset comparison uses equal 1000 × 700 cells with each source photo immediately beside its rendered section.
- State: French landing page, light theme, Senegal → Kenya, desktop viewport.

## Findings

No actionable P0, P1 or P2 differences remain.

- Fonts and typography: Inter keeps the established bold editorial hierarchy. Display headings remain compact, labels use restrained uppercase tracking and supporting copy stays readable at the measured desktop width.
- Spacing and layout rhythm: the approved hero is unchanged. The previous card grid is replaced by a clear introduction and three alternating image-and-copy sequences. Section spacing, two-column proportions and CTA alignment remain consistent through the page.
- Colors and visual tokens: warm off-white, pale mint and emerald accents continue the approved direction without reintroducing a dark interruption. Borders and shadows are deliberately restrained.
- Image quality and asset fidelity: all three generated editorial photographs are present as optimized 1400 × 1050 WebP files. Subjects, focal points and negative space match their intended overlays; no placeholder, CSS drawing or decorative substitute replaces them.
- Copy and content: each image now supports a distinct product moment—trip preparation, rate verification and offline access. The cards superimposed on the photographs are explicitly presented as saved-trip, example-rate and Travel Pack states rather than deceptive marketing controls.
- Responsive structure: each sequence uses a single-column mobile layout with a 4:5 image crop, then switches to a 4:3 two-column layout at larger breakpoints. Overlays stay inset from every edge and copy wraps without fixed heights.
- Accessibility: each photograph has contextual French and English alternative text; CTA links remain semantic; decorative status icons are paired with readable text; contrast remains sufficient on white and mint surfaces.

## Interaction verification

- Verified the three new CTA destinations: `/voyage`, `/outils` and `/voyage`.
- Switched the landing page to English and verified all four new headings render in English.
- Confirmed all six landing photographs report complete loading with non-zero natural widths.
- Checked the browser console: no application errors.
- Re-ran lint, core conversion tests and the production build successfully.

## Comparison history

1. The approved source direction established the warm editorial palette, asymmetrical travel photography and compact white product overlays.
2. The first implementation pass reproduced that language across three new full-width sequences. Focused browser captures showed the intended crops, hierarchy and overlays with no P0/P1/P2 mismatch.
3. The initial overview evidence did not consistently paint offscreen lazy images in the cloud-browser full-page capture. The three lightweight section images were changed to eager loading, then recaptured with confirmed natural widths. This was an evidence-completeness fix, not a visual redesign.
4. The final paired comparison confirms each source photo keeps its focal point and that each UI overlay occupies the planned negative space without covering the subject.

## Follow-up polish

- P3: recheck the exact 4:5 crop on the dominant production mobile width once analytics identify it.

## Installation and converter follow-up — 9 August 2026

- Source feedback: the previous “Kiwango partout avec vous” mockup looked artificial and presented three competing actions.
- New source asset: `/workspace/scratch/9f4de7a6690c/generated_images/exec-56b4d8dc-e020-4660-92d9-8fcf8153d44e.png`
- Focused browser capture: `/workspace/scratch/9f4de7a6690c/qa/install-section.jpg`
- Full-page browser capture: `/workspace/scratch/9f4de7a6690c/qa/landing-latest.jpg`
- Before/after comparison: `/workspace/scratch/9f4de7a6690c/qa/install-section-comparison.jpg`

No actionable P0, P1 or P2 differences remain in the follow-up.

- The fake phone and unavailable store badges are replaced by a real editorial travel image with a credible Travel Pack status overlay.
- The section now exposes one contextual action only: install when the browser offers installation, otherwise use/open Kiwango.
- The installation hint is explanatory text, not a competing control.
- Landing display sizes are reduced at the hero, journey introduction and installation section while preserving the approved hierarchy.
- The converter contains the rates table followed by favorites and conversion history; the tools page no longer duplicates these sections.
- The legacy `/devises` route and legacy rates tab redirect to `/convertisseur#devises`.
- Destination route, ATM/bank and exchange-office controls remain inside Kiwango and expose loading, result, empty and retry states.
- Browser interaction checks confirmed continuous nine-digit amount entry, anchor positioning below the sticky header and no external navigation from the Google Maps controls.

final result: passed
