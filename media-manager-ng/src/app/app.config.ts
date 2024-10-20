import { ApplicationConfig, provideZoneChangeDetection, type Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import '@angular/common/locales/global/es';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MEDIA_STORAGE_SERVICE } from './models/media-service.model';
// import { MediaLocalStorageService } from './services/media-local-storage.service';
import { MediaHttpStorageService } from './services/media-http-storage.service';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { httpAuthorizationInterceptor } from './interceptors/http-authorization.interceptor';
import { environment } from '../environments/environment';
import { MediaLocalStorageService } from './services/media-local-storage.service';

let mediaStorageProvider: Provider = {
  provide: MEDIA_STORAGE_SERVICE,
  useClass: MediaHttpStorageService, // Aquí podemos decidir que implementación en concreto utilizar: LocalStorage o Http
};

if (environment.storageType === 'local') {
  mediaStorageProvider = {
    provide: MEDIA_STORAGE_SERVICE,
    useClass: MediaLocalStorageService, // Aquí podemos decidir que implementación en concreto utilizar: LocalStorage o Http
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpAuthorizationInterceptor, httpErrorInterceptor])),
    mediaStorageProvider,
  ],
};
