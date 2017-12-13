import React from 'react';
import { StyleSheet, Button, Text, View, Image, Animated, TouchableNativeFeedback, TouchableHighlight, DrawerLayoutAndroid, ToolbarAndroid } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Mapbox, { MapView, Annotation } from 'react-native-mapbox-gl';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Search from './Search';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Switch from 'react-native-switch-pro';
import Tts from 'react-native-tts';
import Checkbox from './Checkbox';
import RNSimpleCompass from 'react-native-simple-compass';
import Menu from './Menu';


const mbToken = 'pk.eyJ1IjoicGh1b25nbGFtIiwiYSI6ImNqNW0zNjQzaTJrMGkyd2pqdmJveG51NXoifQ.uhAeWG3acnc4bkcShVmtkA';
Mapbox.setAccessToken(mbToken);


class MyHomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    }
    found = false;
    user = null;
    currentStreetId = null;
    waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "dumpId";
            }
            if (timers[uniqueId]) {
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })()

    constructor(props) {
        super(props);
        this.state = {
            cameras: [],
            logs: [],
            canNavigate: false,
            userTrackingMode: Mapbox.userTrackingMode.followWithCourse,
            annotations: [{
                coordinates: [40.72052634, -73.97686958312988],
                type: 'point',
                title: 'This is marker 1',
                subtitle: 'It has a rightCalloutAccessory too',
                rightCalloutAccessory: {
                    source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
                    height: 25,
                    width: 25
                },
                annotationImage: {
                    source: { uri: 'https://cldup.com/CnRLZem9k9.png' },
                    height: 25,
                    width: 25
                },
                id: 'marker1'
            }],
            voiceWarning: false,
            SFXWarning: false,
            notificationWarning: true,
            policeWarning: false,
            cameraWarning: true,
            privateWarning: false,
            language: "english",
            destination: {},
            warningMessage: ""
        };
    }
    componentDidMount() {
        RNSimpleCompass.start(5, (degree) => {
            console.log(degree);
        });
    }
    componentWillUnmount = () => {
        alert("clear");
        // window.clearInterval(this.timeId);
        RNSimpleCompass.stop();
    }
    onRegionDidChange(event) {
    }
    onRegionWillChange(event) {
    }
    menu() {
        this.refs['DRAWER'].openDrawer();
    }
    onOpenAnnotation(event) {
        if (event.id === "destination") {
            this.setState({
                canNavigate: true,
                destination: {
                    latitude: event.latitude,
                    longitude: event.longitude
                }
            });
        }
    }
    showDestination(item) {
        console.log(item);
        this.setState({
            annotations: [{
                coordinates: [item.location.lat, item.location.lng],
                type: 'point',
                title: item.name,
                subtitle: item.address,
                id: 'destination'
            }]
        });
        this.zoom = 15;
        this._map.setCenterCoordinateZoomLevel(item.location.lat, item.location.lng, 15, animated = true, () => {
            this._map.selectAnnotation("destination", animated = true);
        });
    }
    start() {
        var start = this.user,
            end = this.state.destination,
            query = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&overview=full&geometries=geojson&access_token=` + mbToken;

        fetch(query).then((response) => response.json())
            .then((data) => {
                console.log(data);
                var points = data.routes[0].geometry.coordinates;
                points.forEach(function (point, index) {
                    points[index] = [point[1], point[0]];
                }, this);
                this.setState({
                    annotations: [...this.state.annotations, {
                        coordinates: points,
                        type: 'polyline',
                        strokeColor: '#3498db',
                        strokeWidth: 5,
                        strokeAlpha: .5,
                        id: 'direction'
                    }],
                    canNavigate: false
                });
                this.zoom = 16;
                this._map.easeTo({
                    latitude: start.latitude, longitude: start.longitude, zoomLevel: 16,
                    direction: data.routes[0].legs[0].steps[0].maneuver.bearing_after,//this.bearing({ lat: start.latitude, lon: start.longitude }, { lat: end.latitude, lon: end.longitude }),
                    pitch: 60
                }, animated = true);

            }).catch((error) => {
                console.error(error);
            });
    }
    zoomIn() {
        if (this.zoom < 20) {
            this.zoom++;
            this._map.setZoomLevel(this.zoom, animated = true);
        }
    }
    degrees(latOrLon) {
        return latOrLon * 180 / Math.PI;
    }
    radians(latOrLon) {
        return latOrLon * Math.PI / 180;
    }
    bearing(point1, point2) {
        var φ1 = this.radians(point1.lat), φ2 = this.radians(point2.lat);
        var Δλ = this.radians(point2.lon - point1.lon);

        var y = Math.sin(Δλ) * Math.cos(φ2);
        var x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        var θ = Math.atan2(y, x);

        return (this.degrees(θ) + 360) % 360;
    }
    zoomOut() {
        if (this.zoom > 0) {
            this.zoom--;
            this._map.setZoomLevel(this.zoom, animated = true);
        }
    }
    onTap(event) {
        if (event.latitude !== this.state.destination.latitude && event.longitude !== this.state.destination.longitude) {
            this.setState({
                canNavigate: false
            });
        }
    }
    simulateCameras(point) {
        var randomPoints = [],
            count = 50;

        while (count--) {
            randomPoints.push(this.creatRandomPoint(point.lat, point.lon, 1000));
        }

        pointString = randomPoints.map((item) => {
            return item.lat + "," + item.lon;
        }).join("|");
        console.log(randomPoints);
        var query = "https://roads.googleapis.com/v1/nearestRoads?points=" + pointString + "&key=AIzaSyB5dFqrJQ98JxYs3MtQNx1vatQgp8fp-6Q";
        fetch(query).then((response) => response.json())
            .then((data) => {
                var cameras = [];
                console.log(data);
                data.snappedPoints.forEach((item) => {
                    if (cameras.length === 0 || item.location.latitude !== cameras[cameras.length - 1].latitude || item.location.longitude !== cameras[cameras.length - 1].longitude) {
                        cameras.push({
                            latitude: item.location.latitude,
                            longitude: item.location.longitude,
                            placeId: item.placeId
                        });
                    }
                });
                this.setState({
                    cameras: cameras
                });
            }).catch((error) => {
                console.error(error);
            });
    }
    creatRandomPoint(original_lat, original_lng, radius) {
        var r = radius / 111300 // = 100 meters
            , y0 = original_lat
            , x0 = original_lng
            , u = Math.random()
            , v = Math.random()
            , w = r * Math.sqrt(u)
            , t = 2 * Math.PI * v
            , x = w * Math.cos(t)
            , y1 = w * Math.sin(t)
            , x1 = x / Math.cos(y0)

        newY = y0 + y1
        newX = x0 + x1
        return {
            lat: newY,
            lon: newX
        };
    }
    getCurrentStreet(event) {
        var query = "https://roads.googleapis.com/v1/nearestRoads?points=" + event.latitude + ',' + event.longitude + "&key=AIzaSyB5dFqrJQ98JxYs3MtQNx1vatQgp8fp-6Q";
        fetch(query).then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.snappedPoints.length > 0) {
                    this.currentStreetId = data.snappedPoints[0].placeId;
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    headingDelta(oldHeading, newHeading) {
        var headingDelta = newHeading > oldHeading ? newHeading - oldHeading : oldHeading - newHeading;
        if (headingDelta > 180) {
            headingDelta = 360 - headingDelta;
        }

        return headingDelta;
    }
    isTurning(event) {
        if (event.trueHeading >= 0) {
            let yes = this.headingDelta(event.trueHeading, this.heading) > 65;
            yes && this.setState({
                logs: [...this.state.logs, "turn"]
            });
            return yes;
        } else {
            return false;
        }
    }
    hasTraveled(event, distanceInMeter) {
        if (this.user) {
            let yes = this.distanceBetween(event, this.user) >= distanceInMeter;
            yes && this.setState({
                logs: [...this.state.logs, "travel enough"]
            });
            return yes;
        } else {
            return false;
        }
    }
    detectDangers(event) {
        var isMoving = event.trueHeading >= 0,
            warning = false;

        if (isMoving) {
            this.setState({
                logs: [...this.state.logs, "moving on street " + this.currentStreetId]
            });
            this.state.cameras.forEach((point) => {
                var heading,
                    distance,
                    log = "";
                if (point.placeId === this.currentStreetId) {
                    log += "found one camera...";
                    heading = this.bearing({ lat: event.latitude, lon: event.longitude }, { lat: point.latitude, lon: point.longitude });
                    log += "heading - " + heading + "...th - " + event.trueHeading + "...";
                    if (this.headingDelta(event.trueHeading, heading) < 90) {
                        distance = this.distanceBetween(event, point);
                        log += " dis - " + distance + "...";
                        if (distance <= 1000) {
                            warning = true;
                            this.setState({
                                warningMessage: "Be careful camera ahead after " + distance + " meters"
                            });
                        }
                    }
                    this.setState({
                        logs: [...this.state.logs, log]
                    });
                }
            });
            if (!warning) {
                this.setState({
                    warningMessage: ""
                });
            }
        }
    }
    onUpdateUserLocation(event) {
        var heading = event.trueHeading >= 0 ? event.trueHeading : 0,
            log = "";

        if (!this.simulated) {
            this.simulateCameras({
                lat: event.latitude,
                lon: event.longitude
            });
            this.simulated = true;
        }

        if (!this.found) {
            this._map.easeTo({
                latitude: event.latitude,
                longitude: event.longitude,
                zoomLevel: 16,
                pitch: 60
            }, animated = true);
            this.zoom = 16;
            this.found = true;
            // setTimeout(() => {
            //     this.setState({
            //         userTrackingMode: Mapbox.userTrackingMode.followWithCourse
            //     });
            // }, 1000);
        }

        // if (event.trueHeading >= 0 && this.state.userTrackingMode === Mapbox.userTrackingMode.followWithCourse) {
        //     this.setState({
        //         userTrackingMode: Mapbox.userTrackingMode.followWithCourse
        //     })
        // } else if (event.trueHeading < 0 && this.state.userTrackingMode === Mapbox.userTrackingMode.followWithCourse) {
        //     this.setState({
        //         userTrackingMode: Mapbox.userTrackingMode.followWithCourse
        //     });
        // }


        this.detectCamera(event);

        this.user = {
            latitude: event.latitude,
            longitude: event.longitude
        };
        this.heading = heading;

    }
    downloadMap() {

    }
    detectCamera(event) {
        var isMoving = event.trueHeading >= 0,
            warning = false;
        if (isMoving) {
            log = "moving...";
            this.state.cameras.forEach((point) => {
                var heading,
                    distance,
                    log = "",
                    headingDelta;

                heading = this.bearing({ lat: event.latitude, lon: event.longitude }, { lat: point.latitude, lon: point.longitude });
                headingDelta = this.headingDelta(event.trueHeading, heading);
                log += "heading - " + heading + "...th - " + event.trueHeading + "...delta - " + headingDelta + "...";
                if (headingDelta < 30) {
                    distance = this.distanceBetween(event, point);
                    log += " dis - " + distance + "...";
                    if (distance <= 1000) {
                        warning = true;
                        this.state.voiceWarning && Tts.speak("Be careful camera ahead after " + distance + " meters");
                        this.setState({
                            warningMessage: "Be careful camera ahead after " + distance + " meters",
                            logs: [...this.state.logs, log]
                        });
                    }
                }
            });
            if (!warning) {
                this.setState({
                    warningMessage: "",
                    logs: [...this.state.logs, log]
                });
            }
        }
    }
    distanceBetween(point1, point2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.radians(point2.latitude - point1.latitude);  // deg2rad below
        var dLon = this.radians(point2.longitude - point1.longitude);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.radians(point1.latitude)) * Math.cos(this.radians(point2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = (R * c) * 1000; // Distance in km
        return Math.round(distance);
    }
    onFinishLoadingMap() {
        console.log("dsadsa");
    }
    onRegionDidChange() {
        console.log("mcks dkds");
    }
    search() {
        this.refs['SEARCH'].show();
    }
    recenter() {
        if (this.user) {
            this._map.easeTo({
                latitude: this.user.latitude,
                longitude: this.user.longitude,
                zoomLevel: 16,
                pitch: 60
            }, animated = true);
            this.zoom = 16;
            // setTimeout(() => {
            //     this.setState({
            //         userTrackingMode: Mapbox.userTrackingMode.followWithCourse
            //     });
            // }, 1000);
        }
    }
    onChangeUserTrackingMode(userTrackingMode) {
        this.setState({ userTrackingMode });
        if (userTrackingMode === Mapbox.userTrackingMode.none) {
            setTimeout(() => {
                this.setState({
                    userTrackingMode: Mapbox.userTrackingMode.followWithCourse
                });
            }, 1000);
        }
    }
    getInfo() {
        this._map.queryRenderedFeatures({
            rect: { // required if point not defined. Dimensions of rectangle on screen
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            // layers: ['building'] // optional. Array of layer names
        },
            (result) => {
                alert(JSON.stringify(result));
            } // optional. Alternative to returned promise
        );
    }
    render() {
        const resizeMode = "stretch";
        var navigationView = (
            <Menu onVoiceChecked={(checked) => this.state.voiceWarning = checked}
                onSFXChecked={(checked) => this.state.SFXWarning = checked}
                onNotificationChecked={(checked) => this.state.notificationWarning = checked}></Menu>
        );
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                ref={'DRAWER'}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <Search onPlacePicked={(item) => this.showDestination(item)} ref={'SEARCH'}></Search>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.buttonsLeft}>
                            <TouchableNativeFeedback onPress={() => this.menu()}>
                                <Image
                                    style={{
                                        resizeMode,
                                        width: 30,
                                        height: 30
                                    }}
                                    source={require('../assets/icons/menu.png')}
                                >
                                </Image>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.title}>Shall!f</Text>
                        </View>
                        <View style={styles.buttonsRight}>
                            <TouchableNativeFeedback onPress={() => this.search()}>
                                <Image
                                    style={{
                                        resizeMode,
                                        width: 30,
                                        height: 30
                                    }}
                                    source={require('../assets/icons/search.png')} >
                                </Image>
                            </TouchableNativeFeedback>
                            {/* <TouchableNativeFeedback onPress={() => this.downloadMap()}>
                                <Icon2 name="cloud-download" style={{ fontSize: 30, color: 'white' }} />
                            </TouchableNativeFeedback> */}
                        </View>
                    </View>
                    <TouchableNativeFeedback onPress={() => this.zoomIn()}>
                        <View style={{ position: 'absolute', zIndex: 1000, top: 240, width: 50, height: 50, left: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#3af', elevation: 6 }}>
                            <Icon name="md-add" style={{ fontSize: 35, color: 'white' }} />
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.zoomOut()}>
                        <View style={{ position: 'absolute', zIndex: 1000, top: 300, width: 50, height: 50, left: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#3af', elevation: 6 }}>
                            <Icon name="md-remove" style={{ fontSize: 35, color: 'white' }} />
                        </View>
                    </TouchableNativeFeedback>
                    {this.state.canNavigate && <TouchableNativeFeedback onPress={() => this.start()}>
                        <View style={{ position: 'absolute', zIndex: 1000, bottom: 100, width: 50, height: 50, right: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#66BB6A', elevation: 6 }}>
                            <MaterialIcon name="directions" style={{ fontSize: 20, color: 'white' }} />
                            <Text style={{ fontFamily: 'ArialRound', color: 'white' }}>Start</Text>
                        </View>
                    </TouchableNativeFeedback>}
                    <TouchableNativeFeedback onPress={() => this.recenter()}>
                        <View style={{ padding: 10, position: 'absolute', zIndex: 1000, bottom: '15%', width: 130, height: 50, left: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2, backgroundColor: 'white', elevation: 4 }}>
                            <Icon name="md-navigate" style={{ fontSize: 30, color: '#3af' }} />
                            <Text style={{ fontSize: 20, fontFamily: "ArialRound" }}>Re-center</Text>
                        </View>
                    </TouchableNativeFeedback>

                    {this.state.warningMessage.length > 0 && this.state.notificationWarning === true && <View style={{ padding: 2, position: 'absolute', zIndex: 1000, top: 60, width: '100%', height: 100, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(37, 187, 80, 0.58)' }}>
                        <Image
                            style={{
                                resizeMode,
                                width: 35,
                                height: 28
                            }}
                            source={require('../assets/icons/camera.png')}
                        >
                        </Image>
                        <Text style={{ color: 'white', textAlign: "center", fontSize: 20, fontFamily: "ArialRound" }}>{this.state.warningMessage}</Text>
                    </View>}
                    <MapView
                        ref={map => { this._map = map; }}
                        style={styles.map}
                        rotateEnabled={true}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        userTrackingMode={this.state.userTrackingMode}
                        styleURL={Mapbox.mapStyles.streets}
                        annotations={this.state.annotations}
                        onRegionDidChange={(event) => this.onRegionDidChange(event)}
                        onRegionWillChange={(event) => this.onRegionWillChange(event)}
                        onOpenAnnotation={(event) => this.onOpenAnnotation(event)}
                        onRightAnnotationTapped={this.onRightAnnotationTapped}
                        onUpdateUserLocation={(event) => this.onUpdateUserLocation(event)}
                        onLongPress={this.onLongPress}
                        onTap={(event) => this.onTap(event)}
                        onChangeUserTrackingMode={(event) => this.onChangeUserTrackingMode(event)}
                        onFinishLoadingMap={() => this.onFinishLoadingMap()}
                    >
                        {
                            this.state.cameras.map((point, index) => (<Annotation
                                id={"camera" + index}
                                key={"camera" + index}
                                coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                                style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                                <View style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'gray' }}>
                                    <Image
                                        style={{
                                            resizeMode,
                                            width: 20,
                                            height: 16
                                        }}
                                        source={require('../assets/icons/camera.png')}
                                    >
                                    </Image>
                                </View>
                            </Annotation>))
                        }
                    </MapView>
                    <View style={styles.ads}>
                        <Text style={{ fontSize: 35, color: 'white', fontFamily: "ArialRoundBold" }}>Google Ads</Text>
                    </View>
                </View>
            </DrawerLayoutAndroid >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    map: {
        flex: 6,
        width: '100%'
    },
    ads: {
        flex: 1,
        backgroundColor: "#3af",
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    header: {
        backgroundColor: '#FBBC57',
        width: "100%",
        height: 60,
        elevation: 4,
        flexDirection: "row"
    },
    buttonsRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10,
    },
    center: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    buttonsLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontFamily: "ArialRoundBold"
    }
});



export default MyHomeScreen;