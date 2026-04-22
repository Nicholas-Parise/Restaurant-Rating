import { AfterViewInit, Component, Input } from '@angular/core'
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-restaurant-map',
  imports: [],
  template: '<div id="map" style="height:400px;width:100%"></div>',
  styleUrl: './restaurant-map.component.css',
  standalone: true
})
export class RestaurantMapComponent implements AfterViewInit{

  private platformId = inject(PLATFORM_ID);

  @Input() lat!: number
  @Input() lon!: number
  @Input() name!: string


  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const L = await import('leaflet');

    const map = L.map('map').setView([this.lat, this.lon], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    L.marker([this.lat, this.lon])
      .addTo(map)
      .bindPopup(this.name)
      .openPopup()
  }

}
