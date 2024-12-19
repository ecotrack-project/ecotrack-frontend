import { ApiService } from './../../services/api.service';
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
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {

  @Input() logoutCallback!: () => void;

  // Variabile esterna per conservare i bidoni scelti
  public selectedBins: Marker[] = [];

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

  // Costruttore
  constructor(private apiService: ApiService) {}

  // Logout
  doLogout(): void {
    if (this.logoutCallback) {
      this.logoutCallback();
    }
  }


  // Aggiornamento del task
  update(completed: boolean, index?: number): void {
    console.log('Aggiornamento task:', completed, index);

    this.task.update((task) => {
      this.apiService.clearMarkers();

      if (index !== undefined) {
        const trashType = task.subtasks?.[index]?.name;
        if (trashType) {
          this.filterBinsByType(trashType);
        }
        this.apiService.changeData(this.selectedBins);
      } else {
        task.completed = completed;
        task.subtasks?.forEach((t) => (t.completed = completed));
      }

      if (index !== undefined) {
        task.subtasks?.forEach((t, i) => (t.completed = i === index ? completed : false));
        task.completed = task.subtasks?.every((t) => t.completed) ?? true;
      }

      return { ...task };
    });
  }


  // Funzione per filtrare i bidoni in base al tipo di rifiuto
  private filterBinsByType(trashType: string): void {
    this.selectedBins = this.apiService.markerData.filter(
      (marker) => marker.trashType === trashType
    );
    console.log(`Bidoni filtrati per tipo "${trashType}":`, this.selectedBins);
  }

  // Calcola la route basata sui bidoni selezionati
  calculateRoute(): void {
    if (this.selectedBins.length === 0) {
      console.warn('Nessun bidone selezionato per calcolare la route.');
      return;
    }

    // Creazione dei waypoints basati sui bidoni selezionati
    const waypoints = this.selectedBins.map((bin) => ({
      location: { lat: bin.latitude, lng: bin.longitude },
      stopover: true,
    }));

    // Ottieni la posizione corrente
    this.apiService.getCurrentLocation().then((currentLocation) => {
      this.apiService.calculateRoute(currentLocation, waypoints).subscribe(
        (response) => {
          console.log('Route calcolata con successo:', response);
        },
        (error) => {
          console.error('Errore nel calcolo della route:', error);
        }
      );
    });
  }








}
