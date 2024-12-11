import { ApiService } from "./../../services/api.service";
import { MapComponent } from "./../map/map.component";
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
  styleUrl: './user.component.scss'
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


  // Update the task
  update(completed: boolean, index?: number) {

    this.task.update((task) => {

      this.checkedBins("Plastica");

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


  // chosenTrashType
  checkedBins(trashType: string) {

    if(trashType === 'Plastica') {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType === trashType));
    } else if(trashType === 'Carta') {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType === trashType));
    } else if(trashType === 'Vetro') {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType === trashType));
    } else if(trashType === 'Umido') {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType === trashType));
    } else if(trashType === 'Indifferenziato') {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType === trashType));
    } else {
      console.log(this.apiService.markerData.filter((marker) => marker.trashType));
    }
  }










}
