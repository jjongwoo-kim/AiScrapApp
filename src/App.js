import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ScrapListScreen from './screens/ScrapListScreen';

const Stack = createNativeStackNavigator();

export default function App(props) {
    const initialParams = props || {};
    const initialRouteName = initialParams.sharedContent ? 'Home' : 'Scraps';

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    initialParams={initialParams}  // 초기 파라미터 전달
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
