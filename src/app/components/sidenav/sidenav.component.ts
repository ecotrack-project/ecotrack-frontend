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
    console.log('Chiamata al metodo 1111111111111111111111111');
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
      // Chiamata per caricare i dati
      this.apiService.getBin();
      this.apiService.getReport();
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

}
