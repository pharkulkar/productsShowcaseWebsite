import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categoryColor: string;
  featured?: boolean;
}

interface Integration {
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-products-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products-hub.component.html',
  styleUrl: './products-hub.component.scss'
})
export class ProductsHubComponent {
  readonly featuredProduct: Product = {
    id: 'whisper-ai',
    name: 'Whisper AI',
    tagline: 'Your invisible co-pilot for every meeting',
    description: 'Whisper AI listens in real-time through a ghost overlay your camera never sees. It surfaces context-aware talking points, answers, and follow-up questions exactly when you need them — without breaking your flow or eye contact.',
    category: 'AI Assistant',
    categoryColor: 'indigo',
    featured: true
  };

  readonly secondaryProducts: Product[] = [
    {
      id: 'btc-lens',
      name: 'BTC Lens',
      tagline: 'Live Bitcoin intelligence in your browser toolbar',
      description: 'Track BTC price, dominance, mempool fees, and whale alerts from a single Chrome extension. No account required — data streams directly from on-chain sources.',
      category: 'Chrome Extension',
      categoryColor: 'amber'
    },
    {
      id: 'gmb-extractor',
      name: 'GMB Extractor',
      tagline: 'Pull structured business data from Google Maps at scale',
      description: 'Extract verified business names, phone numbers, addresses, ratings, and category tags from any Google Maps search. Export clean CSV or JSON in one click.',
      category: 'Data Tool',
      categoryColor: 'sage'
    },
    {
      id: 'tableflow',
      name: 'TableFlow',
      tagline: 'The all-in-one operations platform for restaurants',
      description: 'Manage reservations, digital menus, table orders, and kitchen display in one connected system. Built for independent restaurants and multi-location chains alike.',
      category: 'Restaurant Tech',
      categoryColor: 'sage'
    }
  ];

  readonly integrations: Integration[] = [
    { name: 'Chrome Web Store',  description: 'BTC Lens — install directly from the Chrome Web Store, no account needed',   icon: '◉' },
    { name: 'Google Meet',       description: 'Whisper AI — works invisibly alongside Google Meet calls',                    icon: '⬡' },
    { name: 'Zoom',              description: 'Whisper AI — ghost overlay fully hidden from Zoom screen share',              icon: '▲' },
    { name: 'Microsoft Teams',   description: 'Whisper AI — native overlay support for Teams calls',                         icon: '⬟' },
    { name: 'Google Maps',       description: 'GMB Extractor — pulls live data from any Google Maps search page',            icon: '◈' },
    { name: 'Google Sheets',     description: 'GMB Extractor — one-click export directly into your spreadsheet',             icon: '▼' },
    { name: 'iOS & Android',     description: 'TableFlow — staff and customer apps on both mobile platforms',                icon: '◆' },
    { name: 'Web Browser',       description: 'TableFlow — full management dashboard accessible from any browser',           icon: '◐' }
  ];
}
