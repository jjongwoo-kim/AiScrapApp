document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get({ SCRAPS: [] }, function (data) {
        const scrapList = document.getElementById("scrap-list");
        const scraps = data.SCRAPS;
        scrapList.innerHTML = "";

        scraps.forEach(scrap => {
            const li = document.createElement("li");
            li.className = "scrap-item";
            li.textContent = scrap.content;
            scrapList.appendChild(li);
        });
    });
});
