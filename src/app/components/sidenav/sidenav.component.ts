import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Microservices
import { UserComponent } from '../user/user.component';
import { LoginComponent } from '../login/login.component';
import { ApiService } from '../../services/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    UserComponent,
    LoginComponent,
    CommonModule
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss',
  ],
  animations: [
    trigger('sidenavAnimation', [
      state('open', style({ width: '20vw' })),
      state('closed', style({ width: 'calc(100% - 40px)' })),
      transition('open <=> closed', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class SidenavComponent {

  // Constructor
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  // ApiService call
  onApiCall() {
    // Passa la stringa al service
    this.apiService.getBin();
  }

  // Variables
  isUserLoggedIn: boolean = false;
  sidenavWidth: any;
  sidenavState: string | undefined;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isUserLoggedIn = loggedIn;
      this.checkTokenAndSetState();
      this.updateSidenavState();
      this.cdr.detectChanges();
    });
  }

  private checkTokenAndSetState(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('jwtToken');
      if (token && this.authService.isValidToken(token)) {
        this.isUserLoggedIn = true;
        this.sidenavWidth = '20vw';
      } else {
        this.isUserLoggedIn = false;
        this.sidenavWidth = 'calc(100% - 40px)';
      }
    }
  }

  // Change Sidenav size
  private updateSidenavState(): void {
    this.sidenavState = this.isUserLoggedIn ? 'open' : 'closed';
    this.sidenavWidth = this.isUserLoggedIn ? '20vw' : 'calc(100% - 40px)';
  }

  // Logout
  logoutUser() {
    this.authService.logout();
  }

  calculateRoute(): void {
    // Controlla se ci sono bidoni selezionati
    if (!this.apiService.markerData || this.apiService.markerData.length === 0) {
      console.warn('Nessun dato disponibile per calcolare la route.');
      return;
    }

    // Creazione dei waypoints basati sui marker (bidoni)
    const waypoints = this.apiService.markerData.map((marker) => ({
      location: { lat: marker.latitude, lng: marker.longitude },
      stopover: true, // Ogni waypoint è un punto di sosta
    }));

    if (waypoints.length === 0) {
      console.warn('Nessun waypoint valido per calcolare la route.');
      return;
    }

    // Ottieni la posizione corrente
    this.apiService.getCurrentLocation().then((currentLocation) => {
      // Chiamata al servizio per calcolare la route
      this.apiService.calculateRoute(currentLocation, waypoints).subscribe(
        (response) => {
          console.log('Route calcolata con successo:', response);
        },
        (error) => {
          console.error('Errore nel calcolo della route:', error);
        }
      );
    }).catch((error) => {
      console.error('Errore nella geolocalizzazione:', error);
    });
  }

  callMethod2(): void {
    this.apiService.triggerMethod2();
  }
}
