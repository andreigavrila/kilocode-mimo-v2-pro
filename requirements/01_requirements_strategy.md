# 01 — Requirements & Strategy: HoMM3 Battle Simulation

## Section 1: Project Scope & Type

### Classification

**Browser Game** — A single-page web application that faithfully recreates the tactical battle layer of Heroes of Might and Magic 3 (HoMM3), scoped to Player-vs-Player hotseat combat with 3 unit stacks per side.

### Scope Statement

This project delivers a web-based, turn-based tactical battle simulator inspired by the combat system of Heroes of Might and Magic 3. Two human players share the same browser window (hotseat mode) and take turns commanding their armies on a hex-based battlefield. Each player controls exactly 3 unit stacks. The game implements the core HoMM3 combat loop: initiative-based turn order, hex movement with pathfinding, melee attacks, ranged attacks, damage calculation, retaliation, and win/loss detection. The project does NOT include the adventure map, hero progression, magic spells, siege warfare, or any other systems outside the tactical battle layer.

### Scale — Minimum Viable First Version

- A single battle screen with a hex grid battlefield.
- Two players (Player 1 and Player 2) each deploy 3 pre-configured unit stacks.
- Unit selection from a curated roster of at least 6 distinct unit types (covering melee, ranged, and varied stat profiles).
- Full turn-based combat loop with initiative ordering, movement, attack, retaliation, and death.
- Victory/defeat detection when one side's stacks are all eliminated.
- A "New Game" option to restart with fresh unit selection.

---

## Section 2: Target Audience

| Persona | Description | Key Needs | Pain Points |
|:---|:---|:---|:---|
| **Nostalgic HoMM Fan** | A player who grew up with HoMM3 and wants a quick, accessible way to relive the tactical combat experience. Ages 25-45, familiar with turn-based strategy. | Faithful recreation of the battle feel; recognizable mechanics (hex grid, initiative, retaliation); quick setup without installing the full game. | Original game requires installation and configuration (especially on modern OS); no easy way to play a quick PvP battle without full campaign setup. |
| **Casual Strategy Gamer** | A player who enjoys tactical combat games in the browser. May or may not know HoMM3 specifically. Ages 18-40. | Clean, intuitive UI; easy to learn rules; fun PvP experience in the browser with a friend. | Many browser strategy games are either too simple (no depth) or too complex (steep learning curve with too many systems). |
| **Tabletop / Hotseat Enthusiast** | Someone who enjoys shared-screen local multiplayer experiences. Plays board games or hotseat PC games regularly. | Smooth hotseat flow (clear turn transitions); readable game state so both players can follow along on one screen. | Few modern web games support hotseat PvP; most require accounts and online matchmaking. |

---

## Section 3: Core Value Proposition

### Main Problem Being Solved

There is no lightweight, browser-based way to play a quick HoMM3-style tactical PvP battle. To play HoMM3 combat today, you need the full game installed and must navigate adventure maps, hero management, and AI opponents before reaching a PvP clash.

### Why Use This Over Existing Alternatives?

- **Zero install**: Runs in any modern browser — no downloads, no configuration.
- **Focused scope**: Pure battle experience without the overhead of the adventure map, economy, or campaign.
- **Instant PvP**: Two players can start fighting within seconds by selecting their 3 unit stacks each.
- **Faithful mechanics**: Implements the actual HoMM3 combat rules (initiative turn order, hex movement, melee/ranged attacks, retaliation, damage formulas) rather than a simplified approximation.

### Unique Differentiator

A browser-native, faithful HoMM3 tactical combat simulator purpose-built for quick hotseat PvP battles — nothing more, nothing less.

---

## Section 4: Competitor Analysis

| Competitor | Description | Strengths | Weaknesses | Pricing Model |
|:---|:---|:---|:---|:---|
| **HoMM3 (Original / HD Mod / HotA)** | The original game and its community mods. Full game with adventure map, heroes, towns, campaigns. | Complete, deep game experience; massive community; authentic. | Requires installation; no quick-battle PvP without setup; dated UI; not browser-based. | Paid (GOG/Steam) + free mods. |
| **HoMM3 Online (fan projects)** | Various fan-made browser recreations of HoMM3, most incomplete or inactive. | Some attempt faithful recreation. | Typically abandoned, buggy, incomplete, or focused on the adventure map rather than pure battle. | Free. |
| **VCMI Project** | Open-source HoMM3 engine reimplementation. | Full game engine; moddable; active community. | Desktop-only; complex setup; not scoped for quick battles. | Free / Open source. |
| **Generic browser strategy games (e.g., Wesnoth web ports)** | Other turn-based strategy games playable in browser. | Accessible; some support PvP. | Different mechanics; not HoMM3-flavored; different grid systems (square vs hex). | Free. |

**How this project differentiates**: None of the above offer a lightweight, browser-based, HoMM3-combat-only PvP experience. This project fills that specific niche.

---

## Section 5: Glossary / Domain Model

| Term | Definition | Related Terms |
|:---|:---|:---|
| **Battlefield** | The hex-based grid where combat takes place. Standard size is 15 columns × 11 rows. | Hex, Grid |
| **Hex** | A single hexagonal cell on the battlefield. Each hex has a column and row coordinate. A hex can be empty, occupied by a stack, or contain an obstacle. | Battlefield, Obstacle |
| **Obstacle** | A hex that is impassable. Stacks cannot move through or occupy obstacle hexes. Obstacles are placed on the battlefield at the start of a battle. | Hex, Battlefield |
| **Stack** | A group of identical units fighting as one entity on the battlefield. A stack has a unit type, a creature count, and current HP for the top creature. Each player controls exactly 3 stacks. | Unit Type, Creature Count |
| **Unit Type** | The species/class of creatures in a stack (e.g., Pikeman, Archer, Griffin). Defines base stats: Attack, Defense, Damage range, HP, Speed, Initiative, and whether the unit is melee or ranged. | Stack, Stats |
| **Creature Count** | The number of individual creatures alive in a stack. When a stack takes damage, creatures die one by one (damage is applied to the top creature's remaining HP, with overflow killing additional creatures). | Stack, HP |
| **Attack (stat)** | Offensive stat of a unit type. Higher attack relative to defender's defense increases damage dealt. | Defense, Damage Formula |
| **Defense (stat)** | Defensive stat of a unit type. Higher defense relative to attacker's attack reduces damage taken. | Attack, Damage Formula |
| **Damage Range** | The minimum and maximum base damage a single creature in a stack can deal per attack. Actual damage is randomized within this range, then multiplied by creature count and modified by attack/defense differential. | Damage Formula, Attack |
| **HP (Hit Points)** | The health of each individual creature in a stack. The top creature in a stack may have partial HP; all others are at full HP. When a creature's HP reaches 0, it dies and creature count decreases by 1. | Creature Count, Stack |
| **Speed** | Determines how many hexes a stack can move in a single turn. A stack with Speed 6 can move up to 6 hexes along a valid path. | Movement, Hex, Pathfinding |
| **Initiative** | Determines the order in which stacks take their turns within a round. Higher initiative acts first. If two stacks have equal initiative, Player 1's stack acts first. | Turn Order, Round |
| **Turn** | A single stack's opportunity to act (move, attack, wait, or defend) during a round. | Round, Action |
| **Round** | One full cycle where every living stack has had exactly one turn. A new round begins after all stacks have acted. | Turn, Initiative |
| **Turn Order Queue** | The sequence in which stacks act during a round, sorted by initiative (descending). Displayed visually so both players can see upcoming turns. | Initiative, Round |
| **Active Stack** | The stack whose turn it currently is. The active stack is highlighted on the battlefield and in the turn order queue. | Turn, Stack |
| **Movement** | The act of relocating a stack from one hex to another. Movement uses A* pathfinding on the hex grid, respecting obstacles and occupied hexes. A stack can move up to its Speed value in hexes per turn. | Speed, Pathfinding, Hex |
| **Pathfinding** | The algorithm (A*) used to calculate the shortest valid path between two hexes, avoiding obstacles and occupied hexes. | Movement, Obstacle |
| **Melee Attack** | An attack performed by a stack on an adjacent (neighboring) hex. After a melee attack, the defender retaliates (if able). | Ranged Attack, Retaliation, Adjacent Hex |
| **Ranged Attack** | An attack performed by a ranged unit type on a non-adjacent target. Ranged stacks have a limited supply of ammunition (shots). When ammunition is depleted, the ranged stack must resort to melee attacks. Ranged attacks do not trigger retaliation. | Melee Attack, Ammunition, Shots |
| **Ammunition / Shots** | The number of ranged attacks a ranged stack can perform before it must switch to melee. Each ranged unit type has a defined number of shots. | Ranged Attack |
| **Retaliation** | After being attacked in melee, the defending stack automatically counter-attacks the attacker. Each stack can retaliate only once per round. Once a stack has retaliated, subsequent melee attacks against it in the same round do not trigger retaliation. | Melee Attack, Round |
| **Damage Formula** | The calculation used to determine actual damage dealt: `Base Damage = random(min_dmg, max_dmg) × creature_count`. Modified by attack/defense differential: if Attack > Defense, damage is increased by `+5% per point of difference` (capped at +300%). If Defense > Attack, damage is reduced by `-2.5% per point of difference` (capped at -70%). | Attack, Defense, Damage Range, Creature Count |
| **Wait** | An action where the active stack defers its turn to act later in the round. The stack is placed at the end of the current round's turn order. | Turn, Action |
| **Defend** | An action where the active stack skips its turn and gains a defensive bonus (+20% effective Defense) until its next turn. | Turn, Action, Defense |
| **Adjacent Hex** | A hex that directly neighbors another hex. On a hex grid, each hex has up to 6 neighbors. | Hex, Melee Attack |
| **Hotseat** | A multiplayer mode where two players share the same screen and input device, taking turns. | Player 1, Player 2 |
| **Player 1 / Player 2** | The two human participants in a battle. Player 1's stacks start on the left side of the battlefield; Player 2's stacks start on the right side. | Hotseat, Stack |
| **Unit Roster** | The curated list of all available unit types that players can choose from when building their army of 3 stacks. | Unit Type, Stack |
| **Army Setup** | The pre-battle phase where each player selects 3 unit types and assigns creature counts for each stack. | Stack, Unit Roster, Creature Count |
| **Victory Condition** | A player wins when all 3 of the opponent's stacks have been eliminated (creature count reaches 0 for all). | Creature Count, Stack |

---

## Section 6: Deliverables (Epics & Stories)

### [EPIC-GRID-01] — Hex Battlefield Grid
**Description**: Render an interactive hex grid that serves as the battlefield. Display hex coordinates, support highlighting, and handle hex click/hover interactions.
**Priority**: P0 (must-have for MVP)
**Complexity**: Medium

**User Stories**:
1. As a **player**, I want to see a hex grid battlefield of 15×11 hexes so that I have a clear playing field for combat.
2. As a **player**, I want to see the active stack's valid movement hexes highlighted so that I know where I can move.
3. As a **player**, I want to click on a highlighted hex to move my active stack there so that I can reposition my units.
4. As a **player**, I want to see obstacle hexes visually distinct (e.g., rocks, trees) so that I know which hexes are impassable.
5. As a **player**, I want to hover over a hex to see its coordinates and any occupying stack's info so that I can plan my moves.
6. As a **player**, I want to see the shortest path previewed when I hover over a valid movement hex so that I know the exact route my stack will take.

---

### [EPIC-UNITS-02] — Unit Types & Roster
**Description**: Define a roster of at least 6 distinct unit types with varied stats, covering melee and ranged archetypes. Display unit stats clearly.
**Priority**: P0 (must-have for MVP)
**Complexity**: Medium

**User Stories**:
1. As a **player**, I want to choose from at least 6 different unit types so that I have meaningful army composition decisions.
2. As a **player**, I want each unit type to have distinct stats (Attack, Defense, Damage, HP, Speed, Initiative) so that each unit feels unique.
3. As a **player**, I want at least 2 of the unit types to be ranged so that I can include ranged attackers in my army.
4. As a **player**, I want to see a unit's full stat card (all stats, abilities, damage range) when I select or hover over it so that I can make informed choices.
5. As a **player**, I want unit types to have distinct visual representations on the battlefield so that I can quickly identify which units are which.

---

### [EPIC-SETUP-03] — Army Setup / Pre-Battle Phase
**Description**: Implement the pre-battle screen where each player selects 3 unit stacks, chooses unit types from the roster, and assigns creature counts.
**Priority**: P0 (must-have for MVP)
**Complexity**: Medium

**User Stories**:
1. As **Player 1**, I want to select 3 unit types from the roster for my army so that I can build my battle force.
2. As **Player 2**, I want to select 3 unit types from the roster for my army so that I can build my battle force (independently of Player 1's choices).
3. As a **player**, I want to assign creature counts to each of my 3 stacks so that I can decide how many creatures per stack.
4. As a **player**, I want to see a summary of my army (unit types, counts, total stats) before confirming so that I can review my choices.
5. As a **player**, I want a "Ready" button to confirm my army selection so that the game knows I'm done setting up.
6. As a **player**, I want the game to prevent me from starting with fewer than 3 stacks so that the battle rules are enforced.
7. As a **player**, I want a predefined default army option so that I can start a battle quickly without manually selecting units.

---

### [EPIC-COMBAT-04] — Core Combat Loop
**Description**: Implement the full turn-based combat loop: initiative-based turn ordering, movement, melee attack, ranged attack, damage calculation, retaliation, wait, defend, and end-of-round cycling.
**Priority**: P0 (must-have for MVP)
**Complexity**: High

**User Stories**:
1. As a **player**, I want stacks to act in initiative order (highest first) so that faster units have a tactical advantage.
2. As a **player**, I want to move my active stack up to its Speed stat in hexes so that I can reposition on the battlefield.
3. As a **player**, I want to attack an adjacent enemy stack with a melee attack so that I can deal damage.
4. As a **player**, I want damage to be calculated using the HoMM3 damage formula (base damage × creature count, modified by attack/defense differential) so that combat feels authentic.
5. As a **player**, I want my stack to automatically retaliate when attacked in melee so that defenders aren't passive.
6. As a **player**, I want each stack to retaliate only once per round so that ganging up on a stack is a valid tactic.
7. As a **player**, I want ranged stacks to attack enemies from any distance (without adjacency requirement) so that they have a ranged advantage.
8. As a **player**, I want ranged stacks to consume one shot per ranged attack so that ammunition is a meaningful resource.
9. As a **player**, I want ranged stacks that have exhausted their shots to switch to melee attacks so that they remain functional.
10. As a **player**, I want to choose "Wait" to defer my stack's turn to the end of the current round so that I can time my actions strategically.
11. As a **player**, I want to choose "Defend" to skip my stack's turn and gain a +20% defense bonus until the next turn so that I can protect vulnerable stacks.
12. As a **player**, I want to move AND attack in the same turn (move to an adjacent hex, then melee attack) so that movement and combat are combined.
13. As a **player**, I want creatures to die one-by-one as damage depletes individual HP so that stack attrition is gradual and visible.
14. As a **player**, I want to see the damage dealt and creatures killed after each attack so that I understand the impact of each action.
15. As a **player**, I want a new round to start automatically after all stacks have acted so that combat flows continuously.

---

### [EPIC-TURNORDER-05] — Turn Order & Queue Display
**Description**: Display the current round's turn order queue visually, showing which stack acts next and the full sequence.
**Priority**: P0 (must-have for MVP)
**Complexity**: Low

**User Stories**:
1. As a **player**, I want to see the turn order queue displayed clearly on the screen so that I know which stack acts next.
2. As a **player**, I want the active stack to be highlighted in the turn order queue so that it's obvious whose turn it is.
3. As a **player**, I want the turn order queue to update when a stack waits, dies, or a new round begins so that the queue is always accurate.
4. As a **player**, I want to see each stack's unit icon and player ownership in the queue so that I can distinguish my stacks from my opponent's.

---

### [EPIC-PATHFINDING-06] — Hex Pathfinding
**Description**: Implement A* pathfinding on the hex grid to calculate valid movement paths, respecting obstacles and occupied hexes.
**Priority**: P0 (must-have for MVP)
**Complexity**: Medium

**User Stories**:
1. As a **player**, I want my stack to navigate around obstacles automatically so that I don't have to micromanage pathing.
2. As a **player**, I want movement to use the shortest valid path so that my stack doesn't waste speed on suboptimal routes.
3. As a **player**, I want occupied hexes (by friendly or enemy stacks) to be impassable so that stacks cannot overlap.
4. As a **player**, I want to see unreachable hexes (beyond speed range or blocked) as non-highlighted so that I know where I cannot go.

---

### [EPIC-VICTORY-07] — Victory & Defeat Detection
**Description**: Detect when all of one player's stacks are eliminated and declare the other player the winner. Display a victory/defeat screen.
**Priority**: P0 (must-have for MVP)
**Complexity**: Low

**User Stories**:
1. As a **player**, I want the game to end immediately when all of one player's stacks are dead so that there are no meaningless turns.
2. As a **player**, I want to see a clear victory screen declaring the winner so that the outcome is unambiguous.
3. As a **player**, I want to see a battle summary (surviving stacks, creatures remaining, total damage dealt) on the victory screen so that I can review the battle.
4. As a **player**, I want a "New Game" button on the victory screen to return to army setup so that I can play again.

---

### [EPIC-UI-08] — Battle UI & Information Panels
**Description**: Build the surrounding UI elements: stack info panel, action buttons, player labels, round counter, combat log.
**Priority**: P0 (must-have for MVP)
**Complexity**: Medium

**User Stories**:
1. As a **player**, I want to see the active stack's full stats (Attack, Defense, HP, Damage, Speed, creature count) in an info panel so that I know my stack's capabilities.
2. As a **player**, I want to see enemy stack info when I hover or click on them so that I can evaluate threats.
3. As a **player**, I want action buttons (Move, Attack, Wait, Defend) clearly visible during my turn so that I know my available actions.
4. As a **player**, I want a combat log that records every action (move, attack, damage, kills, retaliation) so that I can review what happened.
5. As a **player**, I want a round counter displayed so that I can track the battle's progression.
6. As a **player**, I want clear visual indicators for which player's turn it is (e.g., player name, color-coded border) so that hotseat turn transitions are seamless.
7. As a **player**, I want creature count displayed on each stack's hex (as a number badge) so that I can see stack strength at a glance.

---

### [EPIC-VISUALS-09] — Visual Polish & Animations
**Description**: Add animations for movement, attacks, damage, and death to make combat visually engaging.
**Priority**: P1 (important)
**Complexity**: Medium

**User Stories**:
1. As a **player**, I want to see stacks animate when moving from hex to hex so that movement feels smooth rather than teleporting.
2. As a **player**, I want to see an attack animation when a stack strikes an enemy so that combat feels impactful.
3. As a **player**, I want to see damage numbers appear on hit so that I can immediately see how much damage was dealt.
4. As a **player**, I want to see a death animation when a stack is fully eliminated so that it's clear the stack has been destroyed.
5. As a **player**, I want to see a retaliation animation that is distinct from a normal attack so that I can distinguish retaliations from attacks.

---

## Section 7: Scope Exclusions

- ❌ **Adventure Map**: No overworld exploration, towns, resource gathering, or map movement. This project is purely the battle layer.
- ❌ **Hero Units**: No hero characters on the battlefield. No hero stats, no hero abilities, no hero leveling.
- ❌ **Magic / Spells**: No spellcasting during combat. No mana, no spellbooks, no spell effects.
- ❌ **Special Unit Abilities**: No unit-specific special abilities (e.g., Dragon breath, Medusa petrify, Angel resurrection). All units follow the same basic melee/ranged attack model.
- ❌ **Siege Warfare**: No castle walls, gates, towers, or moat mechanics.
- ❌ **AI Opponents**: No computer-controlled opponent. Both sides are controlled by human players in hotseat mode.
- ❌ **Online Multiplayer**: No networking, no matchmaking, no server-side play. Hotseat only.
- ❌ **Persistent Progress**: No save/load functionality, no player profiles, no progression systems.
- ❌ **Sound / Music**: No audio in the MVP. Sound effects and music are out of scope for the initial version.
- ❌ **Mobile-Optimized Layout**: The game targets desktop browsers. Responsive/mobile layout is not a priority.
- ❌ **Morale & Luck Systems**: No morale or luck mechanics from the original HoMM3.
- ❌ **Terrain Effects**: No terrain types that alter movement cost or combat stats.
- ❌ **Two-Hex Units**: No large (2-hex) creatures. All unit types occupy a single hex.
- ❌ **Ranged Penalty**: No half-damage penalty for ranged attacks at close range or through walls (simplified ranged model).

---

## Section 8: Decision Log

| Decision ID | Decision | Alternatives Considered | Rationale |
|:---|:---|:---|:---|
| `[DECISION-01]` | Limit each player to exactly 3 unit stacks. | Allow flexible army sizes (1-7 stacks as in original HoMM3). | Keeps the scope manageable and battles fast. 3 stacks provide enough tactical depth without overwhelming the UI or combat duration. |
| `[DECISION-02]` | Use the HoMM3 damage formula with attack/defense differential modifiers. | Simplified flat damage; percentage-based HP systems. | Faithfulness to HoMM3 mechanics is a core value proposition. The formula is well-documented and creates meaningful stat interactions. |
| `[DECISION-03]` | Battlefield size fixed at 15×11 hexes. | Smaller grids (10×8); dynamic/configurable size. | 15×11 matches the original HoMM3 battlefield size and provides enough space for 6 stacks to maneuver tactically. |
| `[DECISION-04]` | No special unit abilities in MVP. | Include a few iconic abilities (flying, two-hex attack). | Special abilities significantly increase complexity in both the engine and UI. The MVP focuses on core combat mechanics; abilities can be added in a future iteration. |
| `[DECISION-05]` | Hotseat-only multiplayer. | WebSocket-based online play; AI opponents. | Hotseat is the simplest multiplayer model to implement and aligns with the "quick local PvP" value proposition. Online play and AI are significant engineering efforts best reserved for future versions. |
| `[DECISION-06]` | Retaliation limited to once per round per stack. | Unlimited retaliation; no retaliation. | Matches original HoMM3 rules and creates tactical depth — players must consider whether a target has already retaliated this round. |
| `[DECISION-07]` | No two-hex (large) creatures. All units occupy one hex. | Support two-hex units for dragons, hydras, etc. | Two-hex units add significant pathfinding and collision complexity. Single-hex units simplify the grid logic while still supporting a diverse unit roster. |
| `[DECISION-08]` | Player 1 always acts first on initiative ties. | Random tiebreaker; alternating tiebreaker. | Deterministic tiebreaking is simpler to implement and reason about. The advantage is minimal since players alternate who is "Player 1" between games. |
| `[DECISION-09]` | Include "Wait" and "Defend" as combat actions. | Only Move and Attack; additional actions like Flee/Surrender. | Wait and Defend add meaningful tactical choices that are core to HoMM3 combat without significant implementation overhead. Flee/Surrender is less meaningful in a PvP hotseat context. |
| `[DECISION-10]` | Ranged stacks fall back to melee when out of ammunition. | Ranged stacks become unable to attack; unlimited ammunition. | Matches original HoMM3 behavior and creates an interesting resource management dynamic for ranged units. |
