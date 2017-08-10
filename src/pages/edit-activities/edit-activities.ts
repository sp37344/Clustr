import { Component } from '@angular/core';
import { App } from 'ionic-angular';

@Component ({
	selector: 'page-edit-activities',
	templateUrl: 'edit-activities.html'
})

export class EditActivitiesPage {
	constructor(private _app: App) {
	}

	// Go to Profile Page
	goToProfilePage() {
		// Navigate to the Profile Page
		this._app.getRootNav().pop();
	};
}