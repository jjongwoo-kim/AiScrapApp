const SCRAPS_KEY = "SCRAPS";

document.addEventListener("mouseup", function () {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
        hideButton();
        return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    let button = document.getElementById("highlight-btn");

    if (!button) {
        button = document.createElement("button");
        button.id = "highlight-btn";
        button.innerText = "하이라이트";
        document.body.appendChild(button);
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    button.style.position = "absolute";
    button.style.top = `${window.scrollY + rect.bottom + 5}px`;
    button.style.left = `${window.scrollX + rect.left}px`;
    button.style.display = "block";

    button.onclick = function () {
        const span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        span.textContent = selectedText;

        range.deleteContents();
        range.insertNode(span);

        saveText(selectedText);
        hideButton();
    };
});

// 버튼 숨기는 함수
function hideButton() {
    const button = document.getElementById("highlight-btn");
    if (button) button.style.display = "none";
}

function saveText(content) {
    const scrap = {
        content, // 선택된 텍스트
        date: new Date().toISOString(), // 현재 날짜
        url: window.location.href // 현재 페이지의 URL
    };
    chrome.storage.local.get({ SCRAPS: [] }, function (data) {
        const scraps = data.SCRAPS;
        scraps.push(scrap);

        chrome.storage.local.set({ SCRAPS: scraps }, function () {
            if (chrome.runtime.lastError) {
            } else {
                console.error("Storage error:", chrome.runtime.lastError);
                syncToLocalStorage(scraps);
            }
        });

        // 확장 프로그램이 비활성화된 경우를 대비해 try-catch 사용
        try {
            chrome.runtime.sendMessage({ action: "updatePanel" });
        } catch (error) {
            console.warn("Message error:", error);
        }
    });
}

// 크롬 스토리지를 localStorage에 동기화
function syncToLocalStorage(scraps) {
    try {
        localStorage.setItem(SCRAPS_KEY, JSON.stringify(scraps));
    } catch (error) {
        console.error("스크랩 동기화 에러: ", error);
    }
}

// 확장 프로그램이 로드될 때 localStorage 동기화
chrome.storage.local.get({ SCRAPS: [] }, function (data) {
    syncToLocalStorage(data.SCRAPS);
});
