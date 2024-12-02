import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { ApiService } from '../services/api.service';

// Import material components
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

// Email validation
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// Error when invalid control is dirty, touched, or submitted
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  constructor(private apiService: ApiService) {}

  // ApiService call
  onApiCall(selectedValue: string) {
    // Passa la stringa al service
    this.apiService.getBin(selectedValue);
  }

  // Email control
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

  // Variables
  sidenavWidth: any;
  isUserLoggedIn: boolean = false;
  isLoaded: boolean = true;

  // Password
  hide = signal(true);
  sidenavState: string | undefined;

  // Stop propagation
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // OnInit
  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');

    if (token && this.isValidToken(token)) {
      this.isUserLoggedIn = true;
      this.sidenavWidth = '20vw';
    } else {
      this.isUserLoggedIn = false;
      this.sidenavWidth = 'calc(100% - 40px)';
    }

    this.updateSidenavState();

    this.apiService.getBin("674dfa9cad19ca34f8d44358");
  }

  // OnChange
  ngOnChanges(): void {
    this.updateSidenavState();
    this.loadDashboard();
  }

  // Load Dashboard method, used for delayed animation
  private loadDashboard(): void {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
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
    this.isLoaded = false;
  }

  // Checkbox for trash type
  readonly task = signal<Task>({
    name: 'Tutti',
    completed: false,
    subtasks: [
      { name: 'Plastica', completed: false },
      { name: 'Carta', completed: false },
      { name: 'Vetro', completed: false },
      { name: 'Organico', completed: false },
      { name: 'Indifferenziato', completed: false },
    ],
  });

  readonly partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return (
      task.subtasks.some((t) => t.completed) &&
      !task.subtasks.every((t) => t.completed)
    );
  });

  update(completed: boolean, index?: number) {
    this.task.update((task) => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach((t) => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every((t) => t.completed) ?? true;
      }
      return { ...task };
    });
  }

}
