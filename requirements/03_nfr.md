# 03 — Non-Functional Requirements: HoMM3 Battle Simulation

> **Inputs**: [01_requirements_strategy.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/01_requirements_strategy.md), [02_functional_design.md](file:///c:/Projects/ai-builder-platform/.agents/blueprints/homm3-battle-sim/02_functional_design.md)

---

## Section 1: Performance & Scalability

| Metric | Target | Measurement Method | Rationale |
|:---|:---|:---|:---|
| Initial page load (LCP) | < 2.0 seconds | Lighthouse audit | Browser game must load fast to retain players. No heavy backend; assets are minimal (SVG/CSS-based units, no large sprites). Target aligns with "Good" LCP threshold. |
| Time to Interactive (TTI) | < 2.5 seconds | Lighthouse audit | Game must be playable almost immediately. No complex initialization beyond rendering the setup screen. |
| Cumulative Layout Shift (CLS) | < 0.05 | Lighthouse audit | The hex grid and UI panels must not shift during load. Fixed layout ensures stability. |
| First Input Delay (FID) | < 50 ms | Manual testing / event timing | Click interactions (hex selection, button presses) must feel instant. No heavy computation blocks the main thread. |
| JS bundle size (gzipped) | < 200 KB | Build output (`npm run build`) | No backend, no heavy libraries. Framework + game logic + rendering should be compact. |
| A* pathfinding execution | < 5 ms for 15×11 grid (165 hexes) | Performance.now() benchmarks | Pathfinding runs on every hover (path preview) and click (movement). Must be imperceptible. On a 165-hex grid, A* completes in microseconds. |
| Damage calculation | < 1 ms | Performance.now() benchmarks | Simple formula with no iteration beyond creature kill counting. Negligible computation. |
| Reachable hexes calculation | < 5 ms | Performance.now() benchmarks | BFS over at most ~50 hexes (max speed 7). Trivially fast. |
| Turn order computation | < 1 ms | Performance.now() benchmarks | Sorting 6 stacks by one field. |
| Animation frame rate | 60 FPS during animations | Browser DevTools Performance tab | Movement and attack animations must be smooth. CSS transitions/animations or requestAnimationFrame should maintain 60 FPS. |
| Concurrent users supported | 1 (single browser tab) | N/A | Hotseat game — only one browser instance needed. No server, no concurrency concerns. |

**Scaling Strategy**: This is a purely client-side application with no server component. There is no user scaling concern. If the project later adds online multiplayer, a WebSocket server with room-based architecture would be needed, but that is explicitly out of scope.

---

## Section 2: Availability & Reliability

| Metric | Target |
|:---|:---|
| Uptime SLA | N/A — purely client-side, no server |
| RPO (Recovery Point Objective) | N/A — no persistent state across sessions |
| RTO (Recovery Time Objective) | N/A — refresh the browser to restart |

**Disaster Recovery Strategy**: This is a stateless client-side game. There is no server and no persistent storage. If the browser tab crashes or is closed, the game session is lost. This is acceptable for a quick-play PvP battle game. No localStorage persistence is required for MVP.

**Graceful Degradation**:
- If CSS animations fail to render smoothly (older hardware), the game should still be fully playable with instant state transitions (no animations).
- If JavaScript encounters an unhandled error during combat, an error boundary should catch it and display a "Something went wrong — click to restart" message rather than a blank screen.
- The combat log should always be available as a text record, even if visual animations fail.

---

## Section 3: Security & Privacy

**Authentication**: None. This is a local-only browser game with no user accounts, no server, and no data transmission. No authentication is required.

**Authorization / RBAC**: N/A. Both players share the same browser window. There are no roles or access controls.

**Data Encryption**:
- At rest: N/A — no data is stored persistently.
- In transit: N/A — no network requests are made. The application is served as static files. The hosting server should use HTTPS, but the game itself makes no API calls.

**Input Validation**:
- **Client-side only** (no server exists):
  - Creature count input: validated as integer, clamped to 1-99.
  - Hex click coordinates: validated against grid bounds (col 0-14, row 0-10).
  - All game actions are validated against the current game state (e.g., cannot attack when it's not your turn, cannot move to an occupied hex).
  - Unit type selection: validated against the predefined roster.

**XSS / CSRF / Injection Protection**:
- XSS: The application does not render user-supplied HTML. All display values (unit names, damage numbers, log entries) are set via framework text binding (not innerHTML). React text rendering escapes content by default, so standard JSX output avoids HTML injection unless `dangerouslySetInnerHTML` is used.
- CSRF: N/A — no server-side endpoints.
- Injection: N/A — no database, no server queries.

**Compliance**: No compliance requirements apply. No personal data is collected, stored, or transmitted. No GDPR, HIPAA, or SOC2 measures are needed.

**Dependency Security**: Run `npm audit` as part of the CI/build process. Aim for zero critical or high-severity vulnerabilities. Use `npm audit --audit-level=high` as a build gate.

---

## Section 4: Error Handling Strategy

### 4a: Error Classification

| Error Category | Example | Severity | User Impact |
|:---|:---|:---|:---|
| Validation Error | Player enters creature count of 0 | Low | Inline error message on input field; "Ready" button stays disabled |
| Game Logic Error | Player clicks invalid hex during attack phase | Low | Click is silently ignored; no visual disruption |
| State Error | Game state becomes inconsistent (e.g., stack position doesn't match hex occupant) | High | Console error logged; error boundary triggered; "Restart Game" prompt shown |
| Rendering Error | Hex grid fails to render (CSS/SVG issue) | High | Error boundary catches; "Something went wrong" overlay with restart button |
| Unhandled Error | Uncaught JavaScript exception | Critical | Error boundary catches at app root; generic error message with restart option; error details logged to console |

### 4b: Error Flow

1. **Errors are caught** at two levels:
   - **Component-level**: React `ErrorBoundary` wrappers isolate the battlefield, info panel, and turn order components so a render failure does not blank the whole screen.
   - **App-level**: A root React error boundary wraps the entire application as a last resort. Event-handler/store failures are caught separately by the action layer and converted into controlled fallback state.

2. **Errors are logged** to `console.error` with structured information:
   - `[ERROR] [Component] [Action]: [Description]`
   - Example: `[ERROR] [CombatEngine] [meleeAttack]: Target stack not found at hex (5,3)`
   - Log levels used: `console.debug` for state dumps, `console.warn` for recoverable issues, `console.error` for failures.

3. **Errors are displayed** to users as:
   - Validation errors: inline messages next to the input (red text, tooltip).
   - Game logic errors: silently ignored (invalid clicks produce no response).
   - System errors: an overlay message with a friendly message and a restart button.

4. **Error reporting**: Console-only for MVP. No external error monitoring service (Sentry, LogRocket) in the initial version.

### 4c: Error Messages

- Tone: Casual, friendly, game-appropriate.
- Format: Short sentence + action suggestion.
- Examples:
  - "Oops! Something went wrong. Click below to start a new battle." (system error)
  - "Pick at least 1 creature for each stack." (validation)
  - "You need to select 3 unit types before starting." (validation)
- Never show: stack traces, error codes, file names, or technical jargon.

---

## Section 5: Data Integrity & Validation

**Validation Rules** (all client-side):
- Creature count: integer, >= 1, <= 99. Enforced by input clamping and the "Ready" button guard.
- Unit type selection: must be from the predefined roster array. No free-text entry.
- Hex coordinates: all hex interactions are validated against `col >= 0 && col < 15 && row >= 0 && row < 11`.
- Action validity: every player action is validated against the current game state machine (e.g., "Attack" is only available during ACTIVE or MOVED state, "Wait" only during ACTIVE, etc.).

**Data Consistency**:
- The game uses a single source of truth: a centralized game state object. All UI reads from this object. All mutations go through defined action functions (not direct property mutation).
- After every action, the game state is validated: each stack's position must match the hex occupant at that position. If inconsistency is detected, log an error and trigger the error boundary.

**Data Loss Prevention**:
- No data persistence in MVP. Game state exists only in memory. Closing the tab loses the game.
- No auto-save, no undo/redo.
- This is acceptable: battles last 5-15 minutes; replayability is the core loop.

---

## Section 6: Maintainability & Observability

**Logging**:
- `DEBUG`: State transitions (turn start, round start, movement execution). Disabled in production build.
- `INFO`: Game lifecycle events (game started, army confirmed, battle started, game finished).
- `WARN`: Recoverable issues (e.g., pathfinding returned null for an edge-case hex).
- `ERROR`: Unrecoverable issues (state inconsistency, unhandled exceptions).
- Format: `[LEVEL] [Timestamp] [Component]: Message`

**Monitoring**: N/A — no server, no production monitoring for MVP. Browser DevTools is the monitoring tool.

**Tracing**: N/A — no distributed system, no microservices.

**Code Quality**:
- **Linting**: ESLint with a strict config (no-unused-vars, no-any, no-implicit-coercion).
- **Formatting**: Prettier with consistent config (single quotes, 2-space indent, trailing commas).
- **Type Safety**: TypeScript in strict mode (`strict: true`). No `any` types allowed except in explicitly typed escape hatches.
- **Testing**: Unit tests for all algorithms (pathfinding, damage calculation, reachable hexes) and business rules (turn order, retaliation, victory check).

---

## Section 7: Browser & Device Compatibility

| Target | Minimum Version |
|:---|:---|
| Chrome | 90+ (2021) |
| Firefox | 90+ (2021) |
| Safari | 15+ (2021) |
| Edge | 90+ (Chromium-based) |
| Mobile browsers | Not a priority. Functional but not optimized. |
| Screen resolution | Minimum 1280×720 |
| Input method | Mouse + keyboard (hotseat play requires shared input device) |

**Rationale**: The target audience (nostalgic HoMM fans, ages 25-45) predominantly uses desktop browsers. Modern evergreen browsers from 2021+ cover 95%+ of this demographic. The hex grid requires a reasonable screen size (1280×720) to display all 15×11 hexes legibly with surrounding UI panels.

**Not Supported**:
- Internet Explorer (any version): discontinued, negligible usage.
- Browsers older than 2021: modern JavaScript features (optional chaining, nullish coalescing, CSS grid) are used freely.
- Touch-only devices: no touch event handling for hex interaction (desktop mouse is assumed). The game may work with touch but is not tested or optimized for it.

