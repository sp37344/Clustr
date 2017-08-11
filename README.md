# Clustr

This project is built using the [Ionic framework](http://ionicframework.com/docs).

## IMPORTANT: Using the Clustr API

During development, in order for the API function calls to work, add and enable the [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) Chrome extension to your browser. This is needed for cross-origin resource sharing (CORS), as the front-end and back-end of the project are hosted on different servers.

## Dependencies

This project has several dependencies (including bluebird, express, jade). Compiled below are the modules that should be installed in the project. Run all commands from the root folder. 

### Cordova and Ionic

Ionic is the hybrid app framework on which this project is being built on. Cordova is used for building apps into native projects for Android. Run this in the root folder of the project.

```bash
$ npm install -g cordova ionic
```

### Express Generator

ExpressJS is the web application framework for Node.js, designed for building web applications and API's. In this project, it is used to test API's.

```bash
$ npm install express-generator@4 -g
$ express
$ npm install
```

### pg-promise

pg-promise makes connection management with databases much easier, providing a powerful query formatting engine and support for automated transactions.

```bash
$ npm install pg-promise@5 --save
```

### Bluebird

Bluebird provides a way of working with Promises in NodeJS, allowing project developers to control the flow of their asynchronous code.

```bash
$ npm install bluebird@3 --save
```

### Ionic Facebook Native

For more information, you can read more on the [Ionic Facebook Native docs](https://ionicframework.com/docs/native/facebook/). The Facebook plugin should then be added to the app's module.

```bash
$ ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="123456789" --variable APP_NAME="myApplication"
$ npm install --save @ionic-native/facebook
```

### Installing Dependencies

Finally, please be sure to install the dependencies in the root folder of the project.

```bash
$ npm install
```

## Testing the API using Express

Run npm install in the root folder to install the Express dependency. Run the `npm start` command in the root folder. You can then test the API endpoints in `http://localhost:3000/`. Note that the app will not probably load information unless this database is running.

```bash
$ npm start
```

## Building the Ionic project on Web

On web, serve the Ionic project in the browser. Run the `ionic serve` command in the root folder. You can then run the project in `http://localhost:8100/`. _Reminder: Make sure you have activated the web service in the Express environment._

```bash
$ ionic serve
```

## Building on an Android Device

Building on the Android device is a little complicated, as the Android device will need to be able to communicate with the Clustr web service. _Reminder: Make sure you have activated the web service in the Express environment._

First, connect your Android device to your computer via a USB cable. For the app to properly build on the device, turn on USB Debugging as well as USB Tethering in your Settings.

Run `ipconfig` in your computer's terminal to retrieve the IPv4 Address of your wireless connection, likely going to be formatted similarly to `192.168.XX.XXX`, where each `X` represents whatever numbers are in your IP address.

```bash
$ ipconfig
```

In all API .js files (e.g. **users.js** or **activities.js**), which are found in the **_api_** folder, change your database initialization code to the following, where `host` is your IP address and `username` and `password` are the administrative credentials you assigned to your PostgreSQL database. Note that major updates to this repository are accompanied with a **clustr.pgsql** file, such that you are able to replicate the results of the app at a certain point in time.

```
var db = pgp({
	host: '192.168.XX.XXX',
	port: 5432, // Or your desired port
	database: 'clustr',
	user: 'postgres',
	password: 'c1ustR!17'
}) 
```

Additionally, change the following line stored in the **app.config.ts** file, found in the **_src > app_** folder, to the following.

```
public server : string = 'http://192.168.XX.XXX:3000/';
```

Finally, to run on an Android device (note that this project is developed for Android), enter the following commands in the root folder to build and run the app.

```bash
$ ionic cordova platform add android
$ ionic cordova run android
```