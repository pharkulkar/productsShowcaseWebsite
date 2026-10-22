import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./pages/products-hub/products-hub.component').then(m => m.ProductsHubComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-showcase/product-showcase.component').then(m => m.ProductShowcaseComponent)
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs.component').then(m => m.DocsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
