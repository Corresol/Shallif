import React, { PropTypes } from 'react';
import { StyleSheet, Button, Text, Animated, Platform, TextInput, View, Image, TouchableNativeFeedback, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height, width } = Dimensions.get('window');
const PANEL_HEIGHT = height - 60;
var INITIAL_TOP = -60;
const TOKEN = 'pk.eyJ1IjoicGh1b25nbGFtIiwiYSI6ImNqNW0zNjQzaTJrMGkyd2pqdmJveG51NXoifQ.uhAeWG3acnc4bkcShVmtkA';

class Search extends React.Component {
    static propTypes = {
        items: PropTypes.array,
        onTextChanged: PropTypes.func,
        onPlacePicked: PropTypes.func
    }
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
            searhText: "",
            top: new Animated.Value(INITIAL_TOP),
            show: false,
            resultTop: new Animated.Value(height),
            container: new Animated.Value(width),
            items: []
        };
    }
    pickPlace = (item) => {
        if (this.props.onPlacePicked) {
            this.props.onPlacePicked(item);
        }
        this.hide();
    }
    searchChanged = (value) => {
        this.setState({ searhText: value });
        this.waitForFinalEvent(() => {
            this._search(value);
        }, 500, "search");
    }
    clear() {
        this.setState({
            searhText: ""
        });
    }
    _search = (value) => {
        navigator.geolocation.getCurrentPosition((position) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${TOKEN}`).then((response) => response.json())
                .then((currentLocation) => {
                    var country;
                    currentLocation.features.forEach((item) => {
                        if (item.place_type && item.place_type[0] === "country") {
                            country = item.properties.short_code;
                        }
                    });

                    var text = value.replace(/\s/gi, "+"),
                        // query = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?country=${country}&types=address,poi&access_token=${TOKEN}&limit=15`,
                        query = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&location=${position.coords.latitude},${position.coords.longitude}&radius=50000&key=AIzaSyB5dFqrJQ98JxYs3MtQNx1vatQgp8fp-6Q`,
                        // query = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&location=${position.coords.latitude},${position.coords.longitude}&radius=50000&key=AIzaSyB5dFqrJQ98JxYs3MtQNx1vatQgp8fp-6Q,
                        aItems = [];

                    fetch(query).then((response) => response.json())
                        .then((data) => {
                            var items = data.results,
                                key = 0;
                            console.log(data);
                            if (items) {
                                items.forEach((item) => {
                                    aItems.push({
                                        key: key++,
                                        name: item.name,
                                        address: item.formatted_address.replace(item.name + ",", ""),
                                        location: item.geometry.location
                                    });
                                });
                            }
                            this.setState({ items: aItems });
                        }).catch((error) => {
                            console.error(error);
                        });
                }).catch((error) => {
                    console.error(error);
                });
        });
    }
    show = () => {
        this.setState({ show: true });
        this.refs['TEXT'].focus();
        Animated.timing(
            this.state.container, {
                toValue: 0,
                duration: 1,
            }
        ).start();
        Animated.timing(
            this.state.top, {
                toValue: 0,
                duration: 300,
            }
        ).start();
        Animated.timing(
            this.state.resultTop, {
                toValue: 60,
                duration: 300,
            }
        ).start();
    }
    hide = () => {
        Animated.timing(
            this.state.container, {
                toValue: width,
                duration: 100,
            }
        ).start();
        Animated.timing(
            this.state.top, {
                toValue: INITIAL_TOP,
                duration: 300,
            }
        ).start();
        Animated.timing(
            this.state.resultTop, {
                toValue: height,
                duration: 300,
            }
        ).start();
        setTimeout(() => {
            this.setState({ show: false });
        }, 300);
    }
    back() {
        this.hide();
    }
    render() {
        const resizeMode = "stretch";
        return (
            this.show && <Animated.View style={[styles.container, {
                left: this.state.container
            }]}>
                {
                    this.show &&
                    <Animated.View style={[styles.header, {
                        top: this.state.top
                    }]}>
                        <View style={styles.buttonsLeft}>
                            <TouchableNativeFeedback onPress={() => this.back()}>
                                <Image
                                    style={{
                                        resizeMode,
                                        width: 22,
                                        height: 22
                                    }}
                                    source={require('../assets/icons/back.png')}
                                >
                                </Image>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={styles.center}>
                            <TextInput
                                ref={'TEXT'}
                                underlineColorAndroid={'transparent'}
                                returnKeyType={'search'}
                                style={{ flex: 1, width: '100%', borderColor: 'white', fontSize: 20 }}
                                onChangeText={this.searchChanged}
                                value={this.state.searhText}
                            />
                        </View>
                        <View style={styles.buttonsRight}>
                            <TouchableNativeFeedback onPress={() => this.clear()}>
                                <Image
                                    style={{
                                        resizeMode,
                                        width: 22,
                                        height: 22
                                    }}
                                    source={require('../assets/icons/delete.png')} >
                                </Image>
                            </TouchableNativeFeedback>
                        </View>
                    </Animated.View>
                }
                {
                    this.show &&
                    < Animated.View style={[styles.result, {
                        top: this.state.resultTop
                    }]}>
                        {this.state.items.length > 0 && <FlatList
                            style={{ borderRadius: 2, elevation: 1 }}
                            data={this.state.items}
                            renderItem={({ item }) => <TouchableNativeFeedback key={item.key} onPress={() => this.pickPlace(item)}>
                                <View style={styles.resultItem}>
                                    <View style={{ padding: 10, flex: 1 }}>
                                        <Icon name="map-marker" size={35} color="gray" />
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#e6e6e6', padding: 5, flex: 9 }}>
                                        <Text onPress={() => this.pickPlace(item)} numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 18, width: '100%' }} >{item.name}</Text>
                                        <Text numberOfLines={2} ellipsizeMode={'tail'} >{item.address}</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>}
                        />}
                    </Animated.View>
                }
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        height: '100%',
        width: '100%',
        elevation: 7,
        zIndex: 1001,
        position: 'absolute'
    },
    result: {
        height: PANEL_HEIGHT,
        width: '100%',
        left: 0,
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10
    },
    header: {
        position: 'absolute',
        backgroundColor: 'white',
        width: "100%",
        height: 60,
        elevation: 4,
        flexDirection: "row"
    },
    buttonsRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10
    },
    center: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontFamily: "ArialRoundBold"
    },
    resultItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        width: '100%'
    }
});



export default Search;