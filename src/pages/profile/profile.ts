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

	// Toggle Modals
	private isModalVisible = false;
	private isStatusModalVisible = false;
	private isTimeModalVisible = false;

	// Variables for checking what option is selected in the status Modal
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

	// Control flow in the Time Modal
	private isSelectingHour = false;
	private isSelectingMinute = false;
	private isSelectingHalf = false;

	// Variables for storing the user's desired Free Until time
	private selectedTime : number;
	private selectedHour : number;
	private selectedMinute : number;
	private selectedHalf : string;
	private isAmSelected = false;
	private isPmSelected = false;

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

	// Show status Modal, where user is able to set status to available, busy, or invisible
	showStatusModal() {
		// Show the Modal and lightbox
		this.isModalVisible = true;
		this.isStatusModalVisible = true;

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

		// Close Modal
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
	};

	// Show the Modal to set the time until which the user will be free
	setTime() {
		// Show the lightbox and Time Modal
		this.isTimeModalVisible = true;
		this.isSelectingHour = true;
		this.isModalVisible = true;
	};

	// Update the view to reflect if the user has chosen an hour or minute
	selectTime(time) {
		// Update GUI
		this.selectedTime = time;
	}

	// Save the AM/PM option that the user has selected
	selectHalf(half) {
		// Update GUI to reflect the user's selection
		if (half == 'AM') {
			// Add an active class to the selected button
			this.isAmSelected = true;
			this.isPmSelected = false;

			// Save the selection
			this.selectedHalf = half;
		} else {
			// Add an active class to the selected button
			this.isAmSelected = false;
			this.isPmSelected = true;

			// Save the selection
			this.selectedHalf = half;
		}
	}

	// Save the time and update the Free Until time in the database
	updateTime() {
		if (this.selectedHalf != null) {
			// Hide the Time Modal and clear selected times
			this.hideModal();
		}
	}

	// Show the next Time Modal
	showNextTimeModal() {
		// Check if a time has been selected
		if (this.selectedTime != null) {
			// Show the next Modal, based on what Modal is currently showing
			if (this.isSelectingHour) {
				// Save the hour
				this.selectedHour = this.selectedTime;

				// Hide the Hour Time Modal
				this.isSelectingHour = false;

				// Clear or show a selected time depending on whether the user has already selected an option
				if (this.selectedMinute != null) {
					this.selectedTime = this.selectedMinute;
				} else {
					this.selectedTime = null;
				}

				// Show the Minute Time Modal
				this.isSelectingMinute = true;
			} else if (this.isSelectingMinute) {
				// Save the minute
				this.selectedMinute = this.selectedTime;

				// Hide the Minute Time Modal
				this.isSelectingMinute = false;

				// Show the AM/PM Time Modal and clear the unneeded selected time variable
				this.selectedTime = null;
				this.isSelectingHalf = true;
			}
		}
	};

	// Show the previous Modal
	showPreviousTimeModal() {
		// Show the previous Modal, based on what Modal is currently showing
		if (this.isSelectingMinute) {
			// Hide the Minute Time Modal
			this.isSelectingMinute = false;

			// Temporarily save the selection if an option has been selected
			if (this.selectedTime != null) {
				this.selectedMinute = this.selectedTime;
			}

			// Show the selected hour
			this.selectedTime = this.selectedHour;

			// Show the Hour Time Modal
			this.isSelectingHour = true;
		} else if (this.isSelectingHalf) {
			// Hide the AM/PM Time Modal
			this.isSelectingHalf = false;

			// Show the selected minute
			this.selectedTime = this.selectedMinute;

			// Show the Minute Time Modal
			this.isSelectingMinute = true;
		}
	}
 
	// Hide whatever Modal is visible
	hideModal() {
		// Hide the appropriate Modal
		if (this.isStatusModalVisible) {
			// Hide the Status Modal
			this.isStatusModalVisible = false;

			// Undo all checkmarks
			this.isAvailableSelected = false;
			this.isBusySelected = false;
			this.isInvisibleSelected = false;
		} else if (this.isTimeModalVisible) {
			// Hide all time-related Modals
			this.isSelectingHalf = false;
			this.isSelectingMinute = false;
			this.isSelectingHour = false;
			this.isTimeModalVisible = false;

			// Clear all selected times
			this.selectedTime = null;
			this.selectedHour = null;
			this.selectedMinute = null;
			this.selectedHalf = null;
			this.isAmSelected = false;
			this.isPmSelected = false;
		}

		// Hide lightbox
		this.isModalVisible = false;
	};

	// Go to the Edit Activities Page
	goToEditActivitiesPage() {
		// Navigate to the Edit Activities Page
		this._app.getRootNav().push(EditActivitiesPage);
	};
}