import Login from "./views/Login";
import Home from "./views/Home";
import { Navigation } from 'react-native-navigation'


// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, { Component } from 'react';
// import { Platform, StyleSheet, Text, View } from 'react-native';
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
// import * as firebase from 'firebase';
// import AsyncStorage from '@react-native-community/async-storage';
// import { PermissionsAndroid } from 'react-native';


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// export default class App extends Component {




//   state = {
//     count: 0,
//     driver: '5cb197ac5038c128198391b9',
//     ref: ''
//   }

//   componentDidMount() {
//     this.requestLocationPermission();
//     this.initializeApp();

//     BackgroundGeolocation.configure({
//       desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
//       stationaryRadius: 50,
//       distanceFilter: 50,
//       notificationTitle: 'Background tracking',
//       notificationText: 'enabled',
//       debug: true,
//       startOnBoot: false,
//       stopOnTerminate: true,
//       locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
//       interval: 10000,
//       fastestInterval: 5000,
//       activitiesInterval: 10000,
//       stopOnStillActivity: false,
//       url: 'http://192.168.81.15:3000/location',
//       httpHeaders: {
//         'X-FOO': 'bar'
//       },
//       // customize post properties
//       postTemplate: {
//         lat: '@latitude',
//         lon: '@longitude',
//         foo: 'bar' // you can also add your own properties
//       }
//     });
//       BackgroundGeolocation.on('start', () => {
//         console.log('hey')
//       })
//       BackgroundGeolocation.on('error', error => {
//       })

//     //   BackgroundGeolocation.on('background', () => {
//     //         BackgroundGeolocation.configure({
//     //             locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
//     //             interval: 10000,
//     //             fastestInterval: 5000,
//     //             activitiesInterval: 10000
//     //         })
//     //         BackgroundGeolocation.start()
//     // })

//     BackgroundGeolocation.on('location', (location) => {
//       this.updateGeolocation(location.latitude, location.longitude,[],this.state.driver);
//       console.log(JSON.stringify(location)+'on location');
//     },
//       (err) => {
//         alert(err);
//       }
//     );

//     BackgroundGeolocation.start()

//   }

//   initializeApp() {

//     if (!firebase.apps.length) {
//       firebase.initializeApp(
//         {
//           apiKey: 'AIzaSyDefXjbLUmYVdnCW0VqBV8pAHKHsOIHp_8',
//           authDomain: 'biotrips-loc.firebaseapp.com',
//           databaseURL: 'https://biotrips-loc.firebaseio.com',
//           projectId: 'biotrips-loc',
//           storageBucket: 'biotrips-loc.appspot.com',
//           messagingSenderId: '928977303330'
//         }
//       );
//   }
//     this.setState((prevState) => {
//       return {
//         ...prevState,
//         ref: firebase.database().ref(`geolocations/5cb197ac5038c128198391b9`),
//       }
//     })
//   }

//   requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           'title': 'Location Permission',
//           'message': 'This App needs access to your location ' +
//             'so we can know where you are.'
//         }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use locations ")
//         // this.watchPosition();
//       } else {
//         console.log("Location permission denied")
//       }
//     } catch (err) {
//       console.warn(err)
//     }
//   }


//   async updateGeolocation(lat, lng, trackedRoute, driver) {
//     try {
//       const existingKey = await AsyncStorage.getItem('mykey');
//       if (existingKey == driver) {
//         // firebase.database().ref('geolocations/' + localStorage.getItem('mykey')).set({
//         this.state.ref.set({
//           latitude: lat,
//           longitude: lng,
//           driverId: driver,
//           updatedAt: firebase.database.ServerValue.TIMESTAMP,
//           trackedRoute: trackedRoute
//         }).then(res => {

//         }).catch(err => {

//         })
//       } else {
//         console.log('else', lat, lng, driver, firebase.database.ServerValue.TIMESTAMP, trackedRoute);
//         let newData = this.state.ref.child(driver);
//         newData.set({
//           latitude: lat,
//           longitude: lng,
//           driverId: driver,
//           updatedAt: firebase.database.ServerValue.TIMESTAMP,
//           trackedRoute: trackedRoute
//         });
//         const isUpdated = await AsyncStorage.setItem('mykey', driver);
//         // localStorage.setItem('mykey', driver);
//       }
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }




import * as firebase from 'firebase';
import { PermissionsAndroid } from 'react-native';
import getToken from "./core/utils/Token";
import axios from 'axios';

Navigation.registerComponent('login', () => Login);
Navigation.registerComponent('home', () => Home);

requestLocationPermission = async () => {
  console.log('permission')
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This App needs access to your location ' +
          'so we can know where you are.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use locations ")
      // this.watchPosition();
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}


initializeApp = () => {
  console.log('initialize')
  if (!firebase.apps.length) {
    firebase.initializeApp(
      {
        apiKey: 'AIzaSyDefXjbLUmYVdnCW0VqBV8pAHKHsOIHp_8',
        authDomain: 'biotrips-loc.firebaseapp.com',
        databaseURL: 'https://biotrips-loc.firebaseio.com',
        projectId: 'biotrips-loc',
        storageBucket: 'biotrips-loc.appspot.com',
        messagingSenderId: '928977303330'
      }
    );
  }
}

this.initializeApp();
this.requestLocationPermission();



axios.interceptors.request.use(request =>{
  console.log(request);
  return request;
},
(err) =>{
  console.log(err)
}
)

getToken().then(
  (res) =>{
    if(!res){
      Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: 'login',
                passProps: {
                  text: 'stack with one child'
                }
              }
            }],
    
          }
        }
      });
    }
    else{
      Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: 'home',
                passProps: {
                  text: 'stack with one child'
                }
              }
            }],

          }
        }
      });
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res;
    }
  }
)

