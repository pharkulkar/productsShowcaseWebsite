# Implementation Plan — Production-Ready Pages & Footer

## Codebase Context (verified by reading source)

- **Angular 18.2**, standalone components, SSR enabled via `@angular/ssr` + Express (`app.config.server.ts` uses `provideServerRendering`).
- **`@use` path rule** (confirmed by reading existing files):
  - Pages at `src/app/pages/**` → `@use '../../../styles/design-system' as *;`
  - Shared components at `src/app/shared/components/**` → `@use '../../../../styles/design-system' as *;`
- **Single design-system file**: `src/styles/_design-system.scss` — it is imported as `'...styles/design-system'` (no underscore, Angular's Sass resolver finds the partial). No barrel `design-system.scss` exists.
- **No `ReactiveFormsModule` or `FormsModule` in the project** — all state already uses `signal()`. The contact form must follow the same pattern.
- **`app.config.ts`** uses `withInMemoryScrolling({ scrollPositionRestoration: 'top' })` — all nav scrolls already handled; Explore button anchoring fix is a separate concern not in scope here.
- **SSR guard pattern needed** wherever `localStorage`/`window` is used: `if (typeof window !== 'undefined') { ... }`.
- **Router events + `toSignal`** are available from `@angular/core/rxjs-interop` (Angular 18 ships this).
- `app.component.ts` is currently a tiny inline template — it must be promoted to a templateUrl file to hold footer + cookie-banner.
- The `docs` route (`/docs`) currently shows the "Get Started" page. The nav links array still has `{ label: 'Get Started', path: '/docs' }` — About and Contact must be added to that array.

---

## Implementation Plan

- [ ] 1. Create the footer component shell.
      Create `src/app/shared/components/footer/footer.component.ts` (standalone, imports `RouterLink`), `footer.component.html` (multi-column layout: logo + tagline column, Products column linking to `/products` and each product's `/products/:id`, Legal column linking to `/privacy`, `/terms`, `/cookies`, a Contact column with the office email and a link to `/contact`), and `footer.component.scss` (@use `'../../../../styles/design-system' as *`). The footer uses existing CSS variables: `--color-base`, `--color-surface-1`, `--color-border`, `--color-text-secondary`, `--color-text-tertiary`, `--font-mono`, `--font-display`, spacing tokens, and the `@include container` mixin. Bottom bar shows copyright year and `BUILT IN INDIA` mono-label. No new CSS variables needed.
      Files: `src/app/shared/components/footer/footer.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — compiles without errors.

- [ ] 2. Create the cookie-consent banner component.
      Create `src/app/shared/components/cookie-consent/cookie-consent.component.ts` (standalone, no module imports beyond `RouterLink`). State is managed with `signal<boolean>(false)` for `visible`. On `ngOnInit`, check consent: **guard with `if (typeof window !== 'undefined')`** before calling `localStorage.getItem('cookie-consent')` — if value is absent, set `visible` to `true`. Accept button writes `localStorage.setItem('cookie-consent', 'accepted')` and sets `visible(false)`. Decline button writes `'declined'` and sets `visible(false)`. The banner links to `/cookies` for the full policy. Use `@if (visible())` in the template (Angular 18 control flow). SCSS `@use '../../../../styles/design-system' as *`.
      Files: `src/app/shared/components/cookie-consent/cookie-consent.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — compiles without errors.

- [ ] 3. Promote `app.component.ts` to an external template and wire footer + cookie-consent.
      Replace the inline `template` string in `app.component.ts` with `templateUrl: './app.component.html'` and `styleUrl: './app.component.scss'`. Create `src/app/app.component.html` with: `<app-nav>`, `<main><router-outlet></router-outlet></main>`, `<app-footer *ngIf="showFooter()"></app-footer>` (use Angular 18 `@if` block, not *ngIf — `@if (showFooter()) { <app-footer /> }`), and `<app-cookie-consent />`. Create `src/app/app.component.scss` with just `:host { display: block; }`. In `app.component.ts` import `Router`, `NavigationEnd`, `toSignal` from `@angular/core/rxjs-interop`, and compute `showFooter` as:
      ```ts
      private readonly hiddenRoutes = ['/privacy', '/terms', '/cookies'];
      readonly showFooter = toSignal(
        this.router.events.pipe(
          filter(e => e instanceof NavigationEnd),
          map((e: NavigationEnd) => !this.hiddenRoutes.some(r => e.urlAfterRedirects.startsWith(r))),
          startWith(!this.hiddenRoutes.some(r => this.router.url.startsWith(r)))
        ),
        { initialValue: true }
      );
      ```
      Import `FooterComponent` and `CookieConsentComponent` in `imports: []`. `Router` is injected via `private router = inject(Router)`.
      Files: `src/app/app.component.ts`, `src/app/app.component.html`, `src/app/app.component.scss`
      Verify: `ng build --configuration development` — no errors. `ng serve` then visit `/privacy` — footer absent; visit `/products` — footer present.

- [ ] 4. Add About and Contact links to the nav and rename "Get Started".
      In `nav.component.ts` update `navLinks` to:
      ```ts
      readonly navLinks = [
        { label: 'Products',  path: '/products' },
        { label: 'About',     path: '/about' },
        { label: 'Contact',   path: '/contact' },
        { label: 'Get Started', path: '/docs' },
      ];
      ```
      No HTML or SCSS changes required — the `@for` loop in `nav.component.html` renders links generically.
      Files: `src/app/shared/components/nav/nav.component.ts`
      Verify: `ng build --configuration development` — no errors.

- [ ] 5. Create the About page.
      Create `src/app/pages/about/about.component.ts` (standalone, imports `RouterLink`), `about.component.html`, and `about.component.scss` (`@use '../../../styles/design-system' as *`). Content sections: hero (who we are, a builder of developer and operational utilities), mission statement, the four products listed with their accent colours using the existing `--color-*-primary` CSS variables, and a closing CTA linking to `/contact`. Use `@include container` mixin for layout, matching the visual language of `docs.component.scss` (surface-1 cards, border tokens, font tokens). No external data fetching — static content only.
      Files: `src/app/pages/about/about.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 6. Create the Contact page with a Signals-only form.
      Create `src/app/pages/contact/contact.component.ts` (standalone, **do NOT import `ReactiveFormsModule` or `FormsModule`**). Declare four signals:
      ```ts
      name    = signal('');
      email   = signal('');
      subject = signal('');
      message = signal('');
      submitted = signal(false);
      errors  = signal<Record<string, string>>({});
      ```
      Bind each field with `[value]="name()"` and `(input)="name.set($event.target.value)"`. On blur per field call a `validateField(field)` method that writes to `errors`. On form submit call `handleSubmit()` which validates all fields; if valid, sets `submitted(true)` and shows a success panel (no actual HTTP call — placeholder for future API). Use `@if (submitted())` to toggle between form and success state. SCSS `@use '../../../styles/design-system' as *`. Include a mailto fallback link (`mailto:hello@yourdomain.com`) visible in the success state.
      Files: `src/app/pages/contact/contact.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 7. Create the Privacy Policy page.
      Create `src/app/pages/privacy/privacy.component.ts` (standalone, no imports beyond `CommonModule` if needed — likely none), `privacy.component.html`, `privacy.component.scss` (`@use '../../../styles/design-system' as *`). Static legal prose page. Layout: `@include container` with `max-width: 760px`, standard heading hierarchy using `--font-display` / `--font-body` tokens, `--color-text-secondary` body text, `--color-border` section dividers. Sections: Data We Collect, How We Use It, Third-Party Services, Cookies, Your Rights, Contact. No footer on this route (handled by step 3). Effective date shown in a `--font-mono` micro-label.
      Files: `src/app/pages/privacy/privacy.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 8. Create the Terms of Service page.
      Same structure as Privacy Policy page (step 7). Create `src/app/pages/terms/terms.component.ts`, `.html`, `.scss` (`@use '../../../styles/design-system' as *`). Sections: Acceptance of Terms, Use of Products, Intellectual Property, Disclaimers, Limitation of Liability, Governing Law, Contact.
      Files: `src/app/pages/terms/terms.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 9. Create the Cookie Policy page.
      Same structure as Privacy Policy (step 7). Create `src/app/pages/cookies/cookies.component.ts`, `.html`, `.scss` (`@use '../../../styles/design-system' as *`). Sections: What Are Cookies, Cookies We Use (functional, analytics, none for advertising), Managing Cookies, Contact. Include a button that calls `localStorage.removeItem('cookie-consent')` — guard with `if (typeof window !== 'undefined')` — to allow resetting consent. This button wires to a `resetConsent()` method in the component class.
      Files: `src/app/pages/cookies/cookies.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 10. Create the 404 Not-Found page.
      Create `src/app/pages/not-found/not-found.component.ts` (standalone, imports `RouterLink`), `not-found.component.html`, `not-found.component.scss` (`@use '../../../styles/design-system' as *`). Centered layout: large `404` in `--text-7xl` muted color, headline, short message, a "Go to Products" `RouterLink` button using the `.btn--primary` class pattern from `docs.component.scss`. Keep it visually consistent with the dark theme.
      Files: `src/app/pages/not-found/not-found.component.ts`, `.html`, `.scss`
      Verify: `ng build --configuration development` — no errors.

- [ ] 11. Register all new routes in `app.routes.ts` with lazy loading and add the wildcard `**` route.
      Update `src/app/app.routes.ts` to add (after the existing three routes, wildcard `**` must be last):
      ```ts
      { path: 'about',   loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
      { path: 'terms',   loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent) },
      { path: 'cookies', loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent) },
      { path: '**',      loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
      ```
      Dependency: steps 5–10 must all be complete before this step, so no broken lazy-load import exists.
      Files: `src/app/app.routes.ts`
      Verify: `ng build` (production build) completes with zero errors and produces separate lazy chunks for every new route. Run `ng serve` and navigate to `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`, and a nonexistent path like `/xyz` — each route renders the correct page.

---

## Order Summary (dependency chain)

Steps 1–2 are independent of each other and of steps 5–10 — create components first.
Step 3 depends on steps 1 and 2 (footer + cookie-consent must exist before app.component imports them).
Step 4 is independent (only edits nav's data array).
Steps 5–10 are independent of each other and can be done in any order.
Step 11 depends on steps 5–10 all being complete (lazy imports must resolve).

## TypeScript / Angular Pitfalls to Avoid

1. **`toSignal` import**: use `import { toSignal } from '@angular/core/rxjs-interop'` — not from `@angular/core`.
2. **`filter` / `map` / `startWith`**: import from `rxjs/operators`, not `rxjs`.
3. **`NavigationEnd` type guard**: use `e instanceof NavigationEnd` — do not use `e.type === EventType.NavigationEnd` (less readable, same behaviour, but the instanceof form is conventional in existing Angular 18 codebases).
4. **SSR localStorage guard**: always wrap `localStorage` reads/writes as `if (typeof window !== 'undefined') { localStorage... }`. This fires during SSR pre-render where `window` is undefined.
5. **`CommonModule`**: the project uses standalone components with Angular 18 built-in control flow (`@if`, `@for`). Do not import `CommonModule` unless a specific pipe (e.g. `AsyncPipe`) is actually needed.
6. **`DOCUMENT` injection token**: not needed for any new component in this plan — do not import it.
7. **`@use` path**: must be a relative path string, not an alias. Pages use `'../../../styles/design-system'`; shared components use `'../../../../styles/design-system'`. The underscore prefix is omitted per Sass partial resolution convention (confirmed by existing files).
8. **Inline template in `app.component.ts`**: the current inline `template: \`...\`` must be fully replaced by `templateUrl` — do not leave both properties.
9. **`showFooter` initial value**: the `toSignal` call needs `{ initialValue: true }` to avoid `undefined` on first render before the first `NavigationEnd` fires.
10. **Contact form `(input)` binding**: Angular 18 standalone components do not need `FormsModule` for event binding. Bind with `(input)="field.set($any($event).target.value)"` or cast via `($event.target as HTMLInputElement).value` to satisfy TypeScript strict mode.
