import React, { PropTypes } from 'react';
import { StyleSheet, Button, Text, View, Image, TouchableNativeFeedback, Geolocation, TouchableHighlight } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Search from './Search';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Switch from 'react-native-switch-pro';
import Checkbox from './Checkbox';

class Menu extends React.Component {
    static propTypes = {
        onVoiceChecked: PropTypes.func,
        onSFXChecked: PropTypes.func,
        onNotificationChecked: PropTypes.func,
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
            show: false,
            items: [],
            voiceWarning: false,
            SFXWarning: false,
            notificationWarning: true
        };
    }
    onVoiceWarningChange(checked) {
        this.setState({
            voiceWarning: checked
        })
        this.props.onVoiceChecked(checked);
    }
    onSFXWarningChange(checked) {
        this.setState({
            SFXWarning: checked
        })
        this.props.onSFXChecked(checked);
    }
    onNotificationWarningChange(checked) {
        this.setState({
            notificationWarning: checked
        })
        this.props.onNotificationChecked(checked);
    }
    render() {
        const resizeMode = "stretch";
        return (
            <View style={{ flex: 1, backgroundColor: '#494956', padding: 20 }}>
                <View style={[styles.settingItem, {
                    marginTop: 50
                }]}>
                    <Text style={styles.settingLabel} >Voice warning</Text>
                    <Switch style={{ marginTop: 15 }} backgroundActive={'#48c2ff'} height={30} width={60} value={this.state.voiceWarning} onSyncPress={(value) => this.onVoiceWarningChange(value)} />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel} >SFX</Text>
                    <Switch style={{ marginTop: 15 }} backgroundActive={'#48c2ff'} height={30} width={60} value={this.state.SFXWarning} onSyncPress={(value) => this.onSFXWarningChange(value)} />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel} >Notification Popup</Text>
                    <Switch style={{ marginTop: 15 }} backgroundActive={'#48c2ff'} height={30} width={60} value={this.state.notificationWarning} onSyncPress={(value) => this.onNotificationWarningChange(value)} />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLHeader} >Notifications:</Text>
                </View>
                <View style={styles.settingItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: 15, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'red' }}>
                            {/* <Icon2 name="shield" style={{ fontSize: 15, color: 'white' }} /> */}
                            <Image
                                style={{
                                    resizeMode,
                                    width: 20,
                                    height: 20
                                }}
                                source={require('../assets/icons/police.png')}
                            >
                            </Image>
                        </View>
                        <Text style={[styles.settingLabel, {
                            marginLeft: 15
                        }]} >Police cars</Text>
                    </View>
                    <Checkbox containerStyle={{ marginTop: 20 }} checked={false} />
                </View>
                <View style={styles.settingItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: 15, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'gray' }}>
                            {/* <Icon2 name="video-camera" style={{ fontSize: 15, color: 'white' }} /> */}
                            <Image
                                style={{
                                    resizeMode,
                                    width: 25,
                                    height: 20
                                }}
                                source={require('../assets/icons/camera.png')}
                            >
                            </Image>
                        </View>
                        <Text style={[styles.settingLabel, {
                            marginLeft: 15
                        }]} >Cameras</Text>
                    </View>
                    <Checkbox containerStyle={{ marginTop: 20 }} checked={true} />
                </View>
                <View style={styles.settingItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: 15, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: '#FBBC57' }}>
                            {/* <Icon name="md-car" style={{ fontSize: 15, color: 'white' }} /> */}
                            <Image
                                style={{
                                    resizeMode,
                                    width: 25,
                                    height: 20
                                }}
                                source={require('../assets/icons/private_camera.png')}
                            >
                            </Image>
                        </View>
                        <Text style={[styles.settingLabel, {
                            marginLeft: 15
                        }]} >Private cameras</Text>
                    </View>
                    <Checkbox containerStyle={{ marginTop: 20 }} checked={false} />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingLHeader} >Languages:</Text>
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel} >English</Text>
                    <Checkbox containerStyle={{ marginTop: 20 }} checked={true} />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel} >Arabic</Text>
                    <Checkbox containerStyle={{ marginTop: 20 }} checked={false} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    settingLabel: {
        fontSize: 22,
        fontFamily: "ArialRound",
        color: 'white',
        marginTop: 15
    },
    settingLHeader: {
        fontSize: 25,
        fontFamily: "ArialRoundBold",
        color: 'white',
        marginTop: 25
    }
});



export default Menu;