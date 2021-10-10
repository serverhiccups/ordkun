import  browser from "webextension-polyfill";

import { Controller } from "./Controller";
import { MessageTypes } from "./MessageTypes"

let c = new Controller();

browser.runtime.onMessage.addListener(async (message, sender) => { // Receive messages from the content script
    // TODO(severhiccups): Verify that the message came from a page that we want to accept messages from
    // if(sender?.url != )
    if(message.__parcel_hmr_reload__ !== undefined) return;
    console.log("hello from the extension!: ");
    console.dir(message);
    c.setWord(message);
    // sendToPopups(MessageTypes.UPDATE_CONTENT, c.model);
    return ""
})