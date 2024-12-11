import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Subject } from 'rxjs';
import { Marker } from '../models/marker.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor() { }

  private markerData: Marker[] = [];

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
      this.dataSubject.next(this.markerData);
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
  private dataSubject = new BehaviorSubject<Marker[]>([]);
  currentData$ = this.dataSubject.asObservable();

  // Metodo per aggiornare il valore della stringa
  changeData(newData: Marker[]) {
    this.dataSubject.next(newData);
  }



  // METODO PER CHIAMARE METODO DI UN COMPONENTE IN UN ALTRO COMPONENTE
  private calculateRoute = new Subject<void>();
  route$ = this.calculateRoute.asObservable();
  callCalculateRoute() {
    this.calculateRoute.next();
  }

  private method2Source = new Subject<void>();
  method2$ = this.method2Source.asObservable();
  triggerMethod2() {
    this.method2Source.next();
  }
}
