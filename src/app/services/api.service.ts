import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Marker } from '../models/marker.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  public markerData: Marker[] = [];

  // API Testing with JSONBin

  // JSONBin URL
  private url = 'https://api.jsonbin.io/v3/bins/';

  // XMasterKey
  private apiKey = '$2a$10$2seM6VL/O0wr/AVrbF2Jhu9bT/MHKhdZA1RwXOPY/C5wBjQgHatSm';

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

  // Ottieni la posizione corrente
  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            // Gestione degli errori di geolocalizzazione
            console.error('Errore nella geolocalizzazione:', error);
            reject(error);
          }
        );
      } else {
        // Caso in cui la geolocalizzazione non è supportata
        console.error('Geolocalizzazione non supportata');
        reject('Geolocalizzazione non supportata');
      }
    });
  }



  // Calcola la route
  calculateRoute( origin: { lat: number; lng: number }, waypoints: { location: { lat: number; lng: number }; stopover: boolean }[]): Observable<any> {

    return new Observable((observer) => {
      const directionsService = new google.maps.DirectionsService();

      // Configura la richiesta per calcolare la route
      const request: google.maps.DirectionsRequest = {
        origin,
        destination: origin, // Percorso circolare
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints,
        optimizeWaypoints: true,
      };

      // Richiesta alla Google Directions API
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observer.next(result); // Restituisce il risultato se la chiamata ha successo
          observer.complete();
        } else {
          // Gestione degli errori nella chiamata alla Directions API
          console.error('Errore durante il calcolo della route:', status);
          observer.error(status);
        }
      });
    });
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

  // Metodo per pulire i marker
  public clearMarkers(): void {
    this.dataSubject.next([]); // Aggiorna il BehaviorSubject
    console.log('Tutti i marker sono stati rimossi dalla mappa.');
  }

  private method2Source = new Subject<void>();
  method2$ = this.method2Source.asObservable();

  // Metodo per attivare un evento personalizzato
  triggerMethod2(): void {
    this.method2Source.next();
  }

}
