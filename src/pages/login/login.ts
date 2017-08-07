import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	constructor(public app: App) {}

	logIn() {
		this.app.getRootNav().setRoot(TabsPage);
	}

	startTutorial() {
		// Do nothing
	}
}