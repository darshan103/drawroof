import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SolarService } from '../services/solar.service';
import { solardata2 } from '../../data/solardata2';
declare var google: any;

@Component({
  selector: 'app-drawroof',
  standalone: true,
  templateUrl: './drawroof.component.html',
  styleUrls: ['./drawroof.component.scss'],
})
export class DrawroofComponent implements AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  geometryLibrary!: google.maps.GeometryLibrary;
  dataLayersResponse: any;
  requestError: any;
  layer: any;
  overlays: google.maps.GroundOverlay[] = [];
  map!: google.maps.Map;
  roofdata2: any = solardata2;
  layerId = 'none';
  showRoofOnly = false;
  month = 0;
  day = 14;
  hour = 5;
  playAnimation = false;
  imageryQuality: any;

  // Inject Platform ID
  constructor( private solarService: SolarService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    console.log("roofdata2 json", this.roofdata2);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsScript().then(() => {
        this.geometryLibrary = google.maps.geometry;
        this.initMap();
        this.getDataLayersUrls();
      }).catch((error) => {
        console.error("Error loading Google Maps script:", error);
      });
    }
  }

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDNG0K2mbcALxtnlAs8-aRCqOxQvr3yjUA&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  initMap(): void {
    if (this.mapElement?.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 37.1058816, lng: -93.369553700000012 },
        zoom: 19,
        tilt: 0,
        mapTypeId: 'satellite',
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        streetViewControl: false,
        zoomControl: false,
      });
      this.drawRoofs();
    } else {
      console.error('Map element not found!');
    }
  }

  drawRoofs(): void {
    console.log('Drawing roofs on the map:', this.roofdata2);
  }

  // showdatalayer method
  // async showDataLayer(reset = false): Promise<void> {
  //   if (reset) {
  //     this.dataLayersResponse = undefined;
  //     this.requestError = undefined;
  //     this.layer = undefined;

  //     // Default values per layer
  //     this.showRoofOnly = ['annualFlux', 'monthlyFlux', 'hourlyShade'].includes(this.layerId);
  //     this.map.setMapTypeId(this.layerId === 'rgb' ? 'roadmap' : 'satellite');
  //     this.overlays.forEach((overlay) => overlay.setMap(null));
  //     this.month = this.layerId === 'hourlyShade' ? 3 : 0;
  //     this.day = 14;
  //     this.hour = 5;
  //     this.playAnimation = ['monthlyFlux', 'hourlyShade'].includes(this.layerId);
  //   }

  //   if (this.layerId === 'none') {
  //     return;
  //   }

  //   if (!this.layer) {
  //     const { center, boundingBox } = await this.getBuildingData();
  //     const diameter = geometryLibrary.spherical.computeDistanceBetween(
  //       new google.maps.LatLng(boundingBox.ne.latitude, boundingBox.ne.longitude),
  //       new google.maps.LatLng(boundingBox.sw.latitude, boundingBox.sw.longitude)
  //     );
  //     const radius = Math.ceil(diameter / 2);

  //     try {
  //       this.dataLayersResponse = await getDataLayerUrls(center, radius, googleMapsApiKey);
  //     } catch (error) {
  //       this.requestError = error as RequestError;
  //       return;
  //     }

  //     this.imageryQuality = this.dataLayersResponse.imageryQuality;

  //     try {
  //       this.layer = await getLayer(this.layerId, this.dataLayersResponse, googleMapsApiKey);
  //     } catch (error) {
  //       this.requestError = error as any;
  //       return;
  //     }
  //   }

  //   const bounds = this.layer.bounds;
  //   console.log('Render layer:', {
  //     layerId: this.layer.id,
  //     showRoofOnly: this.showRoofOnly,
  //     month: this.month,
  //     day: this.day,
  //   });

  //   this.overlays.forEach((overlay) => overlay.setMap(null));
  //   this.overlays = this.layer
  //     .render(this.showRoofOnly, this.month, this.day)
  //     .map((canvas: HTMLCanvasElement) => new google.maps.GroundOverlay(canvas.toDataURL(), bounds));

  //   if (!['monthlyFlux', 'hourlyShade'].includes(this.layer.id)) {
  //     this.overlays[0].setMap(this.map);
  //   }
  // }

  // buildinginsights data 
  getBuildingData() {
    const location = new google.maps.LatLng(37.1058816, -93.369553700000012);
    const apiKey = 'AIzaSyDNG0K2mbcALxtnlAs8-aRCqOxQvr3yjUA';

    this.solarService.findClosestBuilding(location, apiKey)
      .then((data) => {
        console.log('Building Data:', data);
      })
      .catch((error) => {
        console.error('Error fetching building data:', error);
      });
  }

  // getdatalayersurls
  getDataLayersUrls(){
    const location = new google.maps.LatLng(37.1058816, -93.369553700000012);
    const apiKey = 'AIzaSyDNG0K2mbcALxtnlAs8-aRCqOxQvr3yjUA';

    const center = this.roofdata2[0].center;
    const ne = this.roofdata2[0].boundingBox.ne;
    const sw = this.roofdata2[0].boundingBox.sw;
    const diameter = this.geometryLibrary.spherical.computeDistanceBetween(
      new google.maps.LatLng(ne.latitude, ne.longitude),
      new google.maps.LatLng(sw.latitude, sw.longitude),
    );
    const radius = Math.ceil(diameter / 2);

    this.solarService.getDataLayerUrls(location, radius, apiKey)
      .then((data) => {
        console.log('Building Data:', data);
      })
      .catch((error) => {
        console.error('Error fetching building data:', error);
      });
  }
  
}
