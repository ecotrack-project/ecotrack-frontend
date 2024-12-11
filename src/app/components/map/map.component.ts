import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Marker } from '../../models/marker.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  // Variabili
  markerData: Marker[] = [];
  map: google.maps.Map | null = null;
  trashType: string = "";
  currentInfoWindow: google.maps.InfoWindow | null = null;
  private subscriptions: Subscription = new Subscription();

  // Costruttore
  constructor(private apiService: ApiService) {}

  // Metodo eseguito dopo il caricamento della view
  ngAfterViewInit(): void {
    // Sottoscrizioni ai dati del servizio
    this.subscriptions.add(
      this.apiService.currentData$.subscribe((data: Marker[]) => {
        this.markerData = data;
        this.initMap();
      })
    );

    // Chiamata per caricare i dati
    this.apiService.getBin();
  }

  // Metodo per inizializzare la mappa
  initMap(): void {
    const mapContainer = this.mapElement?.nativeElement;
    if (!mapContainer) {
      console.error('Elemento map non trovato');
      return;
    }
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            this.map = new google.maps.Map(mapContainer, {
              center: currentLocation,
              zoom: 15,
              mapId: 'd97e1a9f930f1239',
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            });

            this.addMarkers();

            // Aggiunge un marker sulla posizione corrente
            new google.maps.marker.AdvancedMarkerElement({
              position: currentLocation,
              map: this.map,
              title: 'Posizione Attuale',
            });

          },
          (error) => {
            console.error('Errore nella geolocalizzazione', error);
            alert('Impossibile ottenere la posizione. Utilizzando la posizione predefinita.');
            this.map = new google.maps.Map(mapContainer, {
              center: { lat: 0, lng: 0 }, // Posizione predefinita
              zoom: 15,
            });
          }
        );
      } else {
        console.error('Geolocalizzazione non supportata');
      }
    }
  }

  // Metodo per aggiungere marker sulla mappa
  addMarkers(): void {
    this.markerData.forEach((item) => {
      const position = { lat: item.latitude, lng: item.longitude };

      const marker = new google.maps.Marker({
        position,
        map: this.map!,
        title: item.trashType,
        icon: {
          url: `assets/icons/${item.trashType.toLowerCase()}.png`,
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3>${item.trashType}</h3>
            <p>Livello riempimento: ${item. fillingLevel}%</p>
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

  // Metodo per calcolare la rotta
  calculateRoute(currentLocation: google.maps.LatLngLiteral): void {
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
      optimizeWaypoints: true,
      waypoints: waypoints,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Errore nel calcolo della rotta', status);
      }
    });
  }

  // Metodo aggiuntivo per eventuali funzionalità
  method2(): void {
    console.log('Method 2 chiamato');
  }

  // Pulizia delle risorse alla distruzione del componente
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }
  }
}
