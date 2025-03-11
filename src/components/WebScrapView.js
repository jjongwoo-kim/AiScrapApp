import React from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WebScrapView = ({ url, onScrap }) => {
  // 페이지에 주입할 JavaScript 코드: 선택한 텍스트와 페이지 URL을 전달
  const injectedJS = `
    (function() {
      // 마우스 업 이벤트 또는 터치 끝 이벤트에 반응
      document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString();
        const pageUrl = window.location.href;
        if (selectedText.length > 0) {
        console.log('mouseup 시작?')
          window.ReactNativeWebView.postMessage(JSON.stringify({
            selectedText: selectedText,
            url: pageUrl
          }));
        }
      });
      // 터치 기반 디바이스용 (추가)
      document.addEventListener('touchend', function() {
        const selectedText = window.getSelection().toString();
        const pageUrl = window.location.href;
        if (selectedText.length > 0) {
        console.log('touchend 시작?')
          window.ReactNativeWebView.postMessage(JSON.stringify({
            selectedText: selectedText,
            url: pageUrl
          }));
        }
      });
    })();
    true;
  `;

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.selectedText && data.url) {
        // 예시: AsyncStorage에 스크랩 데이터를 저장
        const scrap = {
          url: data.url,
          content: data.selectedText,
          date: new Date().toISOString(),
        };
        // 여러 스크랩을 저장하려면 기존 데이터를 가져와서 추가하는 방식으로 처리할 수 있음
        let scraps = await AsyncStorage.getItem('SCRAPS');
        scraps = scraps ? JSON.parse(scraps) : [];
        scraps.push(scrap);
        await AsyncStorage.setItem('SCRAPS', JSON.stringify(scraps));

        // 필요하다면 onScrap 콜백 호출 (부가 처리)
        if (onScrap) {
          onScrap(scrap);
        }
        Alert.alert('스크랩 저장됨', `내용: ${data.selectedText}`);
      }
    } catch (error) {
      console.error('메시지 처리 오류:', error);
    }
  };

  return (
    <WebView
      source={{ uri: url }}
      injectedJavaScript={injectedJS}
      onMessage={handleMessage}
      style={{ flex: 1 }}
    />
  );
};

export default WebScrapView;
