import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Microservices
import { UserComponent } from '../user/user.component';
import { LoginComponent } from '../login/login.component';
import { ApiService } from '../../services/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';

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
  styleUrl: './sidenav.component.scss',

  animations: [
    trigger('sidenavAnimation', [
      state(
        'open',
        style({
          width: '20vw',
        })
      ),
      state(
        'closed',
        style({
          width: 'calc(100% - 40px)',
        })
      ),
      transition('open <=> closed', [animate('0.5s ease-in-out')]),
    ]),

  ],
})

export class SidenavComponent {

  // Constructor
  constructor(private apiService: ApiService) { }

  // ApiService call
  onApiCall(selectedValue: string) {
    // Passa la stringa al service
    this.apiService.getBin(selectedValue);
  }

  // Variables
  sidenavWidth: any;
  isUserLoggedIn: boolean = false;
  sidenavState: string | undefined;

  // OnInit
  ngOnInit(): void {

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

  // OnChange
  ngOnChanges(): void {

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

  // Validate token JWT
  private isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  // Login
  loginUser() {
    this.isUserLoggedIn = true;
    this.sidenavWidth = '20vw';
    localStorage.setItem(
      'jwtToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1LCJyb2xlIjoidXNlciIsImV4cCI6MTc2MzA0NDUxNH0.HmYTDri4DjxMNVfHWtWbGlR8uL0YUsn95Xr'
    );
    this.updateSidenavState();
  }

  // Logout
  logoutUser() {
    this.isUserLoggedIn = false;
    this.sidenavWidth = 'calc(100% - 40px)';
    localStorage.removeItem('jwtToken');
    this.updateSidenavState();
  }

  // METODO PER CHIAMARE METODO COMPONENTE DA ALTRO COMPONENTE
  calculateRoute() {
    this.apiService.callCalculateRoute();
  }

  callMethod2() {
    this.apiService.triggerMethod2();
  }

}
