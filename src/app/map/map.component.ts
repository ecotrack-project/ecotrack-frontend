import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Marker } from '../models/marker.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements AfterViewInit {
  
  // Define variables
  markerData: Marker[] = [];
  map: google.maps.Map | null = null;
  trashType: String="";
  currentInfoWindow: any;
  

  // Constructor
  constructor(private apiService: ApiService) {}

  // Initialize map only after DOM
  ngAfterViewInit(): void {
    this.apiService.currentData$.subscribe((data: Marker[]) => {
      this.markerData = data;
      this.initMap();
    });
    // Carica i dati
    this.apiService.getBin("674dfa9cad19ca34f8d44358");
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
          
          // Add markers
          this.addMarkers();

          // Add Marker on user position
          new google.maps.Marker({
            position: currentLocation,
            map: this.map,
            title: 'Posizione Attuale',
          });
    
          console.warn(this.markerData)
          console.log(this.markerData)

          // Calcola e visualizza la rotta
          // this.calculateRoute(currentLocation);
        },
        (error) => console.error('Errore nella geolocalizzazione', error)
      );
    } else {
      console.error('Geolocalizzazione non supportata');
    }
  }

  // Add markers method
  addMarkers() {
    this.markerData.forEach((item) => {
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
          url: `assets/icons/${item.description.toLowerCase()}.png`,
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3>${item.description}</h3>
            <p>Livello riempimento: ${item.fill_level}%</p>
          </div>
        `,
      });
  
      marker.addListener("click", () => {
        if (this.currentInfoWindow) {
          this.currentInfoWindow.close();
        }
        infoWindow.open(this.map, marker);
        this.currentInfoWindow = infoWindow;
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

