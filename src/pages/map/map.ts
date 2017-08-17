import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
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
	// Variables for storing the user location
	private location : any;

	// Variables for map display
	private isMapLoaded = false;
	private element : HTMLElement;
	private map : GoogleMap;
	private myCamPosition : CameraPosition;
	private myMarkerOptions : MarkerOptions;

	// Constructor
	constructor(private _events : Events, private _googleMaps : GoogleMaps) {
		// Subscribe to an event that updates the user's position
		this._events.subscribe('updateUserPosition', location => {
			// Save the user's location in an object
			this.location = location;
			console.log(this.location);

			// Check if the map is already displaying
			if (this.isMapLoaded) {
				// Update the user's marker
				this.myCamPosition = {
					target: {
						lat: this.location.latitude,
						lng: this.location.longitude
					}
				};

				// Move the map's camera to position
				this.map.moveCamera(this.myCamPosition);

				// Create new marker
				this.myMarkerOptions = {
					position: {
						lat: this.location.latitude,
						lng: this.location.longitude
					}
				};
			} else {
				// Create the map
				this.loadMap();
			}
		});
	}

	// Load map only after view is initialized
	// ngAfterViewInit() {
	// 	this.loadMap();
	// }

	// Load map
	loadMap() {
		// Create a new app by passing HTMLElement
		this.element = document.getElementById('map');
		this.map = this._googleMaps.create(this.element);

		// Listen for the map to be created before adding to or modifying the map
		this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
			// Alert the console that the map is ready
			console.log('Map is ready!');

			// Set camera options
			this.map.setOptions({
				controls: {
					myLocationButton: true
				}
			});

			// Create a CameraPosition object
			this.myCamPosition = {
				target: {
					lat: this.location.latitude,
					lng: this.location.longitude
				},
				zoom: 16,
				tilt: 30
			};

			// Move the map's camera to position
			this.map.moveCamera(this.myCamPosition);

			// Create new marker
			this.myMarkerOptions = {
				position: {
					lat: this.location.latitude,
					lng: this.location.longitude
				},
				title: 'You'
			};

			// Add marker to the map
			this.map.addMarker(this.myMarkerOptions).then((marker : Marker) => {
				marker.showInfoWindow();
			});

			// Update boolean to reflect that map is displaying
			this.isMapLoaded = true;
		});
	};
}