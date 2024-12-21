import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { AuthInterceptor, LoggingInterceptor} from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configura le rotte dell'applicazione
    provideClientHydration(), // Abilita l'idratazione per le app server-side
    provideAnimationsAsync(), // Supporta animazioni asincrone
    provideHttpClient(withInterceptors([LoggingInterceptor]))// Aggiunge l'interceptor per le richieste HTTP AuthInterceptor, 

  ],
};
