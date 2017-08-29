import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { EditActivitiesPage } from '../edit-activities/edit-activities';
import { LoginPage } from '../login/login';


@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html'
})

export class FriendsPage {
	constructor() {
	
	}
}