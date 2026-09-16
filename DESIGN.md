# POING DESIGN.md

## Design Thesis

POING is not a generic tourism dashboard. It should feel like a quiet travel editorial for Pohang: wide scenery, poetic hierarchy, minimal choices, and a product flow that helps travelers move without feeling managed.

Core sentence:

> 바다가 여는 길, 하루가 시가 됩니다.

Use this as the emotional north star. The UI should feel like a travel magazine becoming a useful web service.

## Visual Direction

- Editorial travel site, not mobile app mockup.
- Large landscape imagery should carry the first impression.
- Serif display type is used for atmosphere; sans text is used for utility.
- Product screens should be bright, calm, and spacious.
- The sidebar may be dark and poetic, but content panels should remain readable and practical.

## Anti AI Slop Rules

- Do not use generic SaaS hero sections, purple gradients, floating orbs, bokeh blobs, or abstract SVG decorations.
- Do not overuse glassmorphism. Use it only on image overlays where blur has a clear purpose.
- Do not use emoji as primary UI language.
- Do not explain the product with judge-facing or competition-facing copy inside the user UI.
- Do not create many small cards when one large visual section can carry the story.
- Do not introduce new random blues, shadows, radii, or gradients without updating this file first.

## Palette

Use these semantic colors before reaching for raw hex values.

- `--paper`: warm page background, `#f5f1ea`
- `--paper-soft`: white editorial surface, `#fbfaf6`
- `--charcoal`: primary text and black actions, `#171a17`
- `--deep`: deep coastal ink, `#04172c`
- `--night`: dark POING sidebar, `#09294b`
- `--forest`: selected states and natural accents, `#53663f`
- `--sand`: warm neutral accent, `#d7c3a5`
- `--gold`: small editorial labels, `#c79656`
- `--line`: subtle border, `rgba(24, 56, 88, 0.16)`

Avoid dominant purple, neon gradients, and one-note blue dashboards.

## Typography

Display:

- Use `var(--serif)` for hero headlines, section titles, memory cards, and poetic labels.
- Display text should be large, calm, and lightly set. Do not make it bold.
- Korean display text must be short enough to form intentional line breaks.

Body:

- Use system sans for labels, descriptions, form controls, and navigation.
- Body text should be direct and practical.
- Keep letter spacing at `0` except for very small eyebrow labels when needed.

## Layout

Landing:

- First viewport should be an immersive editorial hero with a real Pohang image.
- Use one oversized background word or phrase for cinematic scale.
- Search/condition bar should sit near the hero edge as a bridge into the service.
- Follow with recommended places and memory sections, not a marketing feature list.

Service pages:

- Left side: poetic POING journey navigation.
- Right side: large web canvas with one primary task per page.
- Keep actions obvious and close to the decision.
- Use side panels only for supporting context such as flow, data sources, or route effects.

Responsive:

- On mobile, stack sections and keep text readable before preserving desktop composition.
- Never allow Korean display text to break one syllable or one short word onto an awkward isolated line.

## Components

Buttons:

- Primary buttons are black/charcoal or deep ink.
- Secondary buttons are quiet outlined controls.
- Rounded pills are allowed for high-level actions; compact utility controls should use `16px` radius.

Cards:

- Cards should be editorial and spacious, with image-first layouts where possible.
- Radius: `22px` for cards, `28px-30px` for hero/screen containers.
- Shadows must be soft and low contrast.

Data chips:

- Use chips to show sources and route facts, not decoration.
- Keep chip colors muted and readable.

Images:

- Prefer actual Pohang imagery from `public/poing-hero.png` until live tourism images are connected.
- Crop intentionally: sea for start, sunset for Space Walk, night for market/memory.

## Copy Voice

Tone:

- Quiet, poetic, and useful.
- Write as a travel companion, not as a pitch deck.
- Do not mention scoring, judges, competition strategy, or AI technology unless the page is explicitly an insight/data page.

Good:

- "바다가 여는 길, 하루가 시가 됩니다."
- "여행은 멀리 가는 일이 아니라, 오늘의 마음을 조금 더 선명하게 만나는 일."
- "포항의 빛과 바람을 따라 걸으면 POING이 그 시간을 조용히 남깁니다."

Avoid:

- "최고의 AI 빅데이터 혁신 관광 플랫폼"
- "공모전 심사용"
- "기능을 확인하세요"

## Accessibility

- Body text contrast should remain comfortable on image overlays.
- Do not place small gray text on image backgrounds.
- Interactive controls need visible focus and clear text labels.
- Use semantic links for navigation and buttons for in-page state changes.

## Change Rule

When changing UI:

1. Read this file first.
2. Update this file if the visual language changes.
3. Sync CSS variables and component classes in `src/app/globals.css`.
4. Run `npm run lint` and `npm run build`.
