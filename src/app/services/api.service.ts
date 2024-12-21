import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { Marker } from '../models/marker.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  // Contiene i cassonetti fetchati dal server
  public markerData: Marker[] = [];

  // Contiene le segnalazioni fetchate dal server
  public reports: Report[] = [];

  // BehaviorSubjects for sharing marker and report data
  public dataSubject = new BehaviorSubject<Marker[]>([]);
  public reportSubject = new BehaviorSubject<Report[]>([]);

  currentData$ = this.dataSubject.asObservable();
  currentReportData$ = this.reportSubject.asObservable();

  // Fetch marker data (bins) from the server
  async getBin(): Promise<void> {
    const getUrl = `http://localhost:8080/trashcan/list`;

    try {
      const response = await axios.get(getUrl);
      this.markerData = response.data.response as Marker[]; // Ensure proper type
      this.dataSubject.next(this.markerData); // Update BehaviorSubject
      console.log('Marker data fetched successfully:', this.markerData);
    } catch (error) {
      console.error('Error fetching marker data:', error);
    }
  }

  // Fetch report data from the server
  async getReport(): Promise<void> {
    const getUrl = `http://localhost:8080/report/list`;

    try {
      const response = await axios.get(getUrl);
      this.reports = response.data.response as Report[]; // Ensure proper type
      this.reportSubject.next(this.reports); // Update BehaviorSubject
      console.log('Report data fetched successfully:', this.reports);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  }

  // Get all marker data
  getMarkerData(): Marker[] {
    return this.markerData;
  }

  // Get all reports
  getReports(): Report[] {
    return this.reports;
  }

  // Update marker data
  changeData(newData: Marker[]): void {
    this.dataSubject.next(newData);
  }

  // Update report data
  changeReportData(newData: Report[]): void {
    this.reportSubject.next(newData);
  }

  // Clear all markers
  public clearMarkers(): void {
    this.dataSubject.next([]); // Clear markers in the BehaviorSubject
    console.log('All markers have been cleared from the map.');
  }

  // Helper function to fetch initial data for markers and reports
  async fetchInitialData(): Promise<void> {
    try {
      console.log('Fetching initial data for markers and reports...');
      await Promise.all([this.getBin(), this.getReport()]);
      console.log('Initial data fetch complete.');
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }
}
