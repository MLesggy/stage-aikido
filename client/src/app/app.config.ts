import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { authInterceptor } from './services/auth-interceptor/auth-interceptor.service';
import { routes } from './app.routes';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
    withInterceptors([authInterceptor])
    ),
    {
      provide: 'API_URL',
      useValue: process.env['NODE_ENV'] === 'production' ? '/api' : 'https://stage-aikido-production.up.railway.app/api',
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    }, //disabling error while loading img
  ],
};
