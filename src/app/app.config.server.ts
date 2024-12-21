import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), // Enables server-side rendering
  ],
};

// Merge appConfig (with HttpInterceptor) and serverConfig
export const config = mergeApplicationConfig(appConfig, serverConfig);
