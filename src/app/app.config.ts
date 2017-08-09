import { Injectable } from '@angular/core';

@Injectable() export class Configuration {
	public server : string = 'http://localhost:3000/';
	public shortApiUrl : string = 'api/clustr/';
	public apiUrl = this.server + this.shortApiUrl;
}