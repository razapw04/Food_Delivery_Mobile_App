/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {setupFonts} from './src/theme/setupFonts';

setupFonts();

AppRegistry.registerComponent(appName, () => App);
