import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers, provideClientHydration(withEventReplay())]})
  .catch((err) => console.error(err));
