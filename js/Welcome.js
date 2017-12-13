import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, TouchableHighlight, StatusBar } from 'react-native';
import Button from 'react-native-button';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export default class Welcome extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    }
    state = {
        english: true,
        arabic: false
    }
    goHome() {
        var string = "something";
    }
    changeLanguage() {

    }
    render() {
        const resizeMode = 'cover';
        const buttonText = "Shallif  !";
        const radio_props = [
            { label: 'English', value: 0, selected: true },
            { label: 'Arabic', value: 1, selected: false }
        ];
        const { navigate } = this.props.navigation;
        return (
            <View
                style={styles.container}>
                <Image
                    style={{
                        resizeMode,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    source={require('../assets/image/welcome.png')} >
                </Image>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}>
                    <View style={{ flex: 2, backgroundColor: 'transparent' }}>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                        <RadioForm formHorizontal={true} animation={true}>
                            <RadioButton labelHorizontal={true} key={0} >
                                <RadioButtonInput
                                    obj={radio_props[0]}
                                    index={0}
                                    isSelected={this.state.english}
                                    onPress={() => this.setState({ arabic: this.state.english, english: !this.state.english })}
                                    borderWidth={0}
                                    buttonInnerColor={'#27a022'}
                                    buttonOuterColor={'white'}
                                    buttonSize={16}
                                    buttonOuterSize={22}
                                    buttonStyle={{ backgroundColor: 'white' }}
                                    buttonWrapStyle={{ marginLeft: 10 }}
                                />
                                <RadioButtonLabel
                                    obj={radio_props[0]}
                                    index={0}
                                    labelHorizontal={true}
                                    onPress={this.changeLanguage}
                                    labelStyle={{ fontSize: 20, color: 'white', fontFamily: "arial_round" }}
                                    labelWrapStyle={{}}
                                />
                            </RadioButton>
                            <RadioButton labelHorizontal={true} key={1} >
                                <RadioButtonInput
                                    obj={radio_props[1]}
                                    index={1}
                                    isSelected={this.state.arabic}
                                    onPress={() => this.setState({ arabic: !this.state.arabic, english: this.state.arabic })}
                                    borderWidth={0}
                                    buttonInnerColor={'#27a022'}
                                    buttonOuterColor={'white'}
                                    buttonSize={16}
                                    buttonOuterSize={22}
                                    buttonStyle={{ backgroundColor: 'white' }}
                                    buttonWrapStyle={{ marginLeft: 30 }}
                                />
                                <RadioButtonLabel
                                    obj={radio_props[1]}
                                    index={1}
                                    labelHorizontal={true}
                                    onPress={this.changeLanguage}
                                    labelStyle={{ fontSize: 20, color: 'white', fontFamily: "ArialRound" }}
                                    labelWrapStyle={{}}
                                />
                            </RadioButton>
                        </RadioForm>
                        <TouchableNativeFeedback onPress={() => navigate('Home')}>
                            <View style={{ height: 50, width: 150, backgroundColor: '#27a022', borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 25, fontFamily: "ArialRoundBold" }}>Shallif !</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});