import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Http, Response, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

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

	// Values to store input entered into the modals
	private newActivityName : string;

	// Value for editing or deleting a particular activity
	private areActivityOptionsVisible = false;
	private activityId : number;

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
		// Populate an object with the new activity parameters
		var body = {
			'user_id' : this.userId,
			'name' : this.newActivityName
		};

		// Create a new activity for the user using a POST function
		this._http.post(this._configuration.apiUrl + 'activities/' + this.userId, body, { headers : this.headers }).map(res => res.json()).subscribe(res => {
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
	};

	// Edit an activity
	editActivity() {

	};

	// Delete an activity
	deleteActivity() {
		// Delete an activity from the user's suggested activities list using a DELETE function
		this._http.delete(this._configuration.apiUrl + 'activities/' + this.activityId).map(res => res.json()).subscribe(res => {
			// Print success message
			console.log(res);

			// Delete the activity from the activities array to update GUI
			for (var i = 0; i < this.activities.length; i++) {
				if (this.activities[i].id == this.activityId) {
					this.activities.splice(i, 1);
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

	// Hide options to edit and delete an activity
	hideActivityOptions() {
		// Hide options
		this.areActivityOptionsVisible = false;
		this.isModalVisible = false;
	};

	// Hide the modal
	hideModal() {
		// Hide whatever modal is visible
		this.isModalVisible = false;

		// Clear input from the appropriate modal
		if (this.isCreateActivityModalVisible) {
			this.newActivityName = "";
			this.isCreateActivityModalVisible = false;
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