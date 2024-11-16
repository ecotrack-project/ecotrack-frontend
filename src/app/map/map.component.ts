import { Component, AfterViewInit } from '@angular/core';
import * as data from '../../assets/bins.json';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  constructor() {}

  // Metodo per non precaricare
  ngAfterViewInit(): void {
    this.mapconfig();
  }

  // Metodo per generazione mappa
  async mapconfig() {
    const L = await import('leaflet');

    // Metodo per ottenere la posizione GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Crea le icone personalizzate
          const mylocation = L.icon({
            iconUrl: 'assets/icons/location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });


          // Imposta mappa
          const map = L.map('map').setView([latitude, longitude], 15);

          // Layer mappa
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Metodo per aggiungere un marker con l'icona personalizzata
          L.marker([latitude, longitude], { icon: mylocation }).addTo(map)
            .bindPopup('Posizione attuale')
            .openPopup();

          // Icone cassonetti
          const indifferenziato = L.icon({
            iconUrl: 'assets/icons/indifferenziato.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          const organico = L.icon({
            iconUrl: 'assets/icons/organico.png',
            iconSize: [32, 32], 
            iconAnchor: [16, 32], 
            popupAnchor: [0, -32] 
          });

          const plastica = L.icon({
            iconUrl: 'assets/icons/plastica.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          const carta = L.icon({
            iconUrl: 'assets/icons/carta.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          const vetro = L.icon({
            iconUrl: 'assets/icons/vetro.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          // Tipo per ciascun elemento del JSON
          interface Element {
          id: number;
          description: string;
          fill_level: number;
          location: {
          latitude: number;
          longitude: number;
          };
          }

          // Caricare i dati del JSON
          const elements = (data as any).default;

          elements.forEach((item: Element) => {
            const latitude = item.location.latitude;
            const longitude = item.location.longitude;
          
            // Variabile per l'icona da usare
            let icon;
          
            // Usare uno switch per scegliere l'icona in base a una condizione
            switch (true) {
              case (item.description == "Indifferenziato"):
                icon = indifferenziato; 
                break;
              case (item.description == "Organico"):
                icon = organico
                break;
              case (item.description == "Plastica"):
                icon = plastica
                break;
              case (item.description == "Carta"):
                icon = carta
                break;
              case (item.description == "Vetro"):
                icon = vetro
                break;
              default:
                break;
            }
          
            // Aggiungi il marker alla mappa con l'icona selezionata
            L.marker([latitude, longitude], { icon: icon })
              .addTo(map)
              .bindPopup(() => {
                return `
                  <div id="bindata">
                    <p>Tipo rifiuto: ${item.description}</p>
                    <p>Livello di riempimento: ${item.fill_level}%</p>
                  </div>
                `;
              });
              ; // Popup con la descrizione
          });
          
          
        },

        // Errore
        (error: any) => {
          console.error('Errore nella geolocalizzazione', error);
        }
      );
    } else {
      console.error('Geolocalizzazione non supportata');
    }
    
  }
}
