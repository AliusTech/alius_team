# Alius UI Design System

> Source of truth: Figma file `Agent-Team`, node 1:1826 (expanded sidebar), node 1:3 (collapsed sidebar), node 8:1038 (mobile).
> All UI work MUST reference this file. No freestyle design allowed.

## Colors

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#f8fafc` | Page background |
| `surface` | `#ffffff` | Cards, sidebar |
| `primary` | `#2d6ff2` | Active nav, buttons, links, progress bar fill |
| `primary-soft` | `#e0ebff` | Active nav bg, running badge bg |
| `border` | `#e2e8f0` | All borders (cards, sidebar, separators) |
| `text-primary` | `#0f172a` | Titles, values, names |
| `text-secondary` | `#64748b` | Subtitles, metadata, inactive nav text |
| `text-muted` | `#94a3b8` | Chart axis labels |
| `success` | `#16a34a` | Completed badge text |
| `success-bg` | `#dcfce7` | Completed badge bg, today's tasks icon bg |
| `warning-bg` | `#fef9c3` | Running icon bg |
| `error` | `#dc2626` | Error badge text, error status dot |
| `error-bg` | `#fee2e2` | Error badge bg, failed tasks icon bg |
| `purple-bg` | `#ede9fe` | Token usage icon bg |
| `track` | `#f1f5f9` | Progress bar track, idle badge bg |
| `chart-secondary` | `#b8d4fe` | Token area chart line/legend |

## Typography

| Element | Size | Weight | Line Height | Color |
|---|---|---|---|---|
| Page title | 21px | Medium 500 | 31.5px | #0f172a |
| Page subtitle | 12.25px | Regular 400 | 17.5px | #64748b |
| Card/section title | 12.25px | Medium 500 | 17.5px | #0f172a |
| Card label | 10.5px | Regular 400 | 14px | #64748b |
| Card value | 17.5px | Semi-bold 600 | 24.5px | #0f172a |
| Card subtext | 11px | Regular 400 | 16.5px | #64748b |
| Badge text | 10px | Medium 500 | 15px | per status |
| Chart axis | 10px | Regular 400 | normal | #94a3b8 |
| Legend text | 11px | Regular 400 | 16.5px | #64748b |
| Task name | 10.5px | Medium 500 | 14px | #0f172a |
| Task metadata | 11px | Regular 400 | 16.5px | #64748b |
| Progress label | 10px | Regular 400 | 15px | #64748b |
| Sidebar nav label | 12.25px | Medium 500 | 17.5px | active: #2d6ff2 / inactive: #64748b |
| Sidebar section header | 11px | Medium 500 | 16.5px, tracking 0.275px uppercase | #64748b |
| Brand name | 12.25px | Semi-bold 600 | 17.5px, tracking -0.3px | #0f172a |
| Avatar initial | 10.5px | Medium 500 | 14px | white |

## Spacing

| Token | Value | Usage |
|---|---|---|
| Page padding | 21px | Main content area |
| Section gap | 17.5px | Between dashboard sections |
| Card padding | 15px | All cards |
| Stat card grid gap | 10.5px | Between stat cards |
| Sidebar nav item height | 35px | NavButton |
| Sidebar nav gap | 5.25px | Between nav items |
| Task row padding | px 14px, py 10.5px | Recent tasks list rows |
| Progress bar height | 3.5px | Running task progress |
| Chart top padding | 10.5px | Above chart surface |

## Radius

| Element | Value |
|---|---|
| Card | 11px |
| Nav item | 11px |
| Primary button | 11px |
| Icon container (card) | 7px |
| Logo container | 7px |
| Badge | full (9999px) |
| Avatar | full |
| Status dot | full |
| Legend dot | full |
| Progress bar | full |

## Sizes

| Element | Value |
|---|---|
| Sidebar collapsed | 56px |
| Sidebar expanded | 200px |
| Nav button | 35px x 35px |
| Logo container | 28px x 28px |
| Card icon container | 24.5px x 24.5px |
| Card icon | 16px x 16px |
| Nav icon | 18px x 18px |
| Badge icon | 11px x 11px |
| Clock icon (task meta) | 10px x 10px |
| Status dot | 5.25px |
| Legend dot | 7px |
| Progress bar width | 84px |
| User avatar | 28px x 28px |
| Chart height | 130px (surface) |

## Borders

| Element | Value |
|---|---|
| Card | 1px solid #e2e8f0 |
| Sidebar right | 1px solid #e2e8f0 |
| Row separator | 1px solid #e2e8f0 |

## Rules

1. No freestyle colors — only tokens above
2. No freestyle spacing — only values from Figma
3. No freestyle radius — only values from Figma
4. If Figma doesn't define a state/component, mark as TODO
5. Visual consistency > code structure
