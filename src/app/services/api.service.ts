import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Subject } from 'rxjs';
import { Marker } from '../models/marker.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor() { }


  public markerData: Marker[] = [];

  // API Testing with JSONBin

  // JSONBin URL
  private url = "https://api.jsonbin.io/v3/bins/";

  // XMasterKey
  private apiKey = "$2a$10$2seM6VL/O0wr/AVrbF2Jhu9bT/MHKhdZA1RwXOPY/C5wBjQgHatSm";

  // Ottenere un bin
  async getBin(): Promise<void> {

    const getUrl = `http://localhost:8080/trashcan/list`;

    try {
      const response = await axios.get(getUrl);
      this.markerData = response.data.response as Marker[]; // Modifica se il formato dei dati locali è diverso
      this.dataSubject.next(this.markerData); // Aggiorna il BehaviorSubject con i nuovi dati ricevuti e serve per aggiornare la mappa con i nuovi dati
      console.log(response.data.response);
    } catch (error) {
      console.error(error);
    }

  }



  // Restituisci
  getMarkerData(): Marker[] {
    return this.markerData;
  }

  // Crea un BehaviorSubject per trasmettere la stringa
  public dataSubject = new BehaviorSubject<Marker[]>([]);
  currentData$ = this.dataSubject.asObservable();

  // Metodo per aggiornare il valore della stringa
  changeData(newData: Marker[]) {
    this.dataSubject.next(newData);
  }



  // METODO PER CHIAMARE METODO DI UN COMPONENTE IN UN ALTRO COMPONENTE
  private calculateRoute = new Subject<any>();

  route$ = this.calculateRoute.asObservable();


  callCalculateRoute(parameter: any) {
    this.calculateRoute.next(parameter); // next serve per inviare un valore al Subject e attivare il metodo in ascolto su di esso (in questo caso il metodo calculateRoute)
  }

  private method2Source = new Subject<void>();
  method2$ = this.method2Source.asObservable();
  triggerMethod2() {
    this.method2Source.next();
  }

  // Metodo per pulire i marker
  public clearMarkers(): void {
    this.dataSubject.next([]); // Aggiorna il BehaviorSubject
    console.log("Tutti i marker sono stati rimossi dalla mappa.");
  }


}
