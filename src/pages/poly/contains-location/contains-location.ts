import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {
  Poly, Polygon, GoogleMaps, GoogleMap, GoogleMapsEvent,
  LatLngBounds, Marker, ILatLng
} from '@ionic-native/google-maps';

/**
 * Generated class for the ContainsLocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contains-location',
  templateUrl: 'contains-location.html',
})
export class ContainsLocationPage {
  map: GoogleMap;

  GORYOKAKU_POINTS: ILatLng[] = [
    {lat: 41.79883, lng: 140.75675},
    {lat: 41.799240000000005, lng: 140.75875000000002},
    {lat: 41.797650000000004, lng: 140.75905},
    {lat: 41.79637, lng: 140.76018000000002},
    {lat: 41.79567, lng: 140.75845},
    {lat: 41.794470000000004, lng: 140.75714000000002},
    {lat: 41.795010000000005, lng: 140.75611},
    {lat: 41.79477000000001, lng: 140.75484},
    {lat: 41.79576, lng: 140.75475},
    {lat: 41.796150000000004, lng: 140.75364000000002},
    {lat: 41.79744, lng: 140.75454000000002},
    {lat: 41.79909000000001, lng: 140.75465},
    {lat: 41.79883, lng: 140.75673}
  ];

  constructor() { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContainsLocationPage');
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      'gestures': {
        'scroll': false,
        'tilt': false,
        'rotate': false,
        'zoom': false
      },
      camera: {
        target: this.GORYOKAKU_POINTS
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Add a polygon
        return this.map.addPolygon({
          'points': this.GORYOKAKU_POINTS,
          'strokeColor' : '#AA00FF',
          'strokeWidth': 5,
          'fillColor' : '#880000'
        });
      })
      .then((polygon: Polygon) => {
        // Add a marker
        return this.map.addMarker({
          'position': (new LatLngBounds(this.GORYOKAKU_POINTS)).getCenter(),
          'draggable': true,
          'title': 'drag me!'
        });
      })
      .then((marker: Marker) => {
        // Open the infoWindow
        marker.showInfoWindow();

        // If the marker position is changed,
        // calculates the position is in the specified polygon rectangle.
        // If in the polygon, change the marker color to "blue", otherwise, "red".
        marker.on("position_changed").subscribe(() => {
          let position: ILatLng = marker.getPosition();
          let contain: boolean = Poly.containsLocation(position, this.GORYOKAKU_POINTS);
          marker.setIcon(contain ? "blue" : "red");
        });

        // Fire the position_changed event for the first calculation
        marker.trigger("position_changed");
      });
  }

}
