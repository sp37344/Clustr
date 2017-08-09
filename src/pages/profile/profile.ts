import { Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})

export class ProfilePage {
	// Initialize user object
	private user : any;

	// Variables for checking current status so that the right status shows as the selected item in the status dropdown
	private isAvailable : boolean = false;
	private isBusy : boolean = false;
	private isInvisible : boolean = false;

	// Toggle the modal
	private isModalVisible : boolean = false;

	// Variables for checking what option is selected in the status modal
	private isAvailableSelected : boolean = false;
	private isBusySelected : boolean = false;
	private isInvisibleSelected : boolean = false;

	// Hard coded for testing purposes
	private userId = 1;

	constructor(private _http: Http, private _configuration : Configuration) {
		// Get the user's information
		this._http.get((this._configuration.apiUrl + 'users/' + this.userId)).map(res => res.json()).subscribe(res => {
			// Store the user's first name and last name in the user object
			this.user = {
				'firstName' : res.data.first_name,
				'lastName' : res.data.last_name
			}

			// Check what should show up as the currently selected item in the status dropdown, as well as update the user object
			switch(res.data.status) {
				case 'available':
					this.user['status'] = 'Available';
					this.isAvailable = true;
					break;
				case 'busy':
					this.user['status'] = 'Busy';
					this.isBusy = true;
					break;
				default:
					this.user['status'] = 'Invisible';
					this.isInvisible = true;
			}
		});
	}

	// Show status modal, where user is able to set status to available, busy, or invisible
	showStatusModal() {
		// Show the modal and lightbox
		this.isModalVisible = true;

		// Show a checkmark next to the option reflecting the user's current status
		switch(this.user['status']) {
			case 'Available':
				this.isAvailableSelected = true;
				break;
			case 'Busy':
				this.isBusySelected = true;
				break;
			default:
				this.isInvisibleSelected = true;
		}
	};

	// Hide status modal
	hideStatusModal() {
		// Hide the modal and lightbox
		this.isModalVisible = false;

		// Undo all checkmarks
		this.isAvailableSelected = false;
		this.isBusySelected = false;
		this.isInvisibleSelected = false;
	};

	// Update GUI to reflect what option the user has selected
	selectStatus(status) {
		// Show checkmark next top item that has been selected; Only one checkmark can show at a time
		switch(status) {
			case 'available':
				this.isAvailableSelected = true;
				this.isBusySelected = false;
				this.isInvisibleSelected = false;
				break;
			case 'busy':
				this.isAvailableSelected = false;
				this.isBusySelected = true;
				this.isInvisibleSelected = false;
				break;
			default:
				this.isAvailableSelected = false;
				this.isBusySelected = false;
				this.isInvisibleSelected = true;
		}
	}
}