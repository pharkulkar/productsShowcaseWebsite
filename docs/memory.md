# Project Memory & Decision Log — Forge Platform Showcase

**Project:** Forge SaaS Multi-Product Showcase  
**Framework:** Angular 18+ (Signals-based, Standalone, SSR)  
**Started:** 2025-01  
**Maintained by:** Platform Engineering Team

This document is a living record of architectural and design decisions made during development. It exists so that engineers joining mid-project can understand *why* the codebase looks the way it does — not just what it does. Every major decision has a rationale and, where relevant, a record of the alternatives that were rejected.

---

## 1. Architecture Decisions

### 1.1 Angular Signals over NgRx

**Decision:** All component UI state is managed with Angular Signals (`signal()`, `computed()`, `effect()`). NgRx Store is not used.

**Rationale:** NgRx is the right tool when state needs to be shared across multiple lazy-loaded feature modules, logged for time-travel debugging, or synchronized with a backend via effects. None of those conditions apply here. The state on this site is purely local UI state: which tab is active, whether an accordion panel is open, which product variant is being previewed. Signals handle all of this with zero boilerplate, zero additional bundle weight, and with the Zone.js-free change detection benefits that come with Angular 18's signal-aware runtime.

Using NgRx here would be a classic case of over-engineering — adding a Redux-style unidirectional data flow to a problem that is, at its core, a few boolean and string values per component.

**Rejected alternative:** `BehaviorSubject` + `async` pipe. This was the idiomatic pre-signals approach. It works, but it adds RxJS ceremony (subscription management, `takeUntilDestroyed`, `async` pipe in templates) to simple toggling logic. Signals are strictly cleaner for this use case.

---

### 1.2 Standalone Components over NgModules

**Decision:** Every component, directive, and pipe is declared as `standalone: true`. No `NgModule` exists in the codebase other than what Angular's own `bootstrapApplication` requires internally.

**Rationale:** `NgModule` was Angular's original compilation and dependency-injection boundary. In Angular 14+, standalone components make that boundary explicit at the component level — you see exactly what a component depends on from its own `imports` array rather than hunting through a shared module. This is strictly better for:

- **Tree-shaking:** The compiler can statically analyze per-component imports and dead-code-eliminate unused dependencies.
- **SSR:** No risk of accidentally importing browser-only APIs inside a module that gets included in the server bundle. Each component's dependency surface is visible.
- **Readability:** A new engineer can read a single component file and know exactly what it uses.

**Rejected alternative:** Feature `NgModule` per route. This was the standard lazy-loading pattern before Angular 14. It still works but creates an extra layer of indirection for no tangible benefit in a project of this scale.

---

### 1.3 Angular SSR (`@angular/ssr`) with CommonEngine

**Decision:** The application is server-rendered using `@angular/ssr`. The `server.ts` entry point uses Express and Angular's `CommonEngine` to render each route to a fully-populated HTML string before sending the response.

**Rationale:** This was a non-negotiable requirement driven by two use cases:

1. **AI scraper compatibility.** LLM-based search agents (Perplexity, Google SGE, ChatGPT Browse) frequently fetch pages without executing JavaScript. A client-rendered Angular SPA would deliver a near-empty HTML shell to these crawlers. SSR ensures the full product content — features, capability matrix, pricing, schema data — is present in the raw HTTP response.
2. **Core Web Vitals.** LCP is dramatically improved when the primary content arrives in the HTML rather than being painted after a client-side bootstrap.

**Trade-off acknowledged:** SSR adds operational complexity (Node.js server, hydration edge cases, browser API guards). We accept this cost because the SEO and scraper-readability benefits are central to the project's purpose.

**Hydration strategy:** Angular's `provideClientHydration()` is configured with `withEventReplay()` to prevent interaction loss during the hydration window.

---

### 1.4 Hub-and-Spoke Routing Structure

**Decision:** Routes are structured as `/products` (hub), `/products/:id` (spokes), and `/docs`.

**Rationale:** The hub-and-spoke model mirrors how users actually navigate the site. They arrive at the overview, select a product, and dive into its dedicated page. The URL structure communicates this hierarchy clearly and maps directly to the semantic relationship between pages — which matters for SEO link equity as well as user orientation.

The `:id` param uses kebab-case product identifiers (`forge-analytics`, `forge-deploy`, `forge-sentinel`) rather than numeric IDs. These are human-readable in the URL bar and carry semantic meaning for crawlers that infer page topic from URL path segments.

**`withComponentInputBinding()`:** Angular Router's `withComponentInputBinding()` is enabled in `app.config.ts` so route params flow directly into component `@Input()` properties. This avoids injecting `ActivatedRoute` into showcase components and keeps them decoupled from the router.

---

## 2. Design Decisions

### 2.1 Plus Jakarta Sans Typography

**Decision:** Plus Jakarta Sans is the sole typeface for all headings and UI elements.

**Rationale:** The brief required a "premium, geometric neo-grotesque or humanist" font. Plus Jakarta Sans hits both criteria: it has the geometric structure (circular 'O', consistent stroke weight) that reads as technical and modern, but the humanist ink traps and optical corrections prevent it from feeling cold or robotic. It renders well at both large display sizes (hero headlines) and small UI sizes (table cells, labels) without needing separate weights for each context.

Alternatives considered:
- **Geist Sans:** Excellent but very closely associated with Vercel's brand identity. Ruled out to avoid brand confusion.
- **Clash Display:** More distinctive but too stylized for body/UI copy. Better as a pure display face.
- **Inter:** Too ubiquitous. Has become the "bootstrap of fonts" — it signals "I didn't choose a font," which undermines the premium positioning.

Body copy uses the system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) for performance. Only the heading/display face is loaded from Google Fonts.

---

### 2.2 Color Palette — Electric Indigo + Muted Sage on Deep Slate

**Decision:**
- Background: `#0B0F19` (deep slate, not pure black)
- Primary accent: `#6366F1` (electric indigo)
- Secondary accent: `#6EE7B7` (muted sage)

**Rationale:** The brief explicitly called out "no generic bright blues or harsh dark modes." The choices here are deliberate:

- **`#0B0F19` over `#000000`:** Pure black backgrounds create harsh contrast and look dated. The deep slate has enough blue in its undertone to feel cohesive with the indigo accent while providing softer contrast that reduces eye strain during extended reading.
- **`#6366F1` (indigo) over blue:** Indigo reads as "engineering sophistication" without the overused "tech blue" connotation. It's adjacent to blue in color space but immediately distinguishable.
- **`#6EE7B7` (muted sage) as secondary:** A warm-leaning teal/mint that complements the cool indigo without creating a garish two-tone contrast. Used sparingly for secondary badges, success states, and accent details.

Surface tiers (`#111827`, `#1F2937`, `#374151`) create visual depth through tonal layering rather than box shadows.

---

### 2.3 BEM over CSS Modules or Utility Classes

**Decision:** BEM (Block, Element, Modifier) with SCSS is the styling methodology. CSS Modules and utility-class frameworks were explicitly ruled out.

**Rationale:**

- **vs. Tailwind/utility classes:** Utility classes produce HTML that is nearly impossible to audit for design consistency. When a designer asks "where is this button styled?", `bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md transition-colors` spread across 40 files is not an answer. BEM keeps styles colocated in component SCSS files.
- **vs. CSS Modules:** CSS Modules work well in React where component boundaries are clear. In Angular, the framework already provides style encapsulation via `ViewEncapsulation`. Adding CSS Modules on top creates redundant tooling and more complex build configuration.
- **vs. inline styles:** Never appropriate for a design-system-level project.

BEM also has a practical SEO/scraper benefit: the class names (`.product-hero__headline`, `.capability-matrix__row--highlighted`) are meaningful to anyone reading the rendered HTML, including developer tools-wielding LLMs analyzing page structure.

---

### 2.4 Ambient Glow over Box Shadows

**Decision:** Interactive elements use multi-layered `box-shadow` with large blur radii and low opacity ("ambient glow") rather than hard drop shadows.

**Rationale:** Hard `box-shadow: 4px 4px 8px rgba(0,0,0,0.3)` looks like a 2014 Material Design card. On a dark background it creates a muddy gray halo. The ambient glow pattern — e.g., `0 0 0 1px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.08)` — creates the perception of the element emanating from the background rather than floating above it. This aligns with the "premium editorial" aesthetic and is visibly distinct from AI-generated template output.

---

## 3. Component Decisions

### 3.1 Component Inventory

| Component | Standalone | Primary Signals Used |
|---|---|---|
| `AppComponent` | Yes | None (shell only) |
| `NavComponent` | Yes | `activeRoute` (computed) |
| `ProductsHubComponent` | Yes | `selectedFilter` (signal) |
| `ProductShowcaseComponent` | Yes | `activeTab`, `activeFeature`, `expandedSection` |
| `CapabilityMatrixComponent` | Yes | `highlightedRow` (signal) |
| `IntegrationGridComponent` | Yes | None (static render) |
| `DocsComponent` | Yes | `activeSidebarItem` (signal) |

### 3.2 Signal Patterns in ProductShowcaseComponent

The showcase component is the most signal-rich in the codebase. The patterns used:

- **`signal<string>()`** for `activeTab` — holds the ID of the currently selected capability tab.
- **`computed()`** for `activeTabContent` — derives the full tab data object from `activeTab` and the static product data array. No manual subscription management.
- **`effect()`** for schema injection — triggers `SchemaService.injectSchema()` whenever the product `@Input()` changes, ensuring the JSON-LD in `<head>` always reflects the current product.

---

## 4. Naming Conventions

### 4.1 BEM Block Naming

| Component | BEM Block Name |
|---|---|
| Product hero section | `.product-hero` |
| Capability tab panel | `.capability-panel` |
| Feature comparison table | `.capability-matrix` |
| Integration list | `.integration-grid` |
| Navigation bar | `.site-nav` |
| Product card (hub page) | `.product-card` |
| CTA section | `.cta-section` |

### 4.2 File Naming

- Components: `kebab-case.component.ts/.html/.scss`
- Services: `kebab-case.service.ts`
- SCSS partials: `_kebab-case.scss` (underscore prefix per SCSS convention)
- Models/interfaces: `kebab-case.model.ts`

### 4.3 Route & Param Naming

- Route paths: kebab-case (`/products`, `/products/:id`)
- Product IDs (`:id` values): kebab-case, human-readable (`forge-analytics`, `forge-deploy`, `forge-sentinel`)
- No numeric IDs are used in public-facing routes

### 4.4 Signal Naming

- Writable signals: camelCase noun (`activeTab`, `selectedFilter`, `expandedSection`)
- Computed signals: camelCase, often noun phrase or predicate (`activeTabContent`, `isMenuOpen`)
- Effects: not stored in variables unless cleanup is needed; otherwise anonymous inline effect in constructor

---

## 5. Open Questions & Future Considerations

### 5.1 Open Questions

| # | Question | Status |
|---|---|---|
| 1 | Should `/docs` be a full docs platform (with versioning, search) or remain a single-page overview? | Open |
| 2 | Will product data stay static (hardcoded in service) or be loaded from a CMS/API? | Open — static for v1 |
| 3 | Should `aggregateRating` in JSON-LD be hardcoded mock values or omitted until real review data exists? | Open — currently mock |
| 4 | Is Plus Jakarta Sans's 10KB WOFF2 transfer acceptable given LCP targets, or should a system font fallback be used for first paint? | Open — monitor with CrUX |

### 5.2 Future Considerations

- **CMS integration:** Product content (feature lists, capability matrix data, integration logos) is hardcoded in TypeScript service files. If the marketing team needs to update copy without a deploy, a headless CMS (Contentful, Sanity) should be integrated. The service layer is already abstracted to make this swap straightforward.

- **Edge rendering:** The current SSR setup uses a Node.js/Express server. If cold-start latency becomes a concern at scale, the rendering pipeline could be migrated to Angular's `@angular/ssr` edge adapter for Cloudflare Workers or Vercel Edge Functions.

- **Component library extraction:** The `CapabilityMatrixComponent`, `IntegrationGridComponent`, and tab panel patterns are generic enough to extract into a shared Nx library if the Forge design system expands to other properties.

- **Animation system:** The current micro-interactions are CSS-only (transitions on `:hover`, `:focus`). A more expressive motion system — entrance animations for section reveals, staggered list animations — could be layered in using Angular's `animate()` or the Web Animations API without disrupting the current SCSS structure.

- **Dark/light mode toggle:** The design system uses `hsl()` custom properties internally, which makes a light mode variant achievable via a single `:root[data-theme="light"]` override block. Not planned for v1 but the groundwork is there.

- **E2E testing:** Playwright is the recommended choice for E2E coverage given its SSR-friendly architecture (it tests against the real server response, not just the hydrated DOM). No E2E suite exists yet.

---

*This document should be updated whenever a significant architectural or design decision is made or revised. It is a first-class artifact of the project, not an afterthought.*
