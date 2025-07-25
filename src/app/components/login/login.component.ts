import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

// Import material components
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

// Validation
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createEmailFormControl, createPasswordFormControl } from '../../utils/validation.utils';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  // Constructor
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.errorLogin$.subscribe((error) => {
      this.errorLogin = error;
      this.cdr.detectChanges();
    });
   }

  // Variable
  errorLogin: boolean = false;

  // Email control
  emailFormControl = createEmailFormControl();

  // Password control
  passwordFormControl = createPasswordFormControl();

  // Hide password
  hide = signal(true);

  // Stop propagation
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Login
  doLogin() {
    this.authService.login(this.emailFormControl.value, this.passwordFormControl.value);
  }

}
