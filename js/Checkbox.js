import React, { PropTypes } from 'react';
import { StyleSheet, Button, Text, Animated, Platform, TextInput, View, Image, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


class Checkbox extends React.Component {
    static propTypes = {
        checked: PropTypes.bool,
        onChecked: PropTypes.func,
        containerStyle: PropTypes.object
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
            checked: props.checked ? true : false,
            size: props.checked ? new Animated.Value(22) : new Animated.Value(0)
        };
    }
    onChecked() {
        if (this.state.checked) {
            Animated.spring(
                this.state.size, {
                    toValue: 0
                }
            ).start();
        } else {
            Animated.spring(
                this.state.size, {
                    toValue: 22
                }
            ).start();
        }
        this.setState({ checked: !this.state.checked });
    }
    render() {
        return (
            <TouchableNativeFeedback style={{ width: 30, heigt: 30 }} onPress={() => this.onChecked()}>
                <View style={[styles.container, this.props.containerStyle]}>
                    <Animated.View style={
                        [styles.inner, {
                            height: this.state.size,
                            width: this.state.size
                        }]
                    } >
                    </Animated.View>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 22,
        width: 22,
        backgroundColor: "white",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    inner: {
        backgroundColor: "#48c2ff",
        borderRadius: 7,
    }
});



export default Checkbox;