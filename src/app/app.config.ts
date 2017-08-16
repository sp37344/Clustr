import { Injectable } from '@angular/core';

@Injectable() export class Configuration {
	// public server : string = 'http://localhost:3000/';
	public server : string = 'http://192.168.42.154:3000/';
	public shortApiUrl : string = 'api/clustr/';
	public apiUrl = this.server + this.shortApiUrl;
}