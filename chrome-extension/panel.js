const SCRAPS_KEY = "SCRAPS";
const scrapList = document.getElementById("scrap-list");

// 스크랩 목록 로드 함수
function loadScraps(scraps) {
    scrapList.innerHTML = ""; // 기존 목록 초기화

    scraps.forEach((scrap, index) => {
        const li = document.createElement("li");
        li.className = "scrap-item";
        li.innerHTML = `
            <span>${scrap.content}</span>
            <button class="delete-btn" data-index="${index}">삭제</button>
        `;
        scrapList.appendChild(li);
    });

    // 삭제 버튼에 이벤트 추가
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const index = parseInt(this.dataset.index, 10);
            deleteScrap(index);
        });
    });
}

// 삭제 함수
function deleteScrap(index) {
    chrome.storage.local.get({ SCRAPS: [] }, function (data) {
        let scraps = data.SCRAPS;
        scraps.splice(index, 1); // 선택한 스크랩 삭제

        chrome.storage.local.set({ SCRAPS: scraps }, function () {
            syncToLocalStorage(scraps); // localStorage 동기화
            loadScraps(scraps); // UI 갱신
        });
    });
}

// localStorage 동기화
function syncToLocalStorage(scraps) {
    try {
        localStorage.setItem(SCRAPS_KEY, JSON.stringify(scraps));
    } catch (error) {
        console.error("localStorage 동기화 에러:", error);
    }
}

// 메시지 수신 시 데이터 갱신
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "renderScrapList") {
        loadScraps(message.scraps); // 새로운 데이터로 목록 갱신
    }
});

// 확장 프로그램이 실행될 때 스크랩 로드
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get({ SCRAPS: [] }, function (data) {
        loadScraps(data.SCRAPS); // 초기 데이터 로드
    });
});
