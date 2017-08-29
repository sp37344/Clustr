import { Component, ViewChild } from '@angular/core'; //ViewChild
import { Platform, Nav } from 'ionic-angular'; //Nav
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
// import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  // rootPage:any = LoginPage;
  // rootPage:any = TabsPage;
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  // @ViewChild('myNav') nav: NavController

  constructor(
    platform: Platform, 
    public nativeStorage: NativeStorage,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();

      let env = this;
      this.nativeStorage.getItem('user')
      .then( function(data) {
        //User already logged in 
        env.nav.push(TabsPage);
        env.splashScreen.hide();
      }, function(error) {
        env.nav.push(LoginPage);
        env.splashScreen.hide();
      });

      this.statusBar.styleDefault();

      // // Here we will check if the user is already logged in
      // // because we don't want to ask users to log in each time they open the app
      // let env = this;
      // this.nativeStorage.getItem('user')
      // .then( function (data) {
      //   // user is previously logged and we have his data
      //   // we will let him access the app
      //   env.nav.push(TabsPage);
      //   env.splashScreen.hide();
      // }, function (error) {
      //   //we don't have the user data so we will ask him to log in
      //   env.nav.push(LoginPage);
      //   env.splashScreen.hide();
      // });

      // this.statusBar.styleDefault();
    });
  }
}