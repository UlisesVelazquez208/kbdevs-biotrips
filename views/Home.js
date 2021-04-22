import React, { Component } from 'react'
import { Text, View, StyleSheet, Switch, ScrollView, TouchableOpacity, Image, AppState } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import * as firebase from 'firebase';
import axios from 'axios';
import { Tabs, Tab, ScrollableTab, Header, Container, Icon, Thumbnail } from 'native-base';
import Moment from 'moment';
import { Navigation } from 'react-native-navigation';
import RNRestart from 'react-native-restart';

export class Home extends Component {

    static options = {
        topBar: {
            visible: false,
            height: 0
        }
    }

    state = {
        componentUnmount: false,
        appState: AppState.currentState,
        driverData: null,
        hideConnected: true,
        ref: '',
        trackedRoute: [],
        switchValue: false,
        selectedTab: 'lic',
        driver: '',
        locationError: 'off'
    }

    componentWillMount() {
        console.log("home screen will mount now");
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentDidMount = async () => {

        const driver = await AsyncStorage.getItem('userData');
        this.setState((prevState) => {
            return {
                ...prevState,
                driver: driver,
            }
        });
        this.getDriver(JSON.parse(driver));
    }

    componentDidCatch() {
        console.log("home screen didcatch now");
    }

    componentDidUpdate() {
        console.log("home screen did update now");
    }

    componentWillUnmount() {
        // this.setState({
        //     componentUnmount: true
        // })
        this.state.componentUnmount = true;
        console.log("home screen will unmount now");
    }

    componentWillUpdate() {
        console.log("home screen will update now");
    }

    componentWillReceiveProps() {
        console.log("home screen will receive props now");
    }

    // shouldComponentUpdate() {
    //     console.log("home screen should update now");
    // }

    getDriver = (driver) => {
        console.log(driver)
        axios.get(`https://api.biotrips.app/driver/${driver.id}`).then(
            (res) => {
                // console.log(res.data.data)
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        driverData: res.data.data,
                        ref: firebase.database().ref(`geolocations/${driver.id}`),
                    }
                });
                if (res.data.data.driver.online) {
                    this.startLocation();
                    this.getRefData();
                    setInterval(() => {
                        this.getRefData();
                    }, 10000)
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            switchValue: true,
                            hideConnected: true
                        }
                    })
                }
                else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            hideConnected: false
                        }
                    })
                }
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }

    startLocation = () => {
        console.log(this.state);

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: true,
            startOnBoot: true,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
            url: `https://biotrips-loc.firebaseio.com/geolocations/${this.state.driverData._id}.json`,
            httpHeaders: {
                // 'X-FOO': 'bar'
            },
            // customize post properties
            postTemplate: {
                latitude: '@latitude',
                longitude: '@longitude',
                driverId: this.state.driverData._id,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            }
        });
        BackgroundGeolocation.on('start', () => {
        })
        BackgroundGeolocation.on('error', error => {
        })

        BackgroundGeolocation.on('location', (location) => {
            console.log('onlocation');
            let data = {
                lat: location.latitude,
                lon: location.longitude
            }
            this.setState((prevState) => {
                return {
                    ...prevState,
                    // trackedRoute:this.state.trackedRoute?this.state.trackedRoute.concat:[]
                }
            })
            // if (this.state.driverData.driver.online) {
            //     this.updateGeolocation(location.latitude, location.longitude, this.state.trackedRoute, this.state.driverData._id);
            // }
        },
            (err) => {
                console.log(err, 'nolocation');
            }
        );

        BackgroundGeolocation.on('background', () => {
            console.log("onbackground");
            // BackgroundGeolocation.configure({
            //     locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            //     interval: 10000,
            //     fastestInterval: 5000,
            //     activitiesInterval: 10000
            // })
            // BackgroundGeolocation.start()
        })

        BackgroundGeolocation.start()
    }


    async updateGeolocation(lat, lng, trackedRoute, driver) {
        try {
            const existingKey = await AsyncStorage.getItem('mykey');
            if (existingKey == driver) {
                this.state.ref.set({
                    latitude: lat,
                    longitude: lng,
                    driverId: driver,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP,
                    trackedRoute: trackedRoute
                }).then(res => {

                }).catch(err => {

                })
            } else {
                let newData = this.state.ref.child(driver);
                newData.set({
                    latitude: lat,
                    longitude: lng,
                    driverId: driver,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP,
                    trackedRoute: trackedRoute
                });
                const isUpdated = await AsyncStorage.setItem('mykey', driver);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    switchOnline = (event) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                switchValue: event
            }
        })
        if (event) {
            this.editLocation(event);
            this.startLocation();
        }
        else {
            this.editLocation(event);
            BackgroundGeolocation.stop();            
        }
    }

    onTabChange = (val) => {
        this.setState(prevState => {
            return {
                ...prevState,
                selectedTab: val
            }
        })
    }

    _handleAppStateChange = nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
          if(this.state.componentUnmount) {
            RNRestart.Restart();
          }
        }
        this.setState({ appState: nextAppState });
      };

    editLocation = async (event) => {
        axios.patch(`https://api.biotrips.app/driver/onlineStatus`, { online: event }).then(
            (res) => {
                this.getDriver(JSON.parse(this.state.driver));
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }

    logOut = async () => {
        try {
            const isClear = await AsyncStorage.clear();
            BackgroundGeolocation.stop();
            this.editLocation(false);
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [{
                            component: {
                                name: 'login',
                                passProps: {
                                }
                            }
                        }],

                    }
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }


    getRefData = () => {
        this.state.ref.on('value', resp => {
            if (resp.val()) {
                snapshotToArray(resp).forEach(formData => {
                    let key = Object.keys(formData)[Object.keys(formData).length - 2];
                    let data = formData[(key)][0];
                    if (data.updatedAt) {
                        let date = new Date();
                        let update = new Date(JSON.parse(data.updatedAt));
                        if ((date.getFullYear() == update.getFullYear()) && (date.getDay() == update.getDay()) && (date.getMonth() == update.getMonth())) {
                            if (Moment.duration(Moment.utc(date).diff(Moment.utc(update)))['_data']['minutes'] > 0) {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        locationError: 'off'
                                    }
                                })
                            }
                            else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        locationError: 'on'
                                    }
                                })
                            }
                        }
                        else {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    locationError: 'off'
                                }
                            })
                        }
                    }
                    else {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                locationError: 'off'
                            }
                        })
                    }
                });
            }
            else {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        locationError: 'off'
                    }
                })
            }

        });

    }


    render() {
        Moment.locale('en');
        return (
            <View>
                <View style={styles.voiletContainer}>
                    <View style={styles.logOutHeader}>
                        <View style={styles.toggleContainer}>
                            <Text style={[styles.text, styles.font, { marginRight: 8 }]}>Offline</Text>
                            <Switch onValueChange={this.switchOnline} value={this.state.switchValue} thumbTintColor={!this.state.switchValue ? 'white' : 'red'} onTintColor={!this.state.switchValue ? 'white' : '#ff00006e'} />
                            <Text style={[styles.text, styles.font]}>Online</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon name='log-out' style={{ color: 'white', fontSize: 22 }} onPress={this.logOut} />
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.driverData ?
                            <View style={styles.nameContainer}>
                                <Text style={[styles.text, { fontWeight: '800', fontSize: 23 }, styles.font]}>{this.state.driverData.name}</Text>
                                <Text style={[styles.text, styles.font]}>{this.state.driverData.email}</Text>
                                <Text style={[styles.text, styles.font]}>{this.state.driverData.phone}</Text>
                                {
                                    this.state.hideConnected ?
                                        <View style={styles.connectedContainer}>
                                            <View style={[styles.circle, this.state.locationError == 'on' ? { backgroundColor: '#10dc60' } : { backgroundColor: 'red' }]}></View>
                                            <Text style={[styles.font, { color: 'white', fontSize: 17, marginLeft: 12 }]}>Connected</Text>
                                        </View>
                                        : null
                                }
                            </View>
                            : null
                    }
                    <View>
                        <ScrollView style={styles.scrollDiv} horizontal>
                            <TouchableOpacity onPress={() => this.onTabChange('lic')} style={[styles.scrollContent, this.state.selectedTab == 'lic' ? styles.selected : null]}><Text style={[styles.text, styles.font]} >Licence Details</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onTabChange('pol')} style={[styles.scrollContent, this.state.selectedTab == 'pol' ? styles.selected : null]}><Text style={[styles.text, styles.font]}>Police Verification</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onTabChange('cab')} style={[styles.scrollContent, this.state.selectedTab == 'cab' ? styles.selected : null]}><Text style={[styles.text, styles.font]}>Cab Details</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onTabChange('ven')} style={[styles.scrollContent, this.state.selectedTab == 'ven' ? styles.selected : null]}><Text style={[styles.text, styles.font]}>Vendor Details</Text></TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
                {
                    this.state.driverData ?
                        <View style={styles.mainContainer}>
                            {
                                this.state.selectedTab == 'lic' ?
                                    <View style={styles.card}>
                                        <Image source={{ uri: this.state.driverData.driver.licence.image }} style={styles.imageContainer} />
                                        <Text style={[styles.expDate, styles.font]}><Text style={styles.bold}>Exp. Date:</Text> {Moment(this.state.driverData.driver.licence.exp_date).format('d MMM YYYY')}</Text>
                                    </View>
                                    : null
                            }
                            {
                                this.state.selectedTab == 'pol' ?
                                    <View style={styles.card}>
                                        <Image source={{ uri: this.state.driverData.driver.verification.image ? this.state.driverData.driver.verification.image : 'http://www.sclance.com/pngs/image-placeholder-png/image_placeholder_png_698412.png' }} style={styles.imageContainer} />
                                        <Text style={[styles.expDate, styles.font]}><Text style={styles.bold}>Exp. Date:</Text> {Moment(this.state.driverData.driver.verification.exp_date).format('d MMM YYYY')}</Text>
                                    </View>
                                    : null
                            }
                            {
                                this.state.selectedTab == 'cab' ?
                                    <View style={[styles.card, { padding: 20 }]}>
                                        <Text style={[styles.textCab, styles.font]}>{this.state.driverData.driver.assigned_cab.name}</Text>
                                        <Text style={[styles.textCab, styles.font]}><Text style={styles.bold}>Model : </Text>{this.state.driverData.driver.assigned_cab.cab_model}</Text>
                                        <Text style={[styles.textCab, styles.font]}><Text style={styles.bold}>Number: </Text>{this.state.driverData.driver.assigned_cab.cab_number}</Text>

                                    </View>
                                    : null
                            }
                            {
                                this.state.selectedTab == 'ven' ?
                                    <View style={[styles.card, { padding: 20 }]}>
                                        <Text style={[styles.textCab, styles.bold, styles.font]}>{this.state.driverData.driver.vendor.name}</Text>
                                        <Text style={[styles.textCab, styles.font]}>{this.state.driverData.driver.vendor.email}</Text>
                                        <Text style={[styles.textCab, styles.font]}>{this.state.driverData.driver.vendor.phone}</Text>
                                    </View>
                                    : null
                            }
                        </View>
                        : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    voiletContainer: {
        // padding: 15,
        backgroundColor: '#694eff',
        color: 'white'
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: 'white',
    },
    logOutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    nameContainer: {
        alignItems: 'center',
        paddingVertical: 40
    },
    scrollContent: {
        minWidth: 150,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',

    },
    mainContainer: {
        padding: 40
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,

        elevation: 3,
        // padding: 15,
        backgroundColor: 'white'
    },
    expDate: {
        padding: 17
    },
    imageContainer: {
        width: '100%',
        height: 200
    },
    textCab: {
        fontSize: 23,
        alignSelf: 'center'
    },
    bold: {
        fontWeight: '800'
    },
    selected: {
        // borderWidth:2,
        borderBottomWidth: 4,
        borderColor: 'white'
    },
    font: {
        fontFamily: "LouisCafe",
    },
    connectedContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 100,
    }


})

export const snapshotToArray = snapshot => {
    let returnArr = [];
    let childSnapshot = snapshot;
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
    return returnArr;
}

export default Home
