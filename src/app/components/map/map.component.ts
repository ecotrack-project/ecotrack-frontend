import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Marker } from '../../models/marker.model';
import { Subscription } from 'rxjs';
import { Report } from '../../models/report.model';
import { MapService } from '../../services/map.service';

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
  report: Report[] = [];

  map: google.maps.Map | null = null;
  trashType: string = "";
  currentInfoWindow: google.maps.InfoWindow | null = null;
  private subscriptions: Subscription = new Subscription();

  location: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  // Costruttore
  constructor(private apiService: ApiService, private mapService: MapService) { }

  ngOnInit() {
    this.mapService.triggerMapMethod$.subscribe(() => {
      this.calculateRoute(this.location);
    });
    this.initMap();
  }
  // Metodo eseguito dopo il caricamento della view
  ngAfterViewInit(): void {
    // Sottoscrizioni ai dati del servizio
    this.subscriptions.add(
      this.apiService.currentData$.subscribe((data: Marker[]) => {
        this.markerData = data;
        this.initMap();
      })
    );


    this.subscriptions.add(
      this.apiService.currentReportData$.subscribe((data: Report[]) => {
        this.report = data;
        this.initMap();
      })
    );

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
              lat: 45.06572,
              lng: 7.67284,
              // lat: position.coords.latitude,
              // lng: position.coords.longitude,
            };

            this.location = { lat: currentLocation.lat, lng: currentLocation.lng };



            // Inizializza la mappa
            this.map = new google.maps.Map(mapContainer, {
              center: currentLocation,
              zoom: 15,
              mapId: 'd97e1a9f930f1239',
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            });

            // Aggiungi i marker alla mappa
            this.addMarkers();

            new google.maps.Marker({
              position: currentLocation,
              map: this.map,
              title: 'Posizione Attuale',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#0000FF',
                fillOpacity: 1,
                strokeColor: '#8FB3E6',
                strokeWeight: 6,
              },
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

      // Informazioni visualizzabili al clic sul marker
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3>${item.trashType}</h3>
            <p>Livello riempimento: ${item.fillingLevel}%</p>
          </div>
        `,
      });

      // Assegna il comportamento al clic sul marker
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
  public calculateRoute(currentLocation: google.maps.LatLngLiteral): void {
    if (!this.map || this.markerData.length === 0) {
      console.warn('Mappa o marker non disponibili per il calcolo della rotta.');
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true, // Visualizza anche i marker lungo il percorso
    });

    // Creazione dei waypoints dai marker
    const waypoints: google.maps.DirectionsWaypoint[] =

      this.markerData.map((item) => ({
        location: { lat: item.latitude, lng: item.longitude },
        stopover: true, // Indica che questi punti devono essere inclusi nel percorso
      }));

    // Configurazione della richiesta alla Directions API
    const request: google.maps.DirectionsRequest = {
      origin: currentLocation,
      destination: currentLocation, // Percorso circolare
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: waypoints,
      optimizeWaypoints: true
    };


    // Richiesta alla Directions API
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Errore nel calcolo della rotta', status);
      }
    });

  }



  // Pulizia delle risorse alla distruzione del componente
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }
  }
}
