import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompassService {
  private currentPosition(position: GeolocationPosition) {
    console.dir(this.currentPosition);
  }

  constructor() {
    navigator.geolocation.getCurrentPosition(() => this.currentPosition);
    window.addEventListener("deviceorientationabsolute", (e: any) => this.handler(e), true);
  }

  // code from https://stackoverflow.com/a/21829819/2378218
  // maybe copy from https://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example
  private compassHeading(alpha: number, beta: number, gamma: number) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    var rC = - cB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;

  }

  private i = 0;
  private handler(e: DeviceOrientationEvent) {
    this.i++;
    if (this.i % 10 == 0)
      console.log(this.compassHeading(e.alpha as number, e.beta as number, e.gamma as number));
  }

}
