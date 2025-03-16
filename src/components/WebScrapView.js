import React, { useEffect, useState } from 'react';
import { Alert } from 'react';

const WebScrapView = ({ url, onScrap }) => {
  const [selectedText, setSelectedText] = useState('');

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

  // 'handleTextScrap'를 useEffect 내부에 포함시키는 방법
  useEffect(() => {
    const handleTextScrap = async (data) => {
      try {
        const scrap = {
          url: data.url,
          content: data.selectedText,
          date: new Date().toISOString(),
        };

        // localStorage를 사용해 웹에서 스크랩 저장
        let scraps = JSON.parse(localStorage.getItem('SCRAPS')) || [];
        scraps.push(scrap);
        localStorage.setItem('SCRAPS', JSON.stringify(scraps));

        // 필요하다면 onScrap 콜백 호출 (부가 처리)
        if (onScrap) {
          onScrap(scrap);
        }
        Alert.alert('스크랩 저장됨', `내용: ${data.selectedText}`);
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    };

    window.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.selectedText && data.url) {
          handleTextScrap(data);
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    });

    return () => {
      window.removeEventListener('message', handleTextScrap);
    };
  }, [onScrap]);  // 의존성 배열에 onScrap을 포함

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        title="WebScrapView"
        frameBorder="0"
        onLoad={(event) => {
          const iframe = event.target;
          iframe.contentWindow.postMessage(injectedJS, '*');
        }}
      />
    </div>
  );
};

export default WebScrapView;
