/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
import TrackPlayer from 'react-native-track-player';
import {name as appName} from './app.json';
import './src/i18n';
import Main from './src/main';

enableScreens();

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => require('./src/service'));
