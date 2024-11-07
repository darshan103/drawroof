import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadMapService{
    private googleMapsLoaded = false;

    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.googleMapsLoaded) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDNG0K2mbcALxtnlAs8-aRCqOxQvr3yjUA&libraries=geometry,drawing';
            script.async = true;
            script.defer = true;

            script.onload = () => {
                this.googleMapsLoaded = true;
                resolve();
            };
            script.onerror = (error) => reject(error);

            document.body.appendChild(script);
        });
    }
}
