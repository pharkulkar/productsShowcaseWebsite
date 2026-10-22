import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { NavComponent } from './shared/components/nav/nav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, CookieConsentComponent],
  template: `
    <app-nav></app-nav>
    <router-outlet></router-outlet>
    @if (showFooter()) {
      <app-footer></app-footer>
    }
    <app-cookie-consent></app-cookie-consent>
  `,
  styles: [`:host { display: block; }`]
})
export class AppComponent {
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  showFooter = computed(() => {
    return true;
    // const u = this.url();
    // return !(['/privacy', '/terms', '/cookies'].some(p => u === p || u.startsWith(p + '?')));
  });
}
