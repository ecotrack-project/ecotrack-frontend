import { ApiService } from './../../services/api.service';
import { MapComponent } from './../map/map.component';
import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Microservices
import { Task } from '../../models/task.model';

// Import material components
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { Marker } from '../../models/marker.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  // Costruttore
  constructor(private apiService: ApiService) {}

  @Input() logoutCallback!: () => void;

  // Logout
  doLogout() {
    if (this.logoutCallback) {
      this.logoutCallback();
    }
  }

  // Checkbox for trash type
  readonly task = signal<Task>({
    name: 'Tutti',
    completed: false,
    subtasks: [
      { name: 'Tutto', completed: false },
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

  // Variabile esterna per conservare i bidoni scelti
  public selectedBins: any[] = [];

  // Update the task
  update(completed: boolean, index?: number) {
    console.log(index);
    console.log(completed);

    this.task.update((task) => {
      // Clear all markers and update selected bins
      this.apiService.clearMarkers();
      if (index !== undefined) {
        const typeselected: any = task.subtasks?.[index].name.toString();
        this.checkedBins(typeselected);
        console.log(this.selectedBins);
        this.apiService.changeData(this.selectedBins || []);
        //this.apiService.CalculateRoute(this.selectedBins);
      }

      if (index === undefined) {
        // Update the main task and all subtasks
        task.completed = completed;
        task.subtasks?.forEach((t) => (t.completed = completed));
      } else {
        // Uncheck all other subtasks
        task.subtasks?.forEach((t, i) => {
          t.completed = i === index ? completed : false;
        });
        // Update the main task's completed status
        task.completed = task.subtasks?.every((t) => t.completed) ?? true;
      }
      return { ...task };
    });
  }

  // Funzione per filtrare i bidoni in base al tipo di rifiuto
  checkedBins(trashType?: string) {
    if (!trashType) {
      // Se trashType è undefined o null, conserva tutti i bidoni
      this.selectedBins = [...this.apiService.markerData]; // Copia l'array di bidoni
      return;
    }

    switch (trashType) {
      case 'Plastica':
      case 'Carta':
      case 'Vetro':
      case 'Organico':
      case 'Indifferenziato':
        this.selectedBins = this.apiService.markerData.filter(
          (marker) => marker.trashType === trashType
        );
        console.log(this.selectedBins);
        break;
      default:
        console.log(`Tipo di rifiuto non valido: ${trashType}`);
        this.selectedBins = this.apiService.getMarkerData();
        break;
    }
  }
}
