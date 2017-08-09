# Clustr

This project is built using the [Ionic framework](http://ionicframework.com/docs).

## IMPORTANT: Using the Clustr API

During development, in order for the API function calls to work, add and enable the [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) Chrome extension to your browser. This is needed for cross-origin resource sharing (CORS), as the front-end and back-end of the project are hosted on different servers.

## Dependencies

This project has several dependencies (including bluebird, express, jade). Compiled below are the modules that should be installed in the project. Run all commands from the root folder. 

### Cordova and Ionic

Ionic is the hybrid app framework on which this project is being built on. Cordova is used for building apps into native projects for Android.

```bash
npm install -g cordova ionic
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

## Running the Ionic project

On web, serve the Ionic project in the browser. Run the `ionic serve` command in the root folder. You can then run the project in `http://localhost:8100/`.

```bash
$ ionic serve
```

To run on an Android device (note that this project is developed for Android), run the following commands in the root folder:

```bash
$ ionic cordova platform add android
$ ionic cordova run android
```

## Testing the API using Express

Run npm install in the root folder to install the Express dependency. Run the `npm start` command in the root folder. You can then test the API endpoints in `http://localhost:3000/`.

```bash
$ npm start
```