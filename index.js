import { AppRegistry, DeviceEventEmitter } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 가장 최상위에서 전역 구독을 설정
DeviceEventEmitter.addListener('onShareReceived', (sharedText) => {
  console.log('글로벌 onShareReceived 이벤트:', sharedText);
});

AppRegistry.registerComponent(appName, () => App);
