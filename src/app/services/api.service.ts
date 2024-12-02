import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API Testing with JSONBin

  // JSONBin URL
  private url = "https://api.jsonbin.io/v3/bins/";

  // XMasterKey
  private apiKey = "$2a$10$2seM6VL/O0wr/AVrbF2Jhu9bT/MHKhdZA1RwXOPY/C5wBjQgHatSm";

  // Bin IDs
  private plasticBin = "674db959ad19ca34f8d41e44";
  private paperBin = "674dbd90e41b4d34e45e6604";
  private glassBin = "674dbeafacd3cb34a8b2a0e6";
  private organicBin = "674dbe02ad19ca34f8d42161";
  private unrecyclableBin = "674dbdedacd3cb34a8b2a078";

  constructor() { }

  // Ottenere un bin (dati da un bin esistente usando l'ID)
  async getBin(binId: string) {
    const getUrl = `https://api.jsonbin.io/v3/b/${binId}`;

    try {
      const response = await axios.get(getUrl, {
        headers: {
          'X-Master-Key': this.apiKey,
        },
      });
      console.log("Bin ottenuto:", response.data);
    } catch (error) {
      console.error("Errore durante l'ottenimento del bin:", error);
    }
  }

  // Crea un BehaviorSubject per trasmettere la stringa
  private dataSubject = new BehaviorSubject<string>('');
  currentData$ = this.dataSubject.asObservable();

  // Metodo per aggiornare il valore della stringa
  changeData(newData: string) {
    this.dataSubject.next(newData);
  }
}
