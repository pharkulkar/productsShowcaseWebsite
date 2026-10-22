import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProductSetup {
  id: string;
  name: string;
  category: string;
  accentVar: string;
  tagline: string;
  platform: string;
  platformIcon: string;
  steps: { label: string; detail: string; }[];
  primaryCta: { label: string; href: string; };
  secondaryCta?: { label: string; href: string; };
  systemReqs: string[];
}

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss'
})
export class DocsComponent {
  readonly products: ProductSetup[] = [
    {
      id: 'whisper-ai',
      name: 'Whisper AI',
      category: 'AI Assistant',
      accentVar: 'whisper',
      tagline: 'Your invisible co-pilot for every meeting',
      platform: 'Windows & macOS',
      platformIcon: '⬡',
      steps: [
        { label: 'Download the app',       detail: 'Click the download button below and run the installer for your OS.' },
        { label: 'Grant permissions',      detail: 'Allow microphone and screen overlay access when prompted — the overlay remains invisible to screen share by design.' },
        { label: 'Join any meeting',       detail: 'Open Zoom, Google Meet, or Teams as normal. Whisper AI runs silently in the background.' },
        { label: 'See live suggestions',   detail: 'Context-aware talking points appear in the corner of your screen as the conversation unfolds.' },
      ],
      primaryCta:   { label: 'Download for macOS',   href: '#' },
      secondaryCta: { label: 'Download for Windows', href: '#' },
      systemReqs: ['macOS 12+ or Windows 10+', '8 GB RAM minimum', 'Internet connection for AI suggestions', 'Microphone access']
    },
    {
      id: 'btc-lens',
      name: 'BTC Lens',
      category: 'Chrome Extension',
      accentVar: 'btc',
      tagline: 'Live Bitcoin intelligence in your browser toolbar',
      platform: 'Chrome & Edge',
      platformIcon: '◉',
      steps: [
        { label: 'Add to Chrome',          detail: 'Click "Add to Chrome" to install from the Chrome Web Store — takes under 10 seconds.' },
        { label: 'Pin the extension',      detail: 'Click the puzzle icon in your toolbar and pin BTC Lens so the ticker is always visible.' },
        { label: 'Configure your alerts',  detail: 'Click the extension icon to set your price alert thresholds and choose which data feeds to show.' },
        { label: 'Stay informed',          detail: 'Price, mempool fees, and whale alerts update in real time — no account or signup required.' },
      ],
      primaryCta: { label: 'Add to Chrome — Free', href: '#' },
      secondaryCta: { label: 'Add to Edge', href: '#' },
      systemReqs: ['Google Chrome 110+ or Microsoft Edge 110+', 'No account required', 'Internet connection']
    },
    {
      id: 'gmb-extractor',
      name: 'GMB Extractor',
      category: 'Data Tool',
      accentVar: 'gmb',
      tagline: 'Pull structured business data from Google Maps at scale',
      platform: 'Chrome Extension',
      platformIcon: '◈',
      steps: [
        { label: 'Install the extension',  detail: 'Add GMB Extractor from the Chrome Web Store — one click, no account needed.' },
        { label: 'Open Google Maps',       detail: 'Search for any business type and location in Google Maps (e.g. "coffee shops in Austin").' },
        { label: 'Click Extract',          detail: 'Hit the GMB Extractor button in your toolbar. It reads all visible listings automatically.' },
        { label: 'Export your data',       detail: 'Download as CSV or JSON, or push directly to Google Sheets with one click.' },
      ],
      primaryCta: { label: 'Add to Chrome — Free', href: '#' },
      systemReqs: ['Google Chrome 110+', 'No account required for basic use', 'Google account for Sheets export']
    },
    {
      id: 'tableflow',
      name: 'TableFlow',
      category: 'Restaurant Tech',
      accentVar: 'table',
      tagline: 'The all-in-one operations platform for restaurants',
      platform: 'Web + iOS + Android',
      platformIcon: '◆',
      steps: [
        { label: 'Create your venue',      detail: 'Sign up and add your restaurant — set table count, operating hours, and upload your menu.' },
        { label: 'Print QR codes',         detail: 'Download and print the generated QR codes for each table. Guests scan to view the menu and order.' },
        { label: 'Set up your KDS',        detail: 'Open the TableFlow Kitchen Display on any tablet or screen behind the pass — orders appear instantly.' },
        { label: 'Go live',                detail: 'Start taking orders. The dashboard, KDS, and guest-facing menu all sync in real time.' },
      ],
      primaryCta:   { label: 'Start Free — Web App', href: '#' },
      secondaryCta: { label: 'Download iOS App',     href: '#' },
      systemReqs: ['Any modern browser (no install needed for management)', 'iOS 14+ or Android 10+ for mobile app', 'Tablet or monitor for Kitchen Display']
    }
  ];
}
