import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() longitude?: number;
  @Input() latitude?: number;
  
  private map?: L.Map;
  private marker?: L.Marker;
  private isMapInitialized = false;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialiser la carte après le rendu de la vue (élément #map disponible)
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Réagir aux changements des propriétés d'entrée
    if ((changes['longitude'] || changes['latitude']) && 
        this.longitude !== undefined && this.latitude !== undefined && 
        this.isMapInitialized) {
      this.updateMapPosition(this.longitude, this.latitude);
    }
  }

  ngOnDestroy(): void {
    // Cleaning ressources
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initializeMap(): void {
    // Initialiser map with options
    this.map = L.map('map', {
      center: [46.227638, 2.213749], // Center of France by default
      zoom: 16,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    // Adding tile openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Define default marker icon
    L.Marker.prototype.options.icon = defaultIcon;

    this.isMapInitialized = true;

    // If coordinates are allready available
    if (this.longitude !== undefined && this.latitude !== undefined) {
      this.updateMapPosition(this.longitude, this.latitude);
    }
  }

  private updateMapPosition(longitude: number, latitude: number): void {
    if (!this.map) return;

    // Centering map on new coordinates with zoom at level 16
    this.map.setView([latitude, longitude], 16);

    // Deleting allready existing marker if existing
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Adding a new marker at given latitude / longitude
    this.marker = L.marker([latitude, longitude])
      .addTo(this.map);
  }

  // if we need to manually set a position, use this method
  public setMapPosition(longitude: number, latitude: number): void {
    this.longitude = longitude;
    this.latitude = latitude;
    
    if (this.isMapInitialized) {
      this.updateMapPosition(longitude, latitude);
    }
  }
}