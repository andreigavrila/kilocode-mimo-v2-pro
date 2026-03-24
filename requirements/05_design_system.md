# 05 — UI/UX & Design System: HoMM3 Battle Simulation

> **Inputs**: [01_requirements_strategy.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/01_requirements_strategy.md), [02_functional_design.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/02_functional_design.md), [03_nfr.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/03_nfr.md), [04_tech_architecture.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/04_tech_architecture.md)

---

## Section 1: Design Philosophy & Tone

### Visual Tone

**Dark, medieval, majestic.** The interface should evoke the feeling of commanding an army in a fantasy battle. Rich dark backgrounds suggest an ancient war table. Gold and amber accents signal nobility and prestige. The UI should feel like a polished fantasy war room — authoritative but readable.

### Design Inspiration

1. **Heroes of Might and Magic 3** — The original game's battle screen with its brown/gold medieval aesthetic, parchment-like panels, and clear hex grid.
2. **Baldur's Gate 3 UI** — Modern dark fantasy UI with semi-transparent panels, gold trim, and clear typographic hierarchy on dark backgrounds.
3. **Darkest Dungeon** — High-contrast dark UI with strong color coding for information, impactful damage/status indicators, and a sense of weight and consequence.

### Key Principles

1. **Clarity above all**: Every game state must be immediately readable. Player colors, stack strength, and turn ownership must be obvious at a glance.
2. **Feedback for every action**: Every click, hover, attack, and state change must have visible feedback — no silent interactions.
3. **Information density over whitespace**: The battle screen should show all relevant information (grid, stats, turn order, log) simultaneously without requiring tabs or modals.
4. **Fantasy immersion**: The aesthetic should honor the HoMM3 fantasy tone — no sterile modern flat design.
5. **Player color distinction**: Player 1 (blue) and Player 2 (red) must be instantly distinguishable everywhere: hex borders, turn indicators, info panels, turn order bar.

---

## Section 2: Visual Identity — Design Tokens

### Color Palette

| Token Name | Hex Code | Usage |
|:---|:---|:---|
| `--color-bg-primary` | `#1a1a2e` | Main page background (deep navy) |
| `--color-bg-secondary` | `#16213e` | Panel backgrounds (side panels, log) |
| `--color-bg-tertiary` | `#0f3460` | Elevated surfaces (cards, tooltips) |
| `--color-bg-surface` | `#1e2a45` | Hex grid background, board area |
| `--color-text-primary` | `#e8e6e3` | Main body text |
| `--color-text-secondary` | `#a0a0b0` | Muted text, labels, descriptions |
| `--color-text-inverse` | `#1a1a2e` | Text on light backgrounds |
| `--color-text-gold` | `#d4a853` | Headings, important labels, unit names |
| `--color-accent-gold` | `#c9a227` | Primary accent (buttons, active states, borders) |
| `--color-accent-gold-hover` | `#e0b83a` | Gold hover state |
| `--color-accent-gold-dim` | `#8a7020` | Disabled/muted gold |
| `--color-player1` | `#3b82f6` | Player 1 identity (blue) |
| `--color-player1-light` | `#60a5fa` | Player 1 highlights |
| `--color-player1-dim` | `#1e3a5f` | Player 1 subtle backgrounds |
| `--color-player2` | `#ef4444` | Player 2 identity (red) |
| `--color-player2-light` | `#f87171` | Player 2 highlights |
| `--color-player2-dim` | `#5f1e1e` | Player 2 subtle backgrounds |
| `--color-hex-default` | `#2a2a4a` | Default hex fill |
| `--color-hex-border` | `#3a3a5a` | Default hex border |
| `--color-hex-reachable` | `#2d5a27` | Reachable movement hexes (green glow) |
| `--color-hex-reachable-border` | `#4a9e3f` | Reachable hex border |
| `--color-hex-attack` | `#8b2020` | Attackable target hexes (red glow) |
| `--color-hex-attack-border` | `#d44444` | Attack hex border |
| `--color-hex-path` | `#3a6a9a` | Path preview hexes (blue trail) |
| `--color-hex-active` | `#c9a227` | Active stack's hex (gold ring) |
| `--color-hex-obstacle` | `#151525` | Obstacle hex fill (very dark) |
| `--color-hex-hover` | `#3a3a6a` | Hovered hex highlight |
| `--color-success` | `#22c55e` | Healing, positive effects |
| `--color-warning` | `#eab308` | Caution indicators |
| `--color-danger` | `#ef4444` | Damage, death, errors |
| `--color-damage-text` | `#ff6b6b` | Floating damage numbers |
| `--color-border-default` | `#333355` | Default borders |
| `--color-border-gold` | `#c9a227` | Gold borders on selected/active elements |

### Typography

| Token | Font Family | Weight | Size | Line Height | Usage |
|:---|:---|:---:|:---|:---:|:---|
| `--font-heading-xl` | 'Cinzel', serif | 700 | 28px | 1.2 | Game title, victory screen header |
| `--font-heading-lg` | 'Cinzel', serif | 600 | 22px | 1.3 | Panel titles ("Your Army", "Combat Log") |
| `--font-heading-md` | 'Cinzel', serif | 600 | 18px | 1.3 | Unit names, section labels |
| `--font-body` | 'Inter', sans-serif | 400 | 14px | 1.5 | Body text, descriptions, log entries |
| `--font-body-sm` | 'Inter', sans-serif | 400 | 12px | 1.4 | Captions, stat labels, tooltips |
| `--font-stat` | 'JetBrains Mono', monospace | 500 | 14px | 1.2 | Stat numbers, creature counts, damage |
| `--font-damage` | 'Inter', sans-serif | 800 | 24px | 1.0 | Floating damage numbers |
| `--font-creature-count` | 'Inter', sans-serif | 700 | 11px | 1.0 | Creature count badge on hexes |

**Google Fonts Import**:
```
Cinzel:wght@600;700
Inter:wght@400;500;700;800
JetBrains Mono:wght@500
```

### Spacing Scale

| Token | Value | Usage |
|:---|:---|:---|
| `--space-xs` | `4px` | Inline padding, icon gaps |
| `--space-sm` | `8px` | Inner component padding, tight gaps |
| `--space-md` | `12px` | Standard component padding |
| `--space-lg` | `16px` | Panel inner padding |
| `--space-xl` | `24px` | Section gaps, major component spacing |
| `--space-2xl` | `32px` | Panel margins, layout gaps |
| `--space-3xl` | `48px` | Page-level spacing |

### Border & Shadow

| Token | Value | Usage |
|:---|:---|:---|
| `--radius-sm` | `4px` | Buttons, inputs, badges |
| `--radius-md` | `8px` | Cards, panels |
| `--radius-lg` | `12px` | Modals, overlay panels |
| `--radius-hex` | `0px` | Hex cells (SVG, no border-radius) |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.4)` | Subtle elevation (badges, buttons) |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.5)` | Cards, side panels |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.6)` | Modals, victory overlay |
| `--shadow-glow-gold` | `0 0 12px rgba(201, 162, 39, 0.4)` | Active stack glow, gold highlights |
| `--shadow-glow-blue` | `0 0 10px rgba(59, 130, 246, 0.3)` | Player 1 stack glow |
| `--shadow-glow-red` | `0 0 10px rgba(239, 68, 68, 0.3)` | Player 2 stack glow |

---

## Section 3: Component Library Specification

### Component: `Button`

- **Purpose**: Primary interactive element for actions (Ready, Wait, Defend, Attack, New Game).
- **Variants**: `primary` (gold), `secondary` (outline), `danger` (red), `ghost` (transparent).
- **States**: Default, Hover (+10% brightness, slight scale), Active (pressed, scale down), Focus (gold ring), Disabled (50% opacity, no pointer events).

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Visual style |
| `disabled` | `boolean` | `false` | Whether button is interactive |
| `label` | `string` | — | Button text |
| `icon` | `string \| null` | `null` | Optional icon (e.g., ⚔️ for Attack) |

- **Visual Description**: `primary` — `--color-accent-gold` background, `--color-text-inverse` text, `--radius-sm` corners, `--font-body` text, `--space-sm` horizontal / `--space-xs` vertical padding. Height: 36px. `secondary` — transparent background, `--color-accent-gold` 1px border and text.
- **Interaction**: Hover: background lightens to `--color-accent-gold-hover`, `transform: scale(1.02)`. Active: `transform: scale(0.98)`. Focus: 2px `--color-accent-gold` outline offset 2px.

---

### Component: `HexCell`

- **Purpose**: Individual hexagonal cell on the battlefield grid. Rendered as an SVG `<polygon>`.
- **Variants**: `empty`, `occupied-player1`, `occupied-player2`, `obstacle`, `reachable`, `attackable`, `path`, `active`, `hovered`.
- **States**: Default, Hovered (brighten), Active stack (gold glow pulse).

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `coord` | `HexCoord` | — | Column and row position |
| `state` | `HexCellVariant` | `'empty'` | Current visual state |
| `occupant` | `Stack \| null` | `null` | Stack occupying this hex |
| `showPath` | `boolean` | `false` | Whether this hex is on the previewed path |

- **Visual Description**: Flat-top hex polygon. Fill changes based on variant: `empty` → `--color-hex-default`, `obstacle` → `--color-hex-obstacle` with diagonal hash pattern, `reachable` → `--color-hex-reachable` with soft green glow, `attackable` → `--color-hex-attack` with red pulse, `path` → `--color-hex-path`. Stroke: 1px `--color-hex-border`. Occupied hexes show the unit icon centered with a creature count badge at bottom-right.
- **Interaction**: Hover: stroke brightens, fill lightens 10%. Click on reachable: triggers movement. Click on attackable: triggers attack.

**Hex Sizing**: Each hex is 50px wide (flat-top). Height: ~43px. Gap between hexes: 2px.

---

### Component: `UnitCard`

- **Purpose**: Displays a unit type's stats. Used in the setup roster, info panel, and turn order bar.
- **Variants**: `full` (all stats visible), `compact` (icon + name + creature count only), `mini` (icon only, used in turn order).
- **States**: Default, Selected (gold border), Hovered (slight lift).

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `unitType` | `UnitType` | — | Unit data to display |
| `variant` | `'full' \| 'compact' \| 'mini'` | `'full'` | Display density |
| `selected` | `boolean` | `false` | Whether this card is selected |
| `playerColor` | `string \| null` | `null` | Player color border (for owned stacks) |
| `creatureCount` | `number \| null` | `null` | Creature count (if showing a stack) |

- **Visual Description** (`full`): Background `--color-bg-tertiary`, border 1px `--color-border-default`, `--radius-md`. Content: unit icon (32×32), name in `--font-heading-md --color-text-gold`, stat grid (2 columns: ATK/DEF/DMG/HP/SPD/INIT) in `--font-stat`. Selected: border changes to `--color-border-gold` 2px, `--shadow-glow-gold`.
- **Interaction**: Hover: `transform: translateY(-2px)`, `--shadow-md`. Click: toggles selection (in setup) or displays info (in battle).

---

### Component: `CreatureCountBadge`

- **Purpose**: Small badge overlay showing creature count on a hex or unit card.
- **Variants**: None.
- **States**: Default, Low (< 25% of original count → red tint).

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `count` | `number` | — | Current creature count |
| `maxCount` | `number` | — | Starting creature count (for low-health coloring) |

- **Visual Description**: Circular badge, 20px diameter, background `--color-bg-secondary`, border 1px `--color-border-gold`, `--font-creature-count` white text, centered. Positioned bottom-right of the hex or card. When `count / maxCount < 0.25`, background becomes `--color-danger`.

---

### Component: `TurnOrderBar`

- **Purpose**: Horizontal bar displaying the initiative queue at the top of the battle screen.
- **Variants**: None.
- **States**: Active stack highlighted with gold border and glow.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `entries` | `Stack[]` | — | Ordered list of stacks |
| `activeIndex` | `number` | — | Index of the currently active stack |

- **Visual Description**: Horizontal scroll container at the top. Background `--color-bg-secondary`, height 60px, `--shadow-md` bottom. Each entry is a `UnitCard` in `mini` variant (40×40 icon) with the player's color as border. Active entry has `--color-border-gold` 2px border and `--shadow-glow-gold`. Dead stacks are removed. Waiting stacks shown with 50% opacity until their deferred turn.

---

### Component: `InfoPanel`

- **Purpose**: Side panel showing detailed stats of the active or hovered stack.
- **Variants**: `active` (current turn's stack), `preview` (hovered/clicked stack).
- **States**: Default.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `stack` | `Stack \| null` | `null` | Stack to display |
| `mode` | `'active' \| 'preview'` | `'active'` | Whether this is the active stack or a preview |

- **Visual Description**: Fixed-width panel (240px) on the left side. Background `--color-bg-secondary`, border-right 1px `--color-border-default`. Contains: unit icon (48×48), unit name in `--font-heading-md --color-text-gold`, player name/color badge, stat grid (ATK, DEF, DMG, HP, SPD, INIT) in `--font-stat`, creature count in large `--font-heading-lg`, HP bar (green to red gradient based on percentage), remaining shots (for ranged units), defend/wait status indicators.
- **HP Bar**: Height 6px, background `--color-bg-primary`, fill gradient from `--color-success` (full) to `--color-danger` (low), rounded `--radius-sm`.

---

### Component: `ActionButtons`

- **Purpose**: Row of action buttons below the battlefield during a player's turn.
- **Variants**: None.
- **States**: Contextually enabled/disabled based on game state.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `canAttack` | `boolean` | — | Whether attack action is available |
| `canWait` | `boolean` | — | Whether wait action is available |
| `canDefend` | `boolean` | — | Whether defend action is available |
| `isRanged` | `boolean` | — | Whether active stack is ranged (shows shot count) |
| `remainingShots` | `number` | — | Shots remaining for ranged display |

- **Visual Description**: Horizontal row of `Button` components centered below the grid. Gap `--space-md`. Buttons: "⚔️ Attack" (danger variant, only if target selected), "⏳ Wait" (secondary variant), "🛡️ Defend" (secondary variant). Disabled buttons show 50% opacity.

---

### Component: `CombatLog`

- **Purpose**: Scrollable list of all combat actions in the current battle.
- **Variants**: None.
- **States**: Default, auto-scrolls to bottom on new entries.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `entries` | `CombatLogEntry[]` | — | All log entries |

- **Visual Description**: Fixed-width panel (260px) on the right side. Background `--color-bg-secondary`, border-left 1px `--color-border-default`. Header "Combat Log" in `--font-heading-lg --color-text-gold`. Entries displayed as `--font-body --color-text-secondary` text. Damage entries use `--color-danger`, kills use `--color-danger` bold, movement uses `--color-text-secondary`, defend/wait uses `--color-accent-gold`. Round separators as horizontal gold lines with round number.

---

### Component: `DamagePopup`

- **Purpose**: Floating damage number that appears above a stack when hit.
- **Variants**: `damage` (red), `kill` (red + skull icon).
- **States**: Animated — fades in, floats upward 30px, fades out.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `amount` | `number` | — | Damage dealt |
| `creaturesKilled` | `number` | 0 | Creatures killed |
| `position` | `{x: number, y: number}` | — | Screen position (center of target hex) |

- **Visual Description**: `--font-damage --color-damage-text`, text-shadow `0 0 8px rgba(255, 0, 0, 0.5)`. Shows "-{amount}" with optional "💀×{kills}" below in smaller text. Animates: `opacity 0→1→0` and `translateY(0→-30px)` over 1200ms with `ease-out`.

---

### Component: `Tooltip`

- **Purpose**: Small popup showing hex coordinates and stack info on hover.
- **Variants**: None.
- **States**: Visible/hidden.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `content` | `string` | — | Tooltip text |
| `position` | `{x: number, y: number}` | — | Screen position (near cursor) |

- **Visual Description**: Background `--color-bg-tertiary`, border 1px `--color-border-default`, `--radius-sm`, `--shadow-md`, `--font-body-sm --color-text-primary`, padding `--space-xs --space-sm`. Max-width 200px. Appears 200ms after hover, positioned 8px above cursor.

---

### Component: `PlayerBanner`

- **Purpose**: Indicator showing whose turn it is, displayed prominently during battle.
- **Variants**: `player1`, `player2`.
- **States**: Active (full opacity, glow), inactive (dimmed).

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `player` | `Player` | — | Player object |
| `isActive` | `boolean` | — | Whether it's this player's turn |

- **Visual Description**: Background gradient from player color to transparent, `--font-heading-md` white text, player name and "YOUR TURN" label when active. Width stretches across the top area near the turn order bar. Active state has `--shadow-glow-blue` or `--shadow-glow-red` pulsing border.

---

### Component: `NumberInput`

- **Purpose**: Creature count input during army setup.
- **Variants**: None.
- **States**: Default, Focused (gold border), Error (red border), Disabled.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `value` | `number` | 1 | Current value |
| `min` | `number` | 1 | Minimum value |
| `max` | `number` | 99 | Maximum value |
| `label` | `string` | — | Input label |

- **Visual Description**: Width 80px, height 36px. Background `--color-bg-tertiary`, border 1px `--color-border-default`, `--radius-sm`, `--font-stat` text, text-align center. Focus: border `--color-border-gold`. Includes +/- stepper buttons on sides.

---

### Component: `VictoryOverlay`

- **Purpose**: Full-screen overlay displayed when a player wins.
- **Variants**: None.
- **States**: Animated entrance.

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `summary` | `BattleSummary` | — | Battle results data |

- **Visual Description**: Full-screen semi-transparent overlay (`rgba(0, 0, 0, 0.8)`). Centered card: background `--color-bg-secondary`, `--radius-lg`, `--shadow-lg`, max-width 500px. Header: "VICTORY!" in `--font-heading-xl --color-text-gold` with gold glow. Winner name in player color. Summary table: surviving stacks, creatures remaining, rounds played, total damage. "New Game" button (primary variant) at bottom. Entrance animation: scale 0.8→1, opacity 0→1, 300ms ease-out.

---

## Section 4: Responsive Design

### Breakpoints

| Name | Min Width | Layout Changes |
|:---|:---|:---|
| `desktop` | `1280px` | Full layout: left info panel + center hex grid + right combat log. All panels visible. |
| `compact` | `1024px` | Info panel collapses to a narrow bar (icons only). Combat log becomes a toggleable overlay. Hex grid shrinks slightly. |
| `minimum` | `0px` | Below 1024px: "Best viewed on desktop" message displayed. Game still functional but layout may overflow. |

**Primary target**: 1280px and above. Per NFR Section 7, mobile is not a priority. The game is designed for desktop with a mouse.

---

## Section 5: Animation & Transition Rules

| Animation | Property | Duration | Easing | Trigger |
|:---|:---|:---|:---|:---|
| Button hover | `background-color`, `transform` | `150ms` | `ease-out` | Mouse enter |
| Button press | `transform` | `100ms` | `ease-in` | Mouse down |
| Hex hover | `fill`, `stroke` | `100ms` | `ease-out` | Mouse enter on hex |
| Stack movement | `transform` (translateX/Y) | `300ms` per hex | `ease-in-out` | Movement action executed |
| Melee attack | `transform` (lunge toward target + return) | `400ms` | `ease-in-out` | Melee attack executed |
| Ranged attack | `transform` (projectile from attacker to target) | `500ms` | `linear` | Ranged attack executed |
| Retaliation attack | `transform` (lunge) | `400ms` | `ease-in-out` | Retaliation triggered (200ms delay after initial attack) |
| Damage popup | `opacity` (0→1→0), `transform` (translateY 0→-30px) | `1200ms` | `ease-out` | Damage applied to stack |
| Stack death | `opacity` (1→0), `transform` (scale 1→0.5) | `600ms` | `ease-in` | Creature count reaches 0 |
| Turn transition | `opacity` (old→0, new→1) | `200ms` | `ease-in-out` | Active stack changes |
| Active stack pulse | `box-shadow` (glow intensity oscillation) | `1500ms` (infinite loop) | `ease-in-out` | Stack becomes active |
| Victory overlay entrance | `opacity` (0→1), `transform` (scale 0.8→1) | `300ms` | `ease-out` | Game ends |
| Path preview | `fill` (sequential hex highlight) | `50ms` per hex | `linear` | Hover on reachable hex |
| Card hover lift | `transform` (translateY -2px), `box-shadow` | `200ms` | `ease-out` | Mouse enter on unit card |
| Reachable hex pulse | `opacity` (0.6→1.0 oscillation) | `2000ms` (infinite) | `ease-in-out` | Reachable hexes highlighted |

---

## Section 6: Accessibility

### Color Contrast

- Primary text (`#e8e6e3`) on primary background (`#1a1a2e`): ratio ~13:1 ✅ (exceeds WCAG AAA)
- Gold text (`#d4a853`) on primary background (`#1a1a2e`): ratio ~6:1 ✅ (meets WCAG AA)
- Secondary text (`#a0a0b0`) on secondary background (`#16213e`): ratio ~5:1 ✅ (meets WCAG AA)
- Damage text (`#ff6b6b`) on hex background (`#2a2a4a`): ratio ~4.5:1 ✅ (meets WCAG AA)
- Player blue (`#3b82f6`) on dark background: ratio ~4.5:1 ✅
- Player red (`#ef4444`) on dark background: ratio ~4.5:1 ✅

### Focus Indicators

All interactive elements (buttons, hex cells, unit cards, inputs) display a visible focus ring:
- Style: `outline: 2px solid var(--color-accent-gold); outline-offset: 2px;`
- Focus ring is always visible, never hidden by other elements.

### Keyboard Navigation

- **Tab order**: Follows visual flow — turn order bar → info panel → hex grid → action buttons → combat log.
- **Hex grid**: Arrow keys navigate between hexes. Enter/Space selects the focused hex (triggers movement or attack).
- **Action buttons**: Standard tab + Enter/Space activation.
- **Setup screen**: Tab through unit cards → Enter to select → Tab to creature count input → Tab to Ready button.

### ARIA Requirements

- Hex grid container: `role="grid"`, `aria-label="Battlefield"`.
- Each hex: `role="gridcell"`, `aria-label` describing occupant (e.g., "Hex 5,3: Player 1 Pikeman, 10 creatures") or "Empty hex 5,3" or "Obstacle".
- Turn order bar: `role="list"`, `aria-label="Turn order"`. Active item: `aria-current="true"`.
- Combat log: `role="log"`, `aria-live="polite"` — new entries announced to screen readers.
- Damage popups: `aria-live="assertive"` — damage announcements read immediately.
- Action buttons: `aria-disabled="true"` when disabled.

---

## Section 7: Page-by-Page Layout Specifications

### Page: Setup Screen

- **Purpose**: Players select their armies before battle.
- **URL/Route**: `/` (default state: `SETUP → PLAYER1_PICKING → PLAYER2_PICKING`)
- **Layout Structure**:

```text
+------------------------------------------------------------------+
|                     "HoMM3 BATTLE SIM"                           |
|                   [Player X - Pick Your Army]                     |
+------------------------------------------------------------------+
|                                                                  |
|  +------------------+  +------------------+  +------------------+|
|  |   [UnitCard]     |  |   [UnitCard]     |  |   [UnitCard]     ||
|  |   Pikeman        |  |   Archer         |  |   Griffin        ||
|  |   Full Stats     |  |   Full Stats     |  |   Full Stats     ||
|  +------------------+  +------------------+  +------------------+|
|  +------------------+  +------------------+  +------------------+|
|  |   [UnitCard]     |  |   [UnitCard]     |  |   [UnitCard]     ||
|  |   Swordsman      |  |   Monk           |  |   Cavalier       ||
|  |   Full Stats     |  |   Full Stats     |  |   Full Stats     ||
|  +------------------+  +------------------+  +------------------+|
|                                                                  |
+------------------------------------------------------------------+
|                     YOUR ARMY                                    |
|  +--------------------+  +--------------------+  +--------------+|
|  | Slot 1: [UnitCard] |  | Slot 2: [UnitCard] |  | Slot 3: ... ||
|  | [NumberInput: qty] |  | [NumberInput: qty] |  | [NumberInput]||
|  +--------------------+  +--------------------+  +--------------+|
+------------------------------------------------------------------+
|   [Button: Default Army]          [Button: Ready ✓]              |
+------------------------------------------------------------------+
```

- **Components Used**: `UnitCard` (full + compact), `NumberInput`, `Button` (primary, secondary), `PlayerBanner`.
- **Data Displayed**: All 6 unit types from `UNIT_ROSTER`. Selected units in army slots with creature counts.
- **User Actions**: Click unit card to add to army → set creature count → click Ready. Or click Default Army.

---

### Page: Battle Screen

- **Purpose**: The main combat view where players take turns fighting.
- **URL/Route**: `/` (state: `BATTLE`)
- **Layout Structure**:

```text
+------------------------------------------------------------------+
|  [PlayerBanner: P1]  [TurnOrderBar]  [PlayerBanner: P2]         |
+------------------------------------------------------------------+
|  [InfoPanel] |           [HexGrid]            |   [CombatLog]   |
|   240px      |          15×11 hexes            |     260px       |
|              |                                 |                  |
|   Active     |    (SVG hex grid with           |   Round 3        |
|   Stack      |     units, obstacles,           |   Pikeman moves  |
|   Stats      |     highlights)                 |   to (5,3)       |
|              |                                 |   Archer shoots  |
|   ATK: 8     |                                 |   Swordsman      |
|   DEF: 8     |                                 |   -16 damage     |
|   DMG: 3-6   |                                 |                  |
|              |                                 |                  |
+------------------------------------------------------------------+
|              [ActionButtons: Attack | Wait | Defend]             |
|              [Round: 3]                                          |
+------------------------------------------------------------------+
```

- **Components Used**: `HexGrid` (containing `HexCell` × 165), `TurnOrderBar`, `InfoPanel`, `ActionButtons`, `CombatLog`, `PlayerBanner`, `DamagePopup`, `Tooltip`, `CreatureCountBadge`.
- **Data Displayed**: Full battlefield state, active stack stats, turn order queue, combat log history, round counter, action availability.
- **User Actions**: Click hex to move, click enemy to attack, click Wait, click Defend. Hover for tooltips and path preview.

---

### Page: Victory Screen

- **Purpose**: Display the battle result and allow restart.
- **URL/Route**: `/` (state: `FINISHED`)
- **Layout Structure**:

```text
+------------------------------------------------------------------+
|  (Battle screen dimmed in background)                            |
|                                                                  |
|           +--------------------------------------+               |
|           |         ⚔️ VICTORY! ⚔️              |               |
|           |                                      |               |
|           |     Player 1 wins the battle!        |               |
|           |                                      |               |
|           |  Surviving Forces:                   |               |
|           |    Griffin × 4 (HP: 18/25)           |               |
|           |    Swordsman × 2 (HP: 35/35)         |               |
|           |                                      |               |
|           |  Battle Duration: 7 Rounds           |               |
|           |  Total Damage: P1: 342  P2: 198      |               |
|           |                                      |               |
|           |     [Button: ⚔️ New Game]            |               |
|           +--------------------------------------+               |
|                                                                  |
+------------------------------------------------------------------+
```

- **Components Used**: `VictoryOverlay`, `Button` (primary), `UnitCard` (compact, for surviving stacks).
- **Data Displayed**: Winner name + color, surviving stacks with creature counts and HP, total rounds, damage totals per player.
- **User Actions**: Click "New Game" to return to setup.
