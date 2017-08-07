import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';
import { MessagesPage } from '../messages/messages';
import { FriendsPage } from '../friends/friends';

@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})

export class TabsPage {
	profileRoot = ProfilePage;
	mapRoot = MapPage;
	messagesRoot = MessagesPage;
	friendsRoot = FriendsPage;

	constructor() {

	}
}