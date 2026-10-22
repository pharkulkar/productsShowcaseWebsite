# Product Requirements Document — Forge Platform Showcase

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2025-01  
**Author:** Platform Engineering Team

---

## 1. Executive Summary

The Forge Platform Showcase is a multi-product marketing and documentation website for the Forge suite of developer tools. The site presents three products — **Forge Analytics**, **Forge Deploy**, and **Forge Sentinel** — to a technical audience of senior engineers, DevOps leads, and engineering managers evaluating SaaS tooling.

The website must meet two equally important goals simultaneously:

1. **Human experience:** Deliver a premium, hand-crafted visual identity on par with Linear, Vercel, or Stripe — one that communicates technical credibility and product maturity at a glance.
2. **Machine legibility:** Expose fully rendered, semantically correct HTML on initial load so that LLM-based AI scrapers, search indexers, and structured-data crawlers can extract accurate product metadata without executing JavaScript.

These goals are not in tension; they are achieved together through Angular SSR, strict semantic HTML conventions, and JSON-LD schema injection.

---

## 2. Target Audience

| Segment | Role | Primary Goal |
|---|---|---|
| Primary | Senior/Staff Software Engineer | Evaluate Forge Analytics for observability use cases |
| Primary | DevOps / Platform Engineer | Assess Forge Deploy for CI/CD pipeline integration |
| Secondary | Engineering Manager / VP Eng | Review capabilities and pricing before procurement |
| Secondary | AI Search Agents (LLMs, Perplexity, SGE) | Extract structured product data for recommendation responses |

The engineering audience demands signal-to-noise efficiency. Marketing copy must be precise and specific — no vague superlatives, no stock-photo aesthetics.

---

## 3. Core Technical Requirements

### 3.1 Framework & Runtime

- **Angular 18+** is the mandatory frontend framework.
- All UI state (active tabs, accordion expansion, interactive panel state) must use **Angular Signals** exclusively. `BehaviorSubject` or `ReplaySubject` patterns are disallowed for component-local state.
- Components must be **standalone** (no `NgModule` declarations). This keeps the component graph explicit and eliminates barrel-file confusion during SSR tree-shaking.
- **`@angular/ssr`** (Angular Universal) must be configured with `CommonEngine` for server-side rendering. The initial HTTP response must contain fully hydrated HTML with complete text payloads — not a blank `<app-root>` shell.

### 3.2 Styling & Design System

- **SCSS** is the required stylesheet language. All global tokens must be defined in `_design-system.scss` and imported via `@use`.
- The **BEM (Block, Element, Modifier)** naming methodology is mandatory. Class names follow the `block__element--modifier` pattern. No utility-class frameworks (Tailwind, Bootstrap) are permitted.
- The **typography stack** uses **Plus Jakarta Sans** (loaded from Google Fonts) for all headings and UI elements. Fluid type scaling is implemented with `clamp()` — no fixed `px` values for headline font sizes.
- The **color palette** is:
  - Base background: `#0B0F19` (deep slate)
  - Primary accent: `#6366F1` (electric indigo)
  - Secondary accent: `#6EE7B7` (muted sage)
  - Surface tiers: `#111827` (card), `#1F2937` (elevated), `#374151` (border)
- Box shadows are replaced with **ambient glow** effects using multi-layered `box-shadow` with large blur radii and low opacity. Hard drop shadows are prohibited.
- All transitions use **custom cubic-bezier curves** (`cubic-bezier(0.16, 1, 0.3, 1)`) — never `ease`, `linear`, or keyword values alone.

### 3.3 Routing Architecture (Hub-and-Spoke)

The router is structured as a hub-and-spoke model:

```
/                        → redirect → /products
/products                → ProductsHubComponent   (Hub: product overview grid)
/products/:id            → ProductShowcaseComponent  (Spoke: per-product deep-dive)
/docs                    → DocsComponent           (Technical documentation index)
```

- Route params use kebab-case IDs: `forge-analytics`, `forge-deploy`, `forge-sentinel`.
- Lazy loading is applied to all feature routes to minimize initial bundle size.
- Angular's `withComponentInputBinding()` is used so route params bind directly to component `@Input()` signals.

### 3.4 Semantic HTML & AI-Scraper Optimization

The HTML structure must satisfy the following constraints for machine legibility:

- **One `<h1>` per route.** No exceptions. The `<h1>` must contain the product or page name as plain text.
- **Strict heading hierarchy:** `<h2>` for major sections, `<h3>` for subsections and feature groups. No heading levels are skipped.
- **No semantic abuse:** `<div>` and `<span>` elements must never carry heading-level text without a proper heading tag.
- **Capability Matrix:** Rendered as a native `<table>` element with `<thead>`, `<tbody>`, `<th scope="col">`, and `<th scope="row">`. This ensures AI scrapers read the comparison data as structured tabular data.
- **Integration Grid:** Rendered as a `<ul>` list of `<li>` items. Each integration logo `<img>` carries a fully descriptive `alt` attribute (e.g., `alt="GitHub integration — trigger Forge Deploy pipelines from push events"`).
- **Landmark regions:** `<header>`, `<main>`, `<nav>`, `<footer>`, and `<section>` with `aria-label` attributes are used throughout. No layout is built from unlabeled `<div>` wrappers alone.

### 3.5 JSON-LD Schema Injection

A dedicated **`SchemaService`** (`schema.service.ts`) must dynamically inject a `<script type="application/ld+json">` tag into `<head>` on route initialization. The schema type is `SoftwareApplication` and must populate:

- `name`, `description`, `applicationCategory`
- `operatingSystem`
- `offers` (pricing tier object)
- `aggregateRating` (from product data)
- `author` (organization)

The service must avoid duplicate script injection on subsequent navigations and must clean up stale schemas when navigating between product routes.

---

## 4. Feature Matrix

### 4.1 Forge Analytics

| Feature | Description |
|---|---|
| Real-time event stream | Sub-100ms latency ingestion pipeline with live dashboard |
| Query builder | Visual, no-code funnel and cohort analysis builder |
| Anomaly detection | ML-driven spike/drop alerting with configurable sensitivity |
| Data export | CSV, JSON, and Parquet export with column-level filtering |
| SDK integrations | JavaScript, Python, Go, and Ruby instrumentation libraries |

### 4.2 Forge Deploy

| Feature | Description |
|---|---|
| Pipeline orchestration | DAG-based CI/CD pipeline with parallel stage execution |
| Environment management | Isolated preview, staging, and production environment promotion |
| Rollback engine | One-click atomic rollback to any prior deployment snapshot |
| Secrets management | Encrypted secret injection with per-environment scoping |
| GitHub / GitLab sync | Bi-directional VCS integration with PR-level deploy previews |

### 4.3 Forge Sentinel

| Feature | Description |
|---|---|
| Threat detection | Behavioral anomaly detection across API and auth surfaces |
| Audit logging | Immutable, tamper-evident event log with 12-month retention |
| Policy engine | YAML-defined access control policies with dry-run validation |
| Incident timeline | Chronological breach reconstruction with actor attribution |
| SIEM integration | Native connectors for Splunk, Datadog, and Elastic SIEM |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **Core Web Vitals targets (desktop):** LCP < 1.8s, CLS < 0.05, INP < 150ms.
- The SSR response must arrive with complete text content. Defer only interactive enhancement (client hydration) — never defer primary content.
- Images must use `loading="lazy"` and `width`/`height` attributes to prevent layout shift.
- Critical CSS for above-the-fold content must be inlined or delivered in the initial server response.

### 5.2 SEO & Discoverability

- Every route must set a unique, descriptive `<title>` and `<meta name="description">` via `@angular/platform-browser`'s `Title` and `Meta` services.
- `<link rel="canonical">` tags must be injected per route.
- Open Graph and Twitter Card meta tags must be present on all product pages.
- JSON-LD `SoftwareApplication` schema must be present on all `/products/:id` routes.

### 5.3 Accessibility

- **WCAG 2.1 AA** compliance is the baseline target.
- All interactive controls (tabs, accordions, modals) must use the correct ARIA roles and manage focus correctly.
- Color contrast ratios must meet 4.5:1 for body text and 3:1 for large text against all background tiers.
- The site must be fully navigable by keyboard alone.

### 5.4 Browser Support

- Chrome 115+, Firefox 115+, Safari 16.4+, Edge 115+.
- No IE11 support. CSS features used (`clamp()`, `grid`, `CSS custom properties`) are all baseline-compatible with the above targets.

---

## 6. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Lighthouse Performance | ≥ 90 (SSR cold load) | Lighthouse CI in build pipeline |
| Lighthouse SEO | 100 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 95 | Lighthouse CI + manual audit |
| LCP (desktop) | < 1.8s | Chrome UX Report / CrUX |
| JSON-LD validation | 0 errors | Google Rich Results Test |
| AI scraper content extraction | All product text extractable without JS execution | Manual curl + html-parser test |
| Build bundle (initial JS) | < 150KB gzipped | `ng build --stats-json` analysis |

---

## 7. Out of Scope (v1.0)

- User authentication / accounts
- Live data integrations (all product data is static/mock)
- Pricing calculator (rates shown are static)
- Blog or changelog
- A/B testing infrastructure
- Internationalization (i18n)
