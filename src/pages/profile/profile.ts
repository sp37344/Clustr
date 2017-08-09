import { Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Configuration } from '../../app/app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})

export class ProfilePage {
	private headers : Headers;
	private user : any;
	private userId = 1;

	constructor(private _http: Http, private _configuration : Configuration) {
		console.log(this._configuration.apiUrl + 'users');
		// this.user = this._http.get(this._configuration.apiUrl + 'users').map((res : Response) => {
		// 	console.dir(res);
		// }).catch(this.handleError);

		// var headerOptions = {
		// 	'Content-Type' : 'application/json',
		// 	'Accept' : 'application/json',
		// 	'Access-Control-Allow-Headers' : 'Content-Type',
		// 	'Access-Control-Origin' : '*'
		// }
		// this.headers = new Headers(headerOptions);

		// this.headers = new Headers();
		// this.headers.append('Content-Type', 'application/json');
		// this.headers.append('Accept', 'application/json');
		// this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
		// // this.headers.append('Access-Control-Allow-Methods', 'GET');
		// this.headers.append('Access-Control-Origin', '*');

		this._http.get((this._configuration.apiUrl + 'users/' + this.userId)).map(res => res.json()).subscribe(res => {
			this.user = {
				'firstName' : res.data.first_name,
				'lastName' : res.data.last_name
			}

			switch (res.data.status) {
				case 'available':
					this.user['status'] = 'Available';
					break;
				case 'busy':
					this.user['status'] = 'Busy';
					break;
				default:
					this.user['status'] = 'Invisible';
			}
		});
	}

	private handleError(err : any) : Promise<any> {
		console.log('An error occurred', err);
		return Promise.reject(err.message || err);
	}
}