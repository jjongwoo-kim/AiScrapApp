import React from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WebScrapView = ({ url, onScrap }) => {
  // 페이지에 주입할 JavaScript 코드: 선택한 텍스트와 페이지 URL을 전달
 const injectedJS = `
     (function() {
       let highlightButton = null;

       document.addEventListener('selectionchange', function () {
           setTimeout(() => {
               const selection = window.getSelection();
               if (!selection.rangeCount || selection.toString().trim() === '') {
                   removeHighlightButton();
                   return;
               }

               const range = selection.getRangeAt(0);
               const rect = range.getBoundingClientRect();

               showHighlightButton(rect);
           }, 100);
       });

       function showHighlightButton(rect) {
           removeHighlightButton();

           highlightButton = document.createElement('button');
           highlightButton.style.position = 'absolute';
           highlightButton.style.left = (window.scrollX + rect.left) + 'px';
           highlightButton.style.top = (window.scrollY + rect.bottom + 10) + 'px';
           highlightButton.style.padding = '10px';
           highlightButton.style.fontSize = '14px';
           highlightButton.style.backgroundColor = 'yellow';
           highlightButton.style.color = 'black';
           highlightButton.style.border = '1px solid black';
           highlightButton.style.borderRadius = '5px';
           highlightButton.style.cursor = 'pointer';
           highlightButton.style.zIndex = '99999';

           highlightButton.onclick = function() {
               saveText();
               applyHighlight();
               removeHighlightButton();
           };

           document.body.appendChild(highlightButton);
       }

       function removeHighlightButton() {
           if (highlightButton) {
               highlightButton.remove();
               highlightButton = null;
           }
       }

       function applyHighlight() {
           const selection = window.getSelection();
           if (!selection.rangeCount) return;

           const range = selection.getRangeAt(0);
           const span = document.createElement('span');
           span.style.backgroundColor = 'yellow';
           span.appendChild(range.extractContents());

           range.deleteContents();
           range.insertNode(span);

           selection.removeAllRanges();
       }

       function saveText() {
           const selectedText = window.getSelection().toString();
           const pageUrl = window.location.href;
           if (selectedText.length > 0) {
               window.ReactNativeWebView.postMessage(JSON.stringify({
                   selectedText: selectedText,
                   url: pageUrl
               }));
           }
       }
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
      injectedJavaScriptForMainFrameOnly={false}
      style={{ flex: 1 }}
    />
  );
};

export default WebScrapView;
