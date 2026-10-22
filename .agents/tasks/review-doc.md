# Footer, legal pages, contact form, and 404 for personal product portfolio

Six new pages and two shared components complete the production-readiness surface of this personal product portfolio: a footer, cookie consent banner, About, Contact, Privacy, Terms, Cookies, and a 404. The contact form is built entirely on Angular signals with no form module dependency. All `localStorage` writes are SSR-guarded. The `app.component.ts` suppresses the footer on legal pages via a `computed()` signal over `NavigationEnd`.

Watch for: `nav.component.ts` reads `window.scrollY` in a `@HostListener` with no SSR guard — inconsistent with the rest of the codebase (confirmed). `CommonModule` is imported in `nav.component.ts` which is redundant in a standalone Angular 17 component (confirmed). Both are pre-existing; neither blocks this addition. The Subject `<select>` in the contact form has no `[value]` binding — state can diverge if a reset path is ever added (possible, not currently reachable).

**Verdict**: APPROVED

---

## High-level view

The contact form is pure signals: `signal()` per field, `computed()` validation, touch tracking via parallel boolean signals, and `[value]` + `(input)` + `(blur)` bindings in the template. No `FormsModule`, no `ReactiveFormsModule`, no `ngModel`. The success state uses `@if`/`@else` block syntax throughout, not `*ngIf`.

All `localStorage` and `window` accesses are wrapped in `typeof window !== 'undefined'` guards — except `window.scrollY` in the pre-existing `NavComponent`, which reads bare inside `@HostListener`. The rest of the codebase is consistent; this one is the outlier.

The legal content is substantive: Privacy Policy covers GDPR/CCPA rights individually, a 30-day exercise window, 12-month data retention, and a children's privacy clause. Terms specifies Bengaluru jurisdiction and a liability cap of max(fees paid over 12 months, $10). Cookie Policy distinguishes the essential `cookie_consent` key from optional analytics (opt-in only) and explicitly disclaims all advertising/tracking cookies.

The Subject `<select>` in the contact form only has `(change)` and `(blur)` — no `[value]` binding. In the current flow this is harmless because a successful submit makes the form disappear. If a "send another message" reset is added later, the select will display the stale option while the signal resets to `''`.

---

<details>
<summary>Issues (3)</summary>

1. **`window.scrollY` unguarded in NavComponent** — `nav.component.ts` line 19 calls `window.scrollY` bare inside `@HostListener('window:scroll')`. Every other `window`/`localStorage` access in this codebase is guarded with `typeof window !== 'undefined'`; this is the exception. While `window:scroll` won't fire in Angular Universal's server context, the inconsistency is a maintenance risk. Add the guard.

2. **`CommonModule` redundant import in NavComponent** — `nav.component.ts` imports `CommonModule` in a standalone component using Angular 17 `@if`/`@for` block syntax. `CommonModule` contributes nothing here and adds unnecessary bundle weight. Remove it.

3. **Subject `<select>` missing `[value]` binding** — The contact form's subject select element has no `[value]` binding to the `subject()` signal. If the form is ever extended with a reset/send-another path, the visible selection will not reflect the signal state. Add `[value]="subject()"` or bind `[selected]` on the matching `<option>` before adding any reset logic.

</details>

---

<details>
<summary>Details</summary>

### Signal-only contact form

Every input binds `[value]="<signal>()"`, writes via `(input)="<signal>.set($any($event.target).value)"`, and marks touched via `(blur)="<touched>.set(true)"`. There is no form module of any kind. `handleSubmit()` bulk-marks all fields touched before validity check, so an empty submit shows all errors simultaneously. The `formValid` getter is a plain getter rather than a `computed()` — acceptable since it's only evaluated on button click, not in a reactive derivation chain.

The Subject `<select>` has only `(change)` and `(blur)` — no `[value]`. Currently benign because a successful submit hides the form entirely. A future "send another" feature would need `[value]="subject()"` added to avoid the displayed option diverging from the signal.

### `window.scrollY` guard gap in NavComponent

Every other browser-API access in this codebase — `localStorage.getItem`, `localStorage.setItem`, `localStorage.removeItem`, `window.location.reload` — is inside `if (typeof window !== 'undefined')`. The `onScroll` handler in `NavComponent` is not. Angular Universal's DOM platform won't emit `window:scroll`, so this won't crash in a standard SSR setup, but the inconsistency will confuse future authors and linters. Wrap in the same guard.

### Legal content depth

The three legal pages carry real, jurisdiction-specific content rather than boilerplate placeholders. Notable details: Privacy Policy acknowledges both GDPR Art. 17 (erasure) and CCPA deletion rights by name; the 30-day response SLA is stated explicitly; the children's clause sets 13 as the minimum age consistent with COPPA. The Terms liability cap — `max(12-month fees, $10)` — is a standard indie-developer floor. The Cookie Policy's explicit "Advertising/Tracking: none" section is a useful trust signal for skeptical users.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/app/app.component.ts` | Added footer/cookie-consent; `showFooter` computed signal suppresses footer on legal pages |
| `src/app/app.routes.ts` | Lazy-loaded routes for about, contact, privacy, terms, cookies, not-found; `**` wildcard last |
| `src/app/shared/components/footer/footer.component.{ts,html,scss}` | New 4-column footer (Brand, Products, Company, Legal) with social icons |
| `src/app/shared/components/cookie-consent/cookie-consent.component.{ts,html,scss}` | New cookie banner; accept/decline persisted to localStorage with SSR guards |
| `src/app/pages/about/about.component.{ts,html,scss}` | New About page |
| `src/app/pages/contact/contact.component.{ts,html,scss}` | New Contact page with signal-only form and three channel cards |
| `src/app/pages/privacy/privacy.component.{ts,html,scss}` | New 10-section Privacy Policy |
| `src/app/pages/terms/terms.component.{ts,html,scss}` | New 11-section Terms of Service |
| `src/app/pages/cookies/cookies.component.{ts,html,scss}` | New Cookie Policy with `resetConsent()` |
| `src/app/pages/not-found/not-found.component.{ts,html,scss}` | New 404 page, links back to `/products` |
| `src/app/shared/components/nav/nav.component.ts` | Added About and Contact nav links (pre-existing file, minor edit) |

</details>
