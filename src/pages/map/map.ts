import { Component } from '@angular/core';
import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	LatLng,
	CameraPosition,
	MarkerOptions,
	Marker
} from '@ionic-native/google-maps';

@Component({
	selector: 'page-map',
	templateUrl: 'map.html'
})

export class MapPage {
	// Constructor
	constructor(private _googleMaps : GoogleMaps) {}

	// Load map only after view is initialized
	ngAfterViewInit() {
		this.loadMap();
	}

	// Load map
	loadMap() {
		// Create a new app by passing HTMLElement
		let element : HTMLElement = document.getElementById('map');
		let map : GoogleMap = this._googleMaps.create(element);

		// Listen for the map to be created before adding to or modifying the map
		map.one(GoogleMapsEvent.MAP_READY).then(() => {
			// Alert the console that the map is ready
			console.log('Map is ready!');

			// Set camera options
			map.setOptions({
				controls: {
					myLocationButton: true
				}
			});

			// Create a latitude/longitude object

			// Create a CameraPosition object
			let myCamPosition : CameraPosition = {
				target: {
					lat: 43.0741904,
					lng: -89.3809802
				},
				zoom: 16,
				tilt: 30
			};

			// Move the map's camera to position
			map.moveCamera(myCamPosition);

			// Create new marker
			let myMarkerOptions : MarkerOptions = {
				position: {
					lat: 43.0741904,
					lng: -89.3809802
				},
				title: 'You'
			};

			// Add marker to the map
			map.addMarker(myMarkerOptions).then((marker : Marker) => {
				marker.showInfoWindow();
			});
		});
	};
}