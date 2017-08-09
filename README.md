# Clustr

This project is built using the [Ionic framework](http://ionicframework.com/docs).

## IMPORTANT: Using the Clustr API

During development, in order for the API function calls to work, add and enable the [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) Chrome extension to your browser. This is needed for cross-origin resource sharing (CORS), as the front-end and back-end of the project are hosted on different servers.

### Dependencies

This project has several dependencies (including bluebird, express, jade), so please be sure to install the dependencies in the root folder of the project.

```bash
$ npm install
```

### Running the Ionic project

On web, serve the Ionic project in the browser. Run the `ionic serve` command in the root folder. You can then run the project in `http://localhost:8100/`.

```bash
$ ionic serve
```

To run on an Android device (note that this project is developed for Android), run the following commands in the root folder:

```bash
$ ionic cordova platform add android
$ ionic cordova run android
```

### Testing the API using ExpressJS

Run npm install in the root folder to install the Express dependency. Run the `npm start` command in the root folder. You can then test the API endpoints in `http://localhost:3000/`.

```bash
$ npm start
```