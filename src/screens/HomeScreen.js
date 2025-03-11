import React from 'react';
import { View, Button } from 'react-native';
import WebScrapView from '../components/WebScrapView';

const HomeScreen = ({ navigation, route }) => {
  // initialParams로 전달된 url 값이 여기서 사용됩니다.
  console.log('받은 URL:', route);
  const defaultUrl = route.params?.sharedUrl || 'https://www.example.com';


  const handleScrap = (scrapedData) => {
    console.log('스크랩된 데이터: ', scrapedData);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebScrapView url={defaultUrl} onScrap={handleScrap} />
      <Button title="스크랩 목록 보기" onPress={() => navigation.navigate('Scraps')} />
    </View>
  );
};

export default HomeScreen;
