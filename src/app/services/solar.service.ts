// solar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DataLayersResponse {
    imageryDate: Date;
    imageryProcessedDate: Date;
    dsmUrl: string;
    rgbUrl: string;
    maskUrl: string;
    annualFluxUrl: string;
    monthlyFluxUrl: string;
    hourlyShadeUrls: string[];
    imageryQuality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BuildingInsightsResponse {
    name: string;
    center: LatLng;
    boundingBox: LatLngBox;
    imageryDate: Date;
    imageryProcessedDate: Date;
    postalCode: string;
    administrativeArea: string;
    statisticalArea: string;
    regionCode: string;
    solarPotential: any;
    imageryQuality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface LatLngBox {
    sw: LatLng;
    ne: LatLng;
}

export interface Date {
    year: number;
    month: number;
    day: number;
}

@Injectable({
    providedIn: 'root'
})
export class SolarService {

    private jsonUrl = '../../assets/solardata2.json';

    constructor(private http: HttpClient) { }

    async findClosestBuilding(location: google.maps.LatLng, apiKey: string): Promise<any> {
        const args = {
            'location.latitude': location.lat().toFixed(5),
            'location.longitude': location.lng().toFixed(5),
        };
        const params = new URLSearchParams({ ...args, key: apiKey });
        return fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`).then(
            async (response) => {
                const content = await response.json();
                if (response.status != 200) {
                    throw new Error('Error fetching data');
                }
                return content;
            }
        );
    }

    async getDataLayerUrls(location: google.maps.LatLng, radiusMeters: number, apiKey: string): Promise<DataLayersResponse> {
        const args = {
            'location.latitude': location.lat().toFixed(5),
            'location.longitude': location.lng().toFixed(5),
            radius_meters: radiusMeters.toString(),
            // The Solar API always returns the highest quality imagery available.
            // By default the API asks for HIGH quality, which means that HIGH quality isn't available,
            // but there is an existing MEDIUM or LOW quality, it won't return anything.
            // Here we ask for *at least* LOW quality, but if there's a higher quality available,
            // the Solar API will return us the highest quality available.
            required_quality: 'LOW',
        };
        console.log('GET dataLayers\n', args);
        const params = new URLSearchParams({ ...args, key: apiKey });
        // https://developers.google.com/maps/documentation/solar/reference/rest/v1/dataLayers/get
        return fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`).then(
            async (response) => {
                const content = await response.json();
                if (response.status != 200) {
                    console.error('getDataLayerUrls\n', content);
                    throw content;
                }
                console.log('dataLayersResponse', content);
                return content;
            },
        );
    }

    getRoofData(): Observable<any> {
        return this.http.get<any>(this.jsonUrl);
    }
}
