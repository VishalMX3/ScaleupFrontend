/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs();
// console.log(test)
//test2
AppRegistry.registerComponent(appName, () => App);
