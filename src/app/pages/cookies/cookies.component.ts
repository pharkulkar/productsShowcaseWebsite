import { Component } from '@angular/core';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent {
  resetConsent(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookie_consent');
      window.location.reload();
    }
  }
}
