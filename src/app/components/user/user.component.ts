import { ApiService } from './../../services/api.service';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
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
import { Report } from '../../models/report.model';

import { MapService } from '../../services/map.service';

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
export class UserComponent implements OnInit {
  @Input() logoutCallback!: () => void;

  // External variable to store selected bins
  public selectedBins: Marker[] = [];

  // Reports fetched from the server
  public reports: Report[] = [];

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

  // Computed signal for partial completion of subtasks
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

  constructor(private apiService: ApiService, private mapService: MapService) {}

  ngOnInit(): void {
    // Fetch reports during component initialization
    this.apiService.currentReportData$.subscribe({
      next: (reports) => {
        this.reports = reports;
        console.log('Reports updated:', this.reports);
      },
      error: (error) => {
        console.error('Error receiving report updates:', error);
      },
    });

    // Fetch initial reports
    this.apiService.getReport();
  }

  // Handle user logout
  doLogout(): void {
    if (this.logoutCallback) {
      this.logoutCallback();
    }
  }

  // Update task completion status
  update(completed: boolean, index?: number): void {
    console.log('Task update triggered:', completed, index);

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

  // Handle keyboard event for report selection
  handleKeyDown(event: KeyboardEvent): void {
    console.log('Keydown event on reports tab:', event.key);
    this.apiService.changeReportData(this.reports);
  }

  // Filter bins based on trash type
  private filterBinsByType(trashType: string): void {
    this.selectedBins = this.apiService.markerData.filter(
      (marker) => marker.trashType === trashType
    );
    if (trashType === 'Tutto') {
      this.selectedBins = [...this.apiService.markerData];
      console.log('All bins are now displayed:', this.selectedBins);
    }
    console.log(`Bins filtered by trash type "${trashType}":`, this.selectedBins);

  }

  // Calculate and navigate route
  calculateRoute(): void {
    console.log('Calculating route...');
    this.mapService.callMapMethod();
  }

  
}
