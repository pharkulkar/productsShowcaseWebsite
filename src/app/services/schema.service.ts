import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface SoftwareApplicationSchema {
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
  url: string;
  featureList?: string[];
  screenshot?: string;
}

@Injectable({ providedIn: 'root' })
export class SchemaService {
  private document = inject(DOCUMENT);

  injectSoftwareSchema(data: SoftwareApplicationSchema): void {
    const existing = this.document.getElementById('software-app-schema');
    if (existing) existing.remove();

    const script = this.document.createElement('script');
    script.id = 'software-app-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      ...data
    }, null, 2);
    this.document.head.appendChild(script);
  }

  removeSchema(): void {
    const existing = this.document.getElementById('software-app-schema');
    if (existing) existing.remove();
  }
}
