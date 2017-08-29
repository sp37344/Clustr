import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	// userData = null;
	constructor(
    	public navCtrl: NavController,
		public app: App, 
		private facebook: Facebook,
		public nativeStorage: NativeStorage
		) {}

	logIn() {
		this.app.getRootNav().setRoot(TabsPage);
	}

	startTutorial() {
		// Do nothing
	}

	// loginWithFB() {
	// 	this.facebook.login(['email', 'public_profile']).then((response:FacebookLoginResponse) => {
	// 		this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
	// 			this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
	// 		})
	// 	})
	// }

	LoginWithFB() {
		let permissions = new Array<string>();
		let nav = this.navCtrl;
		let env = this;

		//the permissions of your facebook app needs from the user 
		permissions = ["public_profile"];

		this.facebook.login(permissions)
		.then(function(response){
			let userId = response.authResponse.userID;
			let params = new Array<string>();

			//Getting name and gender properties
			env.facebook.api("/me?fields=name,gender", params)
			.then(function(user) {
				user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
				env.nativeStorage.setItem('user',
				{
					name: user.name,
					gender: user.gender, 
					picture: user.picture
				})
				.then(function() {
					nav.push(TabsPage);
				}, function(error) {
					console.log(error);
				})
			})
		}, function(error) {
			console.log(error);
		});
	}
}