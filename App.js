import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ScrapListScreen from './src/screens/ScrapListScreen';

const Stack = createNativeStackNavigator();

export default function App(props) {
  // native에서 전달된 초기 프로퍼티가 여기에 들어옵니다.
  const initialParams = props || {};

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={initialParams}  // 여기서 초기 파라미터를 전달
          options={{ title: '웹 스크랩' }}
        />
        <Stack.Screen
          name="Scraps"
          component={ScrapListScreen}
          options={{ title: '스크랩 목록' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
