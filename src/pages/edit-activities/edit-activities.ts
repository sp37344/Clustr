import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component ({
	selector: 'page-edit-activities',
	templateUrl: 'edit-activities.html'
})

export class EditActivitiesPage {
	// Initialize variables
	private activities : Array<any> = [];

	// Headers
	private headers : any;

	// Used for showing or hiding modals
	private isModalVisible = false;
	private isCreateActivityModalVisible = false;
	private isEditActivityModalVisible = false;

	// Values to store input entered into the modals
	private newActivityName : string;
	private editedActivityName : string;

	// Value for editing or deleting a particular activity
	private areActivityOptionsVisible = false;
	private activityId : number;

	// Array for validating a string
	private charArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

	// Hard coded for testing purposes
	private userId = 1;

	// Constructor
	constructor(private _app : App, private _http : Http, private _configuration : Configuration, private _events : Events) {
		// Update headers
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');

		// Get the user's activities
		this.getActivities();
	}

	// Get the user's activities
	getActivities() {
		// Get the user's activities
		this._http.get(this._configuration.apiUrl + 'activities/' + this.userId).map(res => res.json()).subscribe(res => {
			// Store the user's activities in an array
			this.activities = res.data;
		});
	};

	// Open up the modal to Create an Activity
	createActivity() {
		// Show the Create an Activity modal
		this.isModalVisible = true;
		this.isCreateActivityModalVisible = true;
	};

	// Add an activity
	addActivity() {
		// Fire only if input is valid (the value is not null and the string is valid)
		if (this.newActivityName != null && this.isStringValid(this.newActivityName, this.charArray)) {
			// Eliminate whitespace from both ends of the input
			this.newActivityName = this.newActivityName.trim();

			// Populate an object with the new activity parameters
			var body = {
				'user_id' : this.userId,
				'name' : this.newActivityName
			};

			// Create a new activity for the user using a POST function
			this._http.post(this._configuration.apiUrl + 'activities/' + this.userId, body, {headers : this.headers}).map(res => res.json()).subscribe(res => {
				// Print success message
				console.log(res);

				// Add most recently added item to the activities array so that the array updates in the GUI
				var tempActivity;
				this._http.get(this._configuration.apiUrl + 'activities/' + this.userId).map(res => res.json()).subscribe(res => {
					// Update the array
					tempActivity = res.data[res.data.length - 1];
					console.log(tempActivity);
					this.activities.push(tempActivity);
				});
			});

			// Clear input
			this.newActivityName = "";

			// Hide the Create an Activity modal
			this.isModalVisible = false;
			this.isCreateActivityModalVisible = false;
		}
	};

	// Edit an activity
	editActivity() {
		// Show the Edit Activity modal
		this.isModalVisible = true;
		this.areActivityOptionsVisible = false;
		this.isEditActivityModalVisible = true;

		// Automatically populate the input area with the current activity name
		for (var i = 0; i < this.activities.length; i++) {
			if (this.activities[i].id == this.activityId) {
				this.editedActivityName = this.activities[i].name;
				break;
			}
		}
	};

	// Submit edited activity name to the database
	updateActivity() {
		// Fire only if input is valid (the value is not null and the string is valid)
		if (this.editedActivityName != null && this.isStringValid(this.editedActivityName, this.charArray)) {
			// Eliminate whitespace from both ends of the input
			this.editedActivityName = this.editedActivityName.trim();

			// Track the index of the appropriate activity in the activities array
			var index : number;
			for (var i = 0; i < this.activities.length; i++) {
				if (this.activities[i].id == this.activityId) {
					index = i;
					break;
				}
			}

			// Only change the name and make an HTTP request if the original and edited activity names are not the same
			if (this.activities[index].name != this.editedActivityName) {
				// Change the name of the appropriate activity
				this.activities[index].name = this.editedActivityName;

				// Change the name of the activity in the database using a POST function
				var body = JSON.stringify(this.activities[index]);
				this._http.put(this._configuration.apiUrl + 'activities/' + this.activityId, body, {headers: this.headers}).map(res => res.json()).subscribe(res => {
					console.log(res);
				});
			}			

			// Hide the Edit Activity modal
			this.isEditActivityModalVisible = false;
			this.isModalVisible = false;
		}
	};

	// Delete an activity
	deleteActivity() {
		// Delete an activity from the user's suggested activities list using a DELETE function
		this._http.delete(this._configuration.apiUrl + 'activities/' + this.activityId).map(res => res.json()).subscribe(res => {
			// Print success message
			console.log(res);

			// Remove the activity from the activities array to update GUI
			for (var i = 0; i < this.activities.length; i++) {
				if (this.activities[i].id == this.activityId) {
					this.activities.splice(i, 1);
					break;
				}
			}
		});

		// Hide the Acitivity Options modal
		this.areActivityOptionsVisible = false;
		this.isModalVisible = false;
	}

	// Show options to edit and delete an activity
	showActivityOptions(id) {
		// Store the id of the selected activity
		this.activityId = id;

		// Show the options to edit or delete an activity
		this.isModalVisible = true;
		this.areActivityOptionsVisible = true;
	};

	// Hide the modal
	hideModal() {
		// Hide whatever modal is visible
		this.isModalVisible = false;

		// Hide the appropriate modal
		if (this.isCreateActivityModalVisible) {
			// Clear input from the appropriate modal
			this.newActivityName = "";
			this.isCreateActivityModalVisible = false;
		} else if (this.areActivityOptionsVisible) {
			// Hide Activity Options modal
			this.areActivityOptionsVisible = false;
			this.isModalVisible = false;
		} else if (this.isEditActivityModalVisible) {
			// Hide the Edit an Activity modal
			this.editedActivityName = "";
			this.isEditActivityModalVisible = false;
		}
	};

	// Check if the string is valid -- in other words, if it contains letters
	isStringValid(input, charArray) {
		// Check if the input is nul
		if (input != null) {
			// Transform all characters to lowercase for case insensitive comparison
			var inputString = input.toLowerCase();

			// See if the input string contains letters in an array containing the alphabet
			for (var i = 0; i < inputString.length; i++) {
				for (var j = 0; j < charArray.length; j++) {
					if (inputString[i] == charArray[j]) {
						// Return true
						return true;
					}
				}
			}

			// Return false
			return false;
		} else {
			// Return false
			return false;
		}
	}

	// Go to Profile Page
	goToProfilePage() {
		// Publish an event that reloads the Profile Page activities array
		this._events.publish('reloadProfileActivities');

		// Navigate to the Profile Page
		this._app.getRootNav().pop();
	};
}