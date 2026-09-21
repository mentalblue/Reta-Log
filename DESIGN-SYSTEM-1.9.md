# New design — component contract

Scope: presentation only. All screens retain their existing data sources, actions, order, filters, aggregation preferences and navigation handlers.

## Tokens

| Token | Light | Dark |
|---|---|---|
| Background | #F2F6FC | #060F1E |
| Surface | #FFFFFF | #0D1C30 |
| Text | #13253E | #F1F5FF |
| Secondary text | #526581 | #A8BAD5 |
| Border | #D4DEF0 | #2A4063 |
| Tonal control | #E8EFFB | #192C49 |
| Default brand | Blue / Indigo / Violet | Blue / Indigo / Violet |

Accent readability is computed against the surface, independently of the decorative swatch. White primary-button text uses a darkened gradient start. Status colours keep semantic meaning and have theme-specific values.

Typography: locally bundled Manrope variable 200–800 (OFL); system fallback. Page title 28, section 19, body 15, supporting text 13, category label 12, navigation 11. Large metrics 42; paired cards 28. Numeric values use tabular figures. Existing large-text handling remains.

Spacing: 4/8/12/16/20/24/32 units. Main horizontal padding 20, narrow 14, desktop 32. Card padding 20; compact tiles 13–16. Card gap 16.

Radius: hero 28, card 22, primary button 16, form/control 14, chips pill.

Every card uses a top highlight plus coloured ambient glow. Depth-off retains gloss; depth-on uses stronger inset lighting and wider elevation shadows. Chart interiors stay flat. No concentric pattern is drawn over data.

## Reusable surface mapping

| Future Compose component | Current implementation contract |
|---|---|
| RetaTheme | body.new-design tokens; applyTheme presentation adapter |
| RetaScreenScaffold | existing main and nav, routes unchanged |
| RetaCard | .card + shared tokens |
| RetaHeroCard | .card.hero |
| RetaMetricTile | .home-pair .card / .target-tile |
| RetaChartCard | .graph-surface / .weight-chart-card |
| RetaPrimaryButton | .primary |
| RetaSecondaryButton | .secondary |
| RetaIconButton | .icon-button / .round |
| RetaFilterChip | .chipbar button and .on |
| RetaStatusPill | existing status classes + semantic tokens |
| RetaSupplyCard | .supply-card with existing stock and disclosure logic |
| RetaIllustration | supplyMini presentation adapter; native SVG gradients |
| RetaBottomNavigation | five equal flex items, one row, existing handlers |
| RetaSheet | existing modal .sheet |

All new CSS selectors require body.new-design. Existing Classic renderers and artwork are preserved. settings.newAccent is a presentation-only preference; settings.color remains the Classic palette preference. No Compose dependency or native migration is introduced.

The mockups inform surfaces, gradients, glow and object lighting. Their additional feature screens and illustrative values are not introduced into the app.
