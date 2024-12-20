import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Marker } from '../models/marker.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() { }

  // Contiene i cassonetti fetchati dal server
  public markerData: Marker[] = [];

  public reports: Report[] = [];

  // Ottenere un bin
  async getBin(): Promise<void> {
    const getUrl = `http://localhost:8080/trashcan/list`;

    try {
      // Effettua la chiamata HTTP per ottenere i dati dei marker
      const response = await axios.get(getUrl);
      this.markerData = response.data.response as Marker[]; // Modifica se il formato dei dati locali è diverso
      this.dataSubject.next(this.markerData); // Aggiorna il BehaviorSubject con i nuovi dati ricevuti
      console.log(response.data.response);
    } catch (error) {
      // Gestione degli errori nella chiamata
      console.error('Errore durante il recupero dei dati:', error);
    }
  }

  // Ottenere segnalazioni
  async getReport(): Promise<void> {
    const getUrl = `http://localhost:8080/report/list`;

    try {
      // Effettua la chiamata HTTP per ottenere i dati dei marker
      const response = await axios.get(getUrl);
      this.reports = response.data.response as Report[]; // Modifica se il formato dei dati locali è diverso
      this.reportSubject.next(this.reports); // Aggiorna il BehaviorSubject con i nuovi dati ricevuti
      console.log(response.data.response);
    } catch (error) {
      // Gestione degli errori nella chiamata
      console.error('Errore durante il recupero dei dati:', error);
    }
  }

  // Restituisci
  getMarkerData(): Marker[] {
    // Restituisce i dati dei marker
    return this.markerData;
  }

  // Crea un BehaviorSubject per trasmettere la stringa
  public dataSubject = new BehaviorSubject<Marker[]>([]);
  currentData$ = this.dataSubject.asObservable();

  // Metodo per aggiornare il valore della stringa
  changeData(newData: Marker[]): void {
    this.dataSubject.next(newData); // Aggiorna il BehaviorSubject con i nuovi dati
  }

   // Crea un BehaviorSubject per trasmettere la stringa
   public reportSubject = new BehaviorSubject<Report[]>([]);
   currentReportData$ = this.reportSubject.asObservable();

   // Metodo per aggiornare il valore della stringa
   changeReportData(newData: Report[]): void {
     this.reportSubject.next(newData); // Aggiorna il BehaviorSubject con i nuovi dati
   }

  // Metodo per pulire i marker
  public clearMarkers(): void {
    this.dataSubject.next([]); // Aggiorna il BehaviorSubject
    console.log('Tutti i marker sono stati rimossi dalla mappa.');
  }

}
