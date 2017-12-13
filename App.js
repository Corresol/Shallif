import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { StackNavigator } from 'react-navigation';
import Home from './js/Home';
import Welcome from './js/Welcome';

const App = StackNavigator({
  Welcome: { screen: Welcome },
  Home: { screen: Home },
}, {
    initialRouteName: "Welcome",
    headerMode: "none"
  });


export default App;