import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Configuration } from './app.config';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { EditActivitiesPage } from '../pages/edit-activities/edit-activities';
import { MapPage } from '../pages/map/map';
import { MessagesPage } from '../pages/messages/messages';
import { FriendsPage } from '../pages/friends/friends';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    ProfilePage,
    EditActivitiesPage,
    MapPage,
    MessagesPage,
    FriendsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    ProfilePage,
    EditActivitiesPage,
    MapPage,
    MessagesPage,
    FriendsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    Configuration,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}