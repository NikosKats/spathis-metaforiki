# Design References

## CargoTrack — Vlad Bahatskyi / VALMAX
[Dribbble shot 27310160](https://dribbble.com/shots/27310160-Dashboard-UI-for-a-Logistics-Platform-CargoTrack)

> "Logistics dashboard design for cargo and fleet management featuring shipment tracking, vehicle data, and route analytics. The interface focuses on clear UX/UI, real-time data visualization, and structured layout to improve operational efficiency and decision-making."

### Palette extracted from the shot
| Hex | Use |
|---|---|
| `#F1F0F1` | Background — soft off-white |
| `#190602` | Near-black — text, primary surfaces |
| `#B8B8B8` | Mid-grey — borders, secondary text |
| `#E32501` | Bright vermilion — primary accent (very close to Spathis logo red) |
| `#CE3A0A` | Deep orange-red — hover / pressed states |
| `#5B403A` | Warm brown — neutral accent |
| `#D0984F` | Sand / amber — highlights |
| `#E6CBA8` | Cream — subtle highlights / data viz |

### Why this works for Spathis
- The CargoTrack red (`#E32501`) is **almost the same** as the logo background. We can lock the brand red there or stay slightly deeper (logo looks closer to `#C8102E`).
- The neutral palette (cream / brown / sand) gives us non-red accents for charts, illustrations, secondary buttons — keeping the page from feeling monochromatic.
- The dashboard focus aligns with our **admin** UI (Phase 4) more than the marketing site, so we'll borrow:
  - Card-with-shadow layouts
  - Compact data tables
  - Real-time "shipment in motion" feel for the public hero (route map / animation)

### Spathis brand palette (proposed)
| Token | Hex | Note |
|---|---|---|
| `--brand` | `#C8102E` | Logo red |
| `--brand-strong` | `#A00C24` | Hover / pressed |
| `--ink` | `#190602` | Body text, dark surfaces |
| `--surface` | `#F8F7F6` | Page background |
| `--muted` | `#B8B8B8` | Borders, secondary text |
| `--accent-warm` | `#D0984F` | Sand highlight (sparingly) |
| `--accent-cream` | `#E6CBA8` | Subtle backgrounds |

These get wired into `web/src/app/globals.css` as CSS variables and exposed via Tailwind theme.
