# Design System: PETCare
**Project ID:** 17587434165337853117

## 1. Visual Theme & Atmosphere
PETCare embodies a **premium, airy, and nurturing** aesthetic. The design philosophy centers around glassmorphism — large translucent panels floating over soft gradient mesh backgrounds, creating an "antigravity" feel where elements appear to hover in serene space. The overall mood is **warm, trustworthy, and sophisticated** — a blend of nature-inspired calm and modern luxury. Every interaction feels gentle yet polished, like a high-end wellness retreat for pets.

## 2. Color Palette & Roles
- **Ivory Mist (#F9F9F9):** The foundational canvas — a near-white that provides clean breathing room and lets glass panels shine.
- **Sage Green (#9DC08B):** The primary brand color — used for active navigation highlights, primary CTA buttons, progress indicators, and selection states. Evokes growth, health, and nature.
- **Sand Whisper (#EDF1D6):** A delicate yellow-green tint — used for secondary backgrounds, subtle card washes, and hover states. Creates warmth without weight.
- **Light Earth Rose (#E49393):** The accent spark — used for notification badges, sale tags, urgent indicators, and decorative flourishes. Adds gentle energy without harshness.
- **Translucent White (rgba(255, 255, 255, 0.25)):** The glass material — used for card/panel backgrounds with backdrop-filter blur, creating the signature glassmorphism effect.
- **Deep Forest (#2D5016):** Text and icon color for headings — ensures readability against light backgrounds.
- **Charcoal Bark (#3A3A3A):** Body text color — rich dark gray for comfortable reading.

## 3. Typography Rules
- **Font Family:** "Inter" — a clean, geometric sans-serif that reads beautifully at all sizes.
- **Headings:** Inter Bold (700) with tight letter-spacing (-0.02em). Large headings use Deep Forest (#2D5016).
- **Subheadings:** Inter Semi-Bold (600) in Charcoal Bark (#3A3A3A).
- **Body Text:** Inter Regular (400) in Charcoal Bark, 16px base size with 1.6 line-height for easy reading.
- **Labels/Captions:** Inter Medium (500) at 12-14px, often in a muted sage tone.

## 4. Component Stylings
* **Buttons:** Pill-shaped (fully rounded ends) with Sage Green (#9DC08B) fill for primary actions. On hover, they glow with a soft green shadow. Secondary buttons use translucent glass with a thin sage border.
* **Cards/Containers:** Generously rounded corners (16px radius). Backgrounds use semi-transparent white (rgba(255,255,255,0.25)) with a 12px backdrop blur. Thin 1px border of rgba(255,255,255,0.5) creates a frosted edge. Whisper-soft shadows with 20px spread.
* **Glass Navigation Bar:** Full-width top bar with heavy blur (20px), translucent white background, and a subtle bottom border. Navigation items use Charcoal Bark text, with Sage Green underline/highlight for active states.
* **Inputs/Forms:** Rounded (12px radius), transparent glass background with thin sage border. On focus, the border intensifies to full Sage Green with a gentle outer glow.
* **Badges/Tags:** Small pill shapes with Light Earth Rose (#E49393) fill for notifications, Sage Green for status indicators.

## 5. Layout Principles
- **Generous Whitespace:** Spacious margins (40-60px page margins) and padding (24-32px card padding) create the airy, floating feel.
- **3-Column Grid:** Main content uses a responsive 3-column layout with 24px gaps for the dashboard view.
- **Floating Elements:** Product images and key visuals use subtle translateY transforms and soft shadows to appear hovering above their containers.
- **Background Gradient Meshes:** Large, organic blobs of Sage Green and Sand Whisper gradient positioned behind content, creating depth without clutter.
- **Visual Hierarchy:** Section headers are prominent with generous top margins. Cards maintain consistent sizing within their grid column.

## 6. Design System Notes for Stitch Generation

**DESIGN SYSTEM (REQUIRED):**
Style: Premium glassmorphism with an antigravity floating aesthetic.
Background: Clean Ivory White (#F9F9F9) canvas with large, fluid gradient mesh shapes using Sage Green (#9DC08B) and Sand Beige (#EDF1D6).
Glass panels: Semi-transparent white (rgba(255,255,255,0.25)) with backdrop-filter: blur(12px), thin frosted borders (1px solid rgba(255,255,255,0.5)), and soft shadows.
Primary color: Sage Green (#9DC08B) for buttons, active states, highlights.
Accent color: Light Earth Rose (#E49393) for badges, notifications, sale tags.
Text: Deep Forest (#2D5016) for headings, Charcoal (#3A3A3A) for body. Font: Inter.
Buttons: Pill-shaped, Sage Green fill, glow on hover.
Cards: 16px rounded, glass effect, floating with subtle shadow.
Nav bar: Top-fixed, full glass blur effect, sage green active indicators.
Layout: Generous whitespace, elements appear to float with gentle shadows and transforms.
Overall vibe: Warm, premium, nature-inspired wellness — like a luxury pet spa.
