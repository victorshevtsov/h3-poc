export class hexagon {
  h3Index: string;
  path: google.maps.LatLng[];
  color: string | undefined;

  constructor(h3Index: string, path: google.maps.LatLng[], color: string) {
    this.h3Index = h3Index;
    this.path = path;
    this.color = color;
  }
}
