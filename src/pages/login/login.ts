import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	constructor(public nav: NavController) {}

	logIn() {
		this.nav.push(HomePage);
	}

	startTutorial() {
		// Do nothing
	}
}