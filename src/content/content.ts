import browser from "webextension-polyfill";

console.log("hello from content script!")

window.addEventListener("message", (e) => {
    if(e.source != window) return;

    if(e?.data?.type == "FROM_PAGE") {
        console.dir(e.data.message);
        try {
            browser.runtime.sendMessage(e.data.message);
        } catch (e) {
            throw e;
        }
    }
})