import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);