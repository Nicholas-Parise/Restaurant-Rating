import { AfterViewInit, Component, Input } from '@angular/core'
import * as L from 'leaflet'

@Component({
  selector: 'app-restaurant-map',
  imports: [],
  template: '<div id="map" style="height:400px;width:100%"></div>',
  styleUrl: './restaurant-map.component.css',
  standalone: true
})
export class RestaurantMapComponent implements AfterViewInit{

  @Input() lat!: number
  @Input() lon!: number
  @Input() name!: string

  map!: L.Map

  ngAfterViewInit(): void {

    this.map = L.map('map').setView([this.lat, this.lon], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map)

    L.marker([this.lat, this.lon])
      .addTo(this.map)
      .bindPopup(this.name)
      .openPopup()
  }

}
