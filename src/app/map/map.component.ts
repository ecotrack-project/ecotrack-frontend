import { Component, AfterViewInit } from '@angular/core';
// import * as data from '../../assets/binsBari.json';
import * as data from '../../assets/binsAltamura.json';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  map: google.maps.Map | null = null;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Inizializza la mappa
          this.map = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
              center: currentLocation,
              zoom: 15,
              mapId: 'd97e1a9f930f1239',
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }
          );

          // Aggiunge un marker sulla posizione
          new google.maps.Marker({
            position: currentLocation,
            map: this.map,
            title: 'Posizione Attuale',
          });

          // Aggiunge i marker dal JSON
          this.addMarkers();

          // Calcola e visualizza la rotta
          this.calculateRoute(currentLocation);
        },
        (error) => console.error('Errore nella geolocalizzazione', error)
      );
    } else {
      console.error('Geolocalizzazione non supportata');
    }
  }

  // Metodo per aggiungere i marker dei cassonetti
  addMarkers() {
    const elements = (data as any).default;

    elements.forEach((item: any) => {
      const position = {
        lat: item.location.latitude,
        lng: item.location.longitude,
      };

      new google.maps.Marker({
        position,
        map: this.map!,
        title: item.description,
        icon: {
          url: `assets/icons/${item.description.toLowerCase()}.png`, // Icona personalizzata in base al nome rifiuto
          scaledSize: new google.maps.Size(32, 32), // Dimensione icona
        },
      });
    });
  }

  // Metodo per calcolare la rotta
  calculateRoute(currentLocation: google.maps.LatLngLiteral) {
    if (!this.map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });

    // Waypoints dell'indifferenziato per rotta
    const waypoints = [
      { location: { lat: 40.824575, lng: 16.556077 }, stopover: true },
      { location: { lat: 40.829741, lng: 16.544378 }, stopover: true },
      { location: { lat: 40.824003, lng: 16.550899 }, stopover: true },
      { location: { lat: 40.831267, lng: 16.554194 }, stopover: true },
      { location: { lat: 40.826993, lng: 16.552921 }, stopover: true },
    ];

    const request: google.maps.DirectionsRequest = {
      origin: currentLocation,
      destination: currentLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true, // Flag che ottimizza la rotta
      waypoints: waypoints,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Errore rotta', status);
      }
    });
  }
}
