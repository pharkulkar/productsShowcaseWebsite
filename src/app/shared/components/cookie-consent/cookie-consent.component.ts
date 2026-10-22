import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit {
  accepted = signal<boolean | null>(null);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('cookie_consent');
      if (v === 'accepted') this.accepted.set(true);
      if (v === 'declined') this.accepted.set(false);
    }
  }

  accept(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent', 'accepted');
    }
    this.accepted.set(true);
  }

  decline(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent', 'declined');
    }
    this.accepted.set(false);
  }
}
