export interface Marker {
  id: number; // Identificativo del marker
  latitude: number; // Latitudine del marker
  longitude: number; // Longitudine del marker
  trashType: string; // Tipo di rifiuto (es. "Carta")
  batteryLevel: number; // Livello di batteria
  fillingLevel: number; // Livello di riempimento
}
