import { AppRegistry, DeviceEventEmitter } from 'react-native';
import App from './public/App.js';
import { name as appName } from './app.json';

// 'react-native-web'을 이용해 웹에서 사용
import { Platform } from 'react-native';

// 가장 최상위에서 전역 구독을 설정
DeviceEventEmitter.addListener('onShareReceived', (sharedText) => {
  console.log('글로벌 onShareReceived 이벤트:', sharedText);
});

if (Platform.OS === 'web') {
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
} else {
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}