chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "updatePanel") {
        updateScrapList();
    }
});

// 저장된 스크랩 목록을 불러와서 패널을 업데이트하는 함수
function updateScrapList() {
    chrome.storage.local.get({ SCRAPS: [] }, function (data) {
        const scraps = data.SCRAPS;

        // 패널에서 scrap 목록을 갱신할 수 있는 코드
        // 예시: 패널에 데이터를 업데이트하는 메시지를 보낼 수도 있습니다.
        chrome.runtime.sendMessage({ action: "renderScrapList", scraps: scraps });
    });
}
