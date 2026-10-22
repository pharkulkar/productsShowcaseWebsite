import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { SchemaService } from '../../services/schema.service';

export type ActiveTab = 'overview' | 'api' | 'pricing';

interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

interface CapabilityRow {
  capability: string;
  starter: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  features: ProductFeature[];
  terminalLines: string[];
  capabilities: CapabilityRow[];
  schema: {
    applicationCategory: string;
    description: string;
  };
}

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-showcase.component.html',
  styleUrl: './product-showcase.component.scss'
})
export class ProductShowcaseComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private schemaService = inject(SchemaService);

  activeTab = signal<ActiveTab>('overview');
  expandedFeature = signal<string | null>(null);
  isPreviewPlaying = signal<boolean>(true);

  private paramId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id') ?? ''))
  );

  readonly products: Product[] = [
    {
      id: 'whisper-ai',
      name: 'Whisper AI',
      tagline: 'Your invisible co-pilot for every meeting',
      description: 'Whisper AI runs as a ghost overlay that your screen-share and camera never capture. It transcribes the conversation in real time, understands context, and surfaces the exact talking points, data, or follow-up questions you need — delivered silently in the corner of your screen before the silence gets awkward.',
      category: 'AI Assistant',
      features: [
        { title: 'Invisible Overlay', description: 'The UI is excluded from all screen-capture APIs — invisible to Zoom, Meet, and Teams screen share by design.', icon: '⬡' },
        { title: 'Real-time Transcription', description: 'On-device Whisper model transcribes both sides of the conversation with under 800ms latency.', icon: '⟡' },
        { title: 'Context-aware Suggestions', description: 'GPT-4o reads the live transcript and surfaces relevant talking points, facts, and rebuttals automatically.', icon: '◈' },
        { title: 'Meeting Memory', description: 'Stores a searchable log of every meeting with AI-generated summaries and action items extracted automatically.', icon: '⟢' }
      ],
      terminalLines: [
        '  Whisper AI — session started',
        '  ✓ Overlay hidden from screen capture',
        '  ✓ Microphone: active (system + mic mix)',
        '  ✓ Model: whisper-large-v3 (local)',
        '',
        '  [Transcript] "What\'s your current churn rate?"',
        '  ─────────────────────────────────────────',
        '  💡 Suggestion: "3.2% MoM — down from 5.1%',
        '     after onboarding redesign in Q3."',
        '  ─────────────────────────────────────────',
      ],
      capabilities: [
        { capability: 'Real-time transcription',       starter: true,          pro: true,            enterprise: true },
        { capability: 'AI talking point suggestions',  starter: '20 / month',  pro: 'Unlimited',     enterprise: 'Unlimited' },
        { capability: 'Invisible screen overlay',      starter: true,          pro: true,             enterprise: true },
        { capability: 'Meeting memory & search',       starter: '7 days',      pro: '1 year',        enterprise: 'Unlimited' },
        { capability: 'Custom AI persona / context',   starter: false,         pro: true,             enterprise: true },
        { capability: 'CRM auto-sync (HubSpot/SF)',    starter: false,         pro: false,            enterprise: true },
        { capability: 'Team shared playbooks',         starter: false,         pro: true,             enterprise: true },
        { capability: 'SOC 2 / data residency',        starter: false,         pro: false,            enterprise: true }
      ],
      schema: {
        applicationCategory: 'BusinessApplication',
        description: 'AI-powered invisible meeting assistant that surfaces real-time talking points during live calls'
      }
    },
    {
      id: 'btc-lens',
      name: 'BTC Lens',
      tagline: 'Live Bitcoin intelligence in your browser toolbar',
      description: 'BTC Lens is a zero-friction Chrome extension that streams real-time Bitcoin price, network health, mempool congestion, and whale wallet alerts directly into your browser toolbar. No account, no backend — all data flows from public on-chain APIs directly to your browser.',
      category: 'Chrome Extension',
      features: [
        { title: 'Live Price Ticker', description: 'BTC/USD price updates every 5 seconds from aggregated exchange feeds with 24h delta and volume.', icon: '◆' },
        { title: 'Mempool Fee Estimator', description: 'Real-time sat/vB fee recommendations for slow, standard, and fast confirmation targets.', icon: '⟡' },
        { title: 'Whale Alert Feed', description: 'Notifies you when wallets move more than configurable BTC thresholds across major exchanges.', icon: '◈' },
        { title: 'Portfolio Tracker', description: 'Track multiple wallets by address — balance and unrealised P&L updated on every block.', icon: '⬡' }
      ],
      terminalLines: [
        '  BTC Lens v2.4.1 — Chrome Extension',
        '  ✓ Feed: Binance + Coinbase + Kraken',
        '  ✓ Mempool.space API connected',
        '  ✓ Block height: 842,107',
        '',
        '  BTC/USD     $ 67,412.50  ▲ +2.34%',
        '  Mempool     142 vB/sat  (fast: 1 block)',
        '',
        '  🐋 Whale alert: 2,400 BTC moved',
        '     Binance cold wallet → unknown',
      ],
      capabilities: [
        { capability: 'Live BTC price ticker',         starter: true,    pro: true,         enterprise: true },
        { capability: 'Mempool fee estimator',         starter: true,    pro: true,         enterprise: true },
        { capability: 'Price refresh interval',        starter: '30s',   pro: '5s',         enterprise: '1s' },
        { capability: 'Whale alert notifications',     starter: false,   pro: true,         enterprise: true },
        { capability: 'Wallet portfolio tracker',      starter: '1 wallet', pro: '10 wallets', enterprise: 'Unlimited' },
        { capability: 'Historical chart (toolbar)',    starter: false,   pro: true,         enterprise: true },
        { capability: 'Custom price alerts',           starter: '2',     pro: 'Unlimited',  enterprise: 'Unlimited' },
        { capability: 'API key — own data source',     starter: false,   pro: false,        enterprise: true }
      ],
      schema: {
        applicationCategory: 'FinanceApplication',
        description: 'Chrome extension for real-time Bitcoin price tracking, mempool fees, and whale wallet alerts'
      }
    },
    {
      id: 'gmb-extractor',
      name: 'GMB Extractor',
      tagline: 'Pull structured business data from Google Maps at scale',
      description: 'GMB Extractor scrapes verified business listings from any Google Maps search query — names, phone numbers, websites, addresses, star ratings, review counts, and category tags — and exports a clean, deduplicated dataset in CSV or JSON. Built for lead generation, market research, and local SEO audits.',
      category: 'Data Tool',
      features: [
        { title: 'Search-to-Export', description: 'Paste any Google Maps URL or search term and extract all visible results in one click.', icon: '◉' },
        { title: 'Deep Field Extraction', description: 'Pulls name, phone, website, address, hours, rating, review count, price tier, and category.', icon: '⟡' },
        { title: 'Deduplication Engine', description: 'Automatically merges duplicate listings based on phone number and address fingerprinting.', icon: '◈' },
        { title: 'Bulk Export', description: 'Export to CSV, JSON, or push directly to Google Sheets with one-click OAuth connection.', icon: '⬡' }
      ],
      terminalLines: [
        '  GMB Extractor — scraping session',
        '  Query: "sushi restaurants London"',
        '  ✓ Search results loaded: 120 listings',
        '  ✓ Pagination: 6 pages detected',
        '',
        '  Extracting fields...',
        '  ✓ 118 / 120 records complete',
        '  ✓ Duplicates removed: 4',
        '  ✓ Export ready → london_sushi.csv',
        '  Fields: name, phone, website, rating, reviews',
      ],
      capabilities: [
        { capability: 'Results per search',            starter: '20',         pro: '500',          enterprise: 'Unlimited' },
        { capability: 'Fields extracted',              starter: 'Basic (5)',  pro: 'Full (12)',     enterprise: 'Full + custom' },
        { capability: 'Export formats',                starter: 'CSV only',   pro: 'CSV + JSON',   enterprise: 'CSV, JSON, Sheets' },
        { capability: 'Saved search templates',        starter: false,        pro: '20',            enterprise: 'Unlimited' },
        { capability: 'Deduplication engine',          starter: false,        pro: true,            enterprise: true },
        { capability: 'Scheduled scrapes',             starter: false,        pro: false,           enterprise: true },
        { capability: 'Google Sheets live sync',       starter: false,        pro: true,            enterprise: true },
        { capability: 'API access',                    starter: false,        pro: false,           enterprise: true }
      ],
      schema: {
        applicationCategory: 'BusinessApplication',
        description: 'Google Maps business data extractor for lead generation, market research, and local SEO audits'
      }
    },
    {
      id: 'tableflow',
      name: 'TableFlow',
      tagline: 'The all-in-one operations platform for restaurants',
      description: 'TableFlow connects reservations, digital menus, tableside ordering, and kitchen display into one fluid system. Staff spend less time on coordination and more time on hospitality. Built for independent restaurants and multi-location operators who are tired of duct-taping five different tools together.',
      category: 'Restaurant Tech',
      features: [
        { title: 'Digital Menu Builder', description: 'Build and update menus in real time — prices, 86\'d items, and specials sync instantly to every table QR code.', icon: '⬡' },
        { title: 'Tableside Ordering', description: 'Guests scan, order, and pay from their phone. Orders go straight to the KDS — no paper tickets, no lost orders.', icon: '⟡' },
        { title: 'Kitchen Display System', description: 'Color-coded order queue with timing alerts and course-fire controls built for high-volume service.', icon: '◈' },
        { title: 'Reservation & Waitlist', description: 'Online booking, walk-in waitlist, and two-way SMS confirmations managed from a single floor view.', icon: '⟢' }
      ],
      terminalLines: [
        '  TableFlow — Floor View  |  Sat 7:42 PM',
        '  ─────────────────────────────────────',
        '  Tables: 18 seated / 4 available / 2 reserved',
        '  Active orders: 34  |  Avg ticket: $48.20',
        '',
        '  KDS Alert: Table 7 — 22 min (entrées)',
        '  ✓ Table 12 — payment complete ($214.50)',
        '  New reservation: 4 guests @ 8:00 PM',
        '  Waitlist: 3 parties (est. 25 min)',
      ],
      capabilities: [
        { capability: 'Digital menu + QR ordering',    starter: true,       pro: true,          enterprise: true },
        { capability: 'Active tables',                 starter: '20',       pro: 'Unlimited',   enterprise: 'Unlimited' },
        { capability: 'Kitchen Display System (KDS)',  starter: '1 screen', pro: '5 screens',   enterprise: 'Unlimited' },
        { capability: 'Online reservations',           starter: true,       pro: true,           enterprise: true },
        { capability: 'SMS guest notifications',       starter: '100/mo',   pro: 'Unlimited',   enterprise: 'Unlimited' },
        { capability: 'Multi-location management',     starter: false,      pro: false,          enterprise: true },
        { capability: 'Sales & tip reports',           starter: 'Daily',    pro: 'Real-time',   enterprise: 'Real-time + API' },
        { capability: 'Stripe payment processing',     starter: true,       pro: true,           enterprise: true }
      ],
      schema: {
        applicationCategory: 'BusinessApplication',
        description: 'All-in-one restaurant operations platform — digital menus, tableside ordering, KDS, and reservations'
      }
    }
  ];

  readonly product = computed(() => {
    const id = this.paramId();
    return this.products.find(p => p.id === id) ?? this.products[0];
  });

  ngOnInit(): void {
    const p = this.product();
    this.schemaService.injectSoftwareSchema({
      name: p.name,
      applicationCategory: p.schema.applicationCategory,
      operatingSystem: 'Cloud',
      description: p.schema.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.8, reviewCount: 1247 },
      url: `https://forge.dev/products/${p.id}`
    });
  }

  ngOnDestroy(): void {
    this.schemaService.removeSchema();
  }

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  toggleFeature(title: string): void {
    this.expandedFeature.update(v => v === title ? null : title);
  }

  isBool(val: string | boolean): val is boolean { return typeof val === 'boolean'; }
}
