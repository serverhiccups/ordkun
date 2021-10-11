import  browser from "webextension-polyfill";

import { Controller } from "./Controller";

let c = new Controller();
c.init().then(_ => {
    browser.runtime.onMessage.addListener(async (message, sender) => { // Receive messages from the content script
        // TODO(severhiccups): Verify that the message came from a page that we want to accept messages from
        // if(sender?.url != )
        if(message.__parcel_hmr_reload__ !== undefined) return;
        c.setWord(message);
        // sendToPopups(MessageTypes.UPDATE_CONTENT, c.model);
        return ""
    })
});