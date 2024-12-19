import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Microservices
import { UserComponent } from '../user/user.component';
import { LoginComponent } from '../login/login.component';
import { ApiService } from '../../services/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    UserComponent,
    LoginComponent,
    CommonModule,
    HttpClientModule
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
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  // ApiService call
  onApiCall() {
    // Passa la stringa al service
    this.apiService.getBin();
  }

  // Variables
  sidenavWidth: any;
  isUserLoggedIn: boolean = false;
  sidenavState: string | undefined;

  ngOnInit(): void {
    this.checkTokenAndSetState();
  }

  ngOnChanges(): void {
    this.checkTokenAndSetState();
  }

  private checkTokenAndSetState(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('jwtToken');
      if (token && this.isValidToken(token)) {
        this.isUserLoggedIn = true;
        this.sidenavWidth = '20vw';
      } else {
        this.isUserLoggedIn = false;
        this.sidenavWidth = 'calc(100% - 40px)';
      }
    }
    this.updateSidenavState();
  }

  // Change Sidenav size
  private updateSidenavState(): void {
    this.sidenavState = this.isUserLoggedIn ? 'open' : 'closed';
  }

  private isValidToken(token: string): boolean {
    try {
      if (!token) return false; // Verifica token vuoto o undefined
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  // Login
  loginUser() {
    // Execute login with an http request
    this.http.post('http://localhost:8080/authenticate/login', {
      email: 'salvigesualdo2@libero.it',
      password: 'Salvatore2001!'
    }).subscribe({
      next: (res: any) => {
        // if the request is successful, save the token in the local storage
        console.log('Auth ok');
        this.updateLoginState(true, res.jwt);
      },
      error: (err: any) => {
        // TODO: handle error
        console.error('Auth error');
      }
    });
  }

  // Logout
  logoutUser() {
    this.updateLoginState(false);
  }

  private updateLoginState(isLoggedIn: boolean, token?: string): void {
    this.isUserLoggedIn = isLoggedIn;
    this.sidenavWidth = isLoggedIn ? '20vw' : 'calc(100% - 40px)';

    if (isLoggedIn && token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
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
