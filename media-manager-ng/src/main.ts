/// <reference types="@angular/localize" />

// import "reflect-metadata"; // Ya no lo importamos aquí para evitar que Angular optimize ese código y rompa en prod. Lo añadiremos a nuestros polyfills
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
