import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	userData = null;
	constructor(
		public app: App, 
		private facebook: Facebook
		) {}

	logIn() {
		this.app.getRootNav().setRoot(TabsPage);
	}

	startTutorial() {
		// Do nothing
	}

	loginWithFB() {
		this.facebook.login(['email', 'public_profile']).then((response:FacebookLoginResponse) => {
			this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
				this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
			})
		})
	}
}