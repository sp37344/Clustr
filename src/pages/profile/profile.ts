import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { EditActivitiesPage } from '../edit-activities/edit-activities';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})

export class ProfilePage {
	// Initialize user object
	private user : any;
	private activities : Array<any> = [];

	// Variables for checking current status so that the right status shows as the selected item in the status dropdown
	private isAvailable = false;
	private isBusy = false;
	private isInvisible = false;

	// Toggle the modal
	private isModalVisible = false;

	// Variables for checking what option is selected in the status modal
	private isAvailableSelected = false;
	private isBusySelected = false;
	private isInvisibleSelected = false;

	// Variables for showing suggested activities
	private areActivitiesEmpty = false;
	private areAllActivitiesVisible = true;
	private activitiesRemainder : number;
	private activitiesLimit = 3;
	private hasSingleActivity = false;
	private hasMultipleActivities = false;
	private areActivitiesCollapsible = false;

	// Hard coded for testing purposes
	private userId = 1;

	// Constructor
	constructor(private _app : App, private _http : Http, private _configuration : Configuration, private _events : Events) {
		// Subscribe for a reload of the activities array when the user presses the back button when in the Create an Activity page
		this._events.subscribe('reloadProfileActivities', () => {
			// Collapse activities and reload activities
			this.collapseActivities();
			this.getActivities();
		})

		// Get the user's information
		this._http.get(this._configuration.apiUrl + 'users/' + this.userId).map(res => res.json()).subscribe(res => {
			// Store the user's first name and last name in the user object
			this.user = {
				'firstName' : res.data.first_name,
				'lastName' : res.data.last_name
			};

			// Check what should show up as the currently selected item in the status dropdown, as well as update the user object
			switch(res.data.status) {
				case 'Available':
					this.user['status'] = 'Available';
					this.isAvailable = true;
					break;
				case 'Busy':
					this.user['status'] = 'Busy';
					this.isBusy = true;
					break;
				default:
					this.user['status'] = 'Invisible';
					this.isInvisible = true;
			}
		});

		// Get the user's activities
		this.getActivities();
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
			case 'Available':
				this.isAvailableSelected = true;
				this.isBusySelected = false;
				this.isInvisibleSelected = false;
				break;
			case 'Busy':
				this.isAvailableSelected = false;
				this.isBusySelected = true;
				this.isInvisibleSelected = false;
				break;
			default:
				this.isAvailableSelected = false;
				this.isBusySelected = false;
				this.isInvisibleSelected = true;
		}
	};

	// Update status to selected status
	updateStatus() {
		// Update headers
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		// Update body to reflected selected status and update GUI so that selected option in the dropdown is updated
		if (this.isAvailableSelected) {
			this.user['status'] = 'Available';
			this.isAvailable = true;
			this.isBusy = false;
			this.isInvisible = false;
		} else if (this.isBusySelected) {
			this.user['status'] = 'Busy';
			this.isAvailable = false;
			this.isBusy = true;
			this.isInvisible = false;
		} else {
			this.user['status'] = 'Invisible';
			this.isAvailable = false;
			this.isBusy = false;
			this.isInvisible = true;
		}

		// Call PUT endpoint to update the status of the user
		var body = JSON.stringify(this.user);
		this._http.put(this._configuration.apiUrl + 'users/' + this.userId + '/status', body, { headers: headers }).map(res => res.json()).subscribe(res => {
			console.log(res);
		});

		// Close modal
		this.isModalVisible = false;
	};

	// Get the user's activities
	getActivities() {
		// Get the user's activities
		this._http.get(this._configuration.apiUrl + 'activities/' + this.userId).map(res => res.json()).subscribe(res => {
			// Store the user's activities in an array
			this.activities = res.data;

			// Show the empty activities message if the user has no activities
			if (this.activities.length === 0) {
				this.areActivitiesEmpty = true;
			} else {
				this.areActivitiesEmpty = false;
			}

			// If the user's activities exceed the 3 showing in the dropdown, calculate the remainder and hide the show more option
			if (this.activities.length > this.activitiesLimit) {
				// Calculate remainder of activities that should be expanded
				this.activitiesRemainder = this.activities.length - this.activitiesLimit;

				// Check if there are 1 or more activities, to display the proper wording in the show more option
				if (this.activitiesRemainder == 1) {
					this.hasSingleActivity = true;
					this.hasMultipleActivities = false;
				} else {
					this.hasSingleActivity = false;
					this.hasMultipleActivities = true;
				}

				// Show the show more option
				this.areAllActivitiesVisible = false;
			} else {
				// Do not show see more activities option if the activites do not exceed the limit of 3
				this.areAllActivitiesVisible = true;
				this.hasSingleActivity = false;
				this.hasMultipleActivities = false;
			}
		});
	}

	// Expand and show all suggested activities
	showAllActivities() {
		// Show all activities
		this.activitiesLimit = this.activities.length;

		// Hide option to expand activities and show option to collapse activities
		this.areAllActivitiesVisible = true;
		this.areActivitiesCollapsible = true;
	};

	// Collapse activities back to default number of activities showing
	collapseActivities() {
		// Collapse activities back to limit
		this.activitiesLimit = 3;

		// Show option to expand activities and hide option to collapse activities
		this.areAllActivitiesVisible = false;
		this.areActivitiesCollapsible = false;
	}

	// Go to the Edit Activities Page
	goToEditActivitiesPage() {
		// Navigate to the Edit Activities Page
		this._app.getRootNav().push(EditActivitiesPage);
	};
}