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

	// Headers
	private headers : any;

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
	private selectedHour : any;
	private selectedMinute : any;
	private selectedHalf : string;
	private isAmSelected = false;
	private isPmSelected = false;

	// Variables for displaying the corect Free Until time in the clock
	private displayHour : any;
	private displayMinute : any;
	private displayHalf : string;
	private isTimeDisplaying = false;

	// Variables for the timer that sets the user status to invisible
	private invisibleTimer : any;

	// Variable for enabling or disabling the timer
	private isTimerEnabled : boolean;

	// Hard coded for testing purposes
	private userId = 1;

	// Constructor
	constructor(private _app : App, private _http : Http, private _configuration : Configuration, private _events : Events) {
		// Update headers
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		// Add an event listener for handling of the back button
		document.addEventListener("backbutton", this.onBackKeyDown, false);

		// Subscribe for a reload of the activities array when the user presses the back button when in the Create an Activity page
		this._events.subscribe('reloadProfileActivities', () => {
			// Collapse activities and reload activities
			this.collapseActivities();
			this.getActivities();
		});

		// Get the user's information
		this._http.get(this._configuration.apiUrl + 'users/' + this.userId).map(res => res.json()).subscribe(res => {
			// Store the user's first name and last name in the user object
			this.user = {
				'firstName' : res.data.first_name,
				'lastName' : res.data.last_name,
				'freeUntil' : res.data.free_until,
				'timerEnabled' : res.data.timer_enabled
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

			// Show the enable or disable timer button depending on whether the timer is enabled or disabled
			if (this.user['timerEnabled']) {
				// Show the Enable Timer button
				this.isTimerEnabled = true;
			} else {
				// Show the Disable Timer button
				this.isTimerEnabled = false;
			}

			// Set the display time
			this.setDisplayTime();
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
		this._http.put(this._configuration.apiUrl + 'users/' + this.userId + '/status', this.user, {headers: this.headers}).map(res => res.json()).subscribe(res => {
			// Print success message
			console.log(res);
		});

		// Close Modal
		this.hideModal();
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
		// Check if the timer is disabled or not
		if (this.isTimerEnabled) {
			// Show the lightbox and Time Modal
			this.isTimeModalVisible = true;
			this.isSelectingHour = true;
			this.isModalVisible = true;
		}
	};

	// Update the view to reflect if the user has chosen an hour or minute
	selectTime(time) {
		// Update GUI
		this.selectedTime = time;
	};

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
	};

	// Save the time and update the Free Until time in the database
	updateTime() {
		// Check if the user has selected a time
		if (this.selectedHalf != null) {
			// Modify the selected hour time +12 hours if the user chose the PM option
			var tempHour : any;
			if (this.selectedHalf == 'PM' && this.selectedHour != 12) {
				// Increase the hour count if the user chose the PM option
				tempHour = this.selectedHour + 12;

				// Add a leading zero if needed for the display
				if (this.selectedHour < 10) {
					this.selectedHour = '0' + this.selectedHour;
				}
			} else if (this.selectedHalf == 'AM' && this.selectedHour == 12) {
				// Modify the hour count to reflect midnight
				tempHour = '00';
			} else {
				// Add a leading zero, if necessary, granted the user chose the AM option
				if (this.selectedHour < 10) {
					this.selectedHour = '0' + this.selectedHour;
				}
				tempHour = this.selectedHour;
			}
	
			// Modify the selected minute to be double digits if below 10
			if (this.selectedMinute < 10) {
				this.selectedMinute = '0' + this.selectedMinute;
			}

			// Update the user object to reflect the updated time
			var temp = tempHour + ':' + this.selectedMinute + ':00';

			console.log(this.user['status']);

			// Check if the value is actually different to prevent unnecessary HTTP requests
			if (this.user['freeUntil'] != temp) {
				// Update the user object with the time
				this.user['freeUntil'] = temp;

				// Get the timestamp now and the timestamp for the user's set time
				var now = new Date();
				var nowTime = now.getTime();
				var then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), tempHour, this.selectedMinute);
				var thenTime = then.getTime();

				// If the timestamp then has passed within the day, increase the timestamp to the next day
				if (thenTime <= nowTime) {
					var day = 86400000;
					thenTime = thenTime + day;
				}

				// Get the difference in milliseconds between the timestamps now and then
				var timeDifference = thenTime - nowTime;
				console.log(timeDifference);

				// Clear the existing timer if necessary
				if (this.invisibleTimer != null) {
					clearInterval(this.invisibleTimer);
				}

				// Define scope of this for the setTimeout function
				var self = this;

				// Set the user's status to invisible when the appropriate timestamp arrives
				this.invisibleTimer = setTimeout(function() {
					// Set the user's timestamp to invisible
					self.user['status'] = 'Invisible';

					// Update the GUI 
					self.isAvailable = false;
					self.isBusy = false;
					self.isInvisible = true;

					// Call PUT endpoint to update the status of the user
					self._http.put(self._configuration.apiUrl + 'users/' + self.userId + '/status', self.user, {headers: self.headers}).map(res => res.json()).subscribe(res => {
						// Print success message
						console.log(res);
					});
				}, timeDifference);

				// Modify the time at which the user becomes inactive in the database using a PUT function
				this._http.put(this._configuration.apiUrl + 'users/' + this.userId + '/time', this.user, {headers : this.headers}).map(res => res.json()).subscribe(res => {
					// Print success message
					console.log(res);

					// Update the display
					this.displayHour = this.selectedHour;
					this.displayMinute = this.selectedMinute;
					this.displayHalf = this.selectedHalf;
					this.isTimeDisplaying = true;

					// Hide the Time Modal and clear selected times
					this.hideModal();
				});
			} else {
				// Hide the Time Modal and clear selected times
				this.hideModal();
			}
		}
	};

	// Set the display time
	setDisplayTime() {
		// Check if the user has set a time
		if (this.user['freeUntil'] != null) {
			// Modify the hour if needed, then store the hour and time of day
			var timeString = this.user['freeUntil'];
			var temp = parseInt(timeString.slice(0, 2));

			// Check if the time has been set for AM or PM
			if (temp > 12) {
				// Subtract 12 if the hour refers to the PM
				this.displayHour = temp - 12;
				this.displayHalf = 'PM';

				// Add leading zero if necessary
				if (this.displayHour < 10) {
					this.displayHour = '0' + this.displayHour;
				}
			} else {
				// Retain the original hour value
				this.displayHour = temp;

				// Set whether the time is in the AM or PM
				if (temp == 12) {
					// Set time of day to PM
					this.displayHalf = 'PM';
				} else {
					// Account for midnight
					if (temp == 0) {
						this.displayHour = 12;
					}

					// Set time of day to AM
					this.displayHalf = 'AM';
				}

				// Add leading zero if ncessary
				if (this.displayHour < 10) {
					this.displayHour = '0' + this.displayHour;
				}
			}

			// Set the minute display time
			this.displayMinute = timeString.slice(3, 5);

			// Restore CSS classes in HTML to default values for if time is showing
			this.isTimeDisplaying = true;
		} else {
			// Display dashes to reflect the null value
			this.displayHour = '--';
			this.displayMinute = '--';
			this.displayHalf = '--';
			this.isTimeDisplaying = false;
		}
	};

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
	};

	// Enable or disable the timer
	toggleTimer(boolean) {
		// Check if the timer is being enabled or disabled
		if (boolean) {
			// Show the Enable Timer button
			this.isTimerEnabled = true;
			this.user['timerEnabled'] = true;
		} else {
			// Show the Disable Timer button
			this.isTimerEnabled = false;
			this.user['timerEnabled'] = false;

			// Clear the timeout function
			clearInterval(this.invisibleTimer);

			// Change the display on the clock
			this.isTimeDisplaying = false;
			this.displayHour = '--';
			this.displayMinute = '--';
			this.displayHalf = '--';

			// Set the free until time to null
			this.user['freeUntil'] = null;

			// Update the user's free until time to null in the database using a PUT function
			this._http.put(this._configuration.apiUrl + 'users/' + this.userId + '/time', this.user, {headers : this.headers}).map(res => res.json()).subscribe(res => {
				// Print success message
				console.log(res);

				// Update whether the timer is enabled or not in the database using a PUT function
				this._http.put(this._configuration.apiUrl + 'users/' + this.userId + '/toggle-timer', this.user, {headers : this.headers}).map(res => res.json()).subscribe(res => {
					// Print success message
					console.log(res);
				});
			});
		}
	};
 
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

	// Hide modals on the back key down, overriding the default behavior to quit the app
	onBackKeyDown(event) {
		// Do something
	};
}