import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
// import * as data from '../../assets/binsBari.json';
import * as data from '../../assets/binsAltamura.json';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  // Constructor
  constructor(private apiService: ApiService) {}

  // MakerData
  markerData={};
  trashType: String="";
  
  // Define Google Map
  map: google.maps.Map | null = null;

  // Initialize map only after DOM
  ngAfterViewInit(): void {
    this.apiService.currentData$.subscribe(data => {
      this.markerData = data;
      // Puoi fare altre cose con i dati qui
    });
    this.initMap();
  }
  
  // Initialize map method
  initMap() {

    // Position method
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Map
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

          // Add Marker on user position
          new google.maps.Marker({
            position: currentLocation,
            map: this.map,
            title: 'Posizione Attuale',
          });

          // Add Marker
          this.addMarkers();

          this.getMarkers();

          // Calcola e visualizza la rotta
          this.calculateRoute(currentLocation);
        },
        (error) => console.error('Errore nella geolocalizzazione', error)
      );
    } else {
      console.error('Geolocalizzazione non supportata');
    }
  }

  // Bin IDs
  private plasticBin = "674db959ad19ca34f8d41e44";
  private paperBin = "674dbd90e41b4d34e45e6604";
  private glassBin = "674dbeafacd3cb34a8b2a0e6";
  private organicBin = "674dbe02ad19ca34f8d42161";
  private unrecyclableBin = "674dbdedacd3cb34a8b2a078";

  // Get markers method
  getMarkers() {
    this.apiService.getBin(this.paperBin)
  }

  // Add markers method
  addMarkers() {
    const elements = (data as any).default;

    // Traccia marker aperto
    let currentInfoWindow: google.maps.InfoWindow | null = null;

    elements.forEach((item: any) => {
      const position = {
        lat: item.location.latitude,
        lng: item.location.longitude,
      };

      // Marker
      const marker = new google.maps.Marker({
        position,
        map: this.map!,
        title: item.description,
        icon: {
          url: `assets/icons/${item.description.toLowerCase()}.png`, // Icona personalizzata in base al nome rifiuto
          scaledSize: new google.maps.Size(32, 32), // Dimensione icona
        },
      });

      // Marker info
      const infoWindow = new google.maps.InfoWindow({
        content: `
        <div style="padding: 10px;">
          <h3>${item.description}</h3>
          <p>Livello riempimento: ${item.fill_level}%</p>
        </div>
      `,
      });

      // Marker click
      marker.addListener("click", () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(this.map, marker);
        currentInfoWindow = infoWindow;
      });

    });
  }

  // Calculate Route method
  calculateRoute(currentLocation: google.maps.LatLngLiteral) {
    if (!this.map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
    });

    // Waypoints
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
      optimizeWaypoints: true, // Optimized route
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
