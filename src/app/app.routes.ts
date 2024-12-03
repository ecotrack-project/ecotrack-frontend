import { Routes } from '@angular/router';

// Components to route
import { MapComponent } from './components/map/map.component';

// Defines a route for each component
export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },  // Default route
  { path: '', component: MapComponent },
];