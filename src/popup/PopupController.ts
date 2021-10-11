import browser from "webextension-polyfill";
import m from "mithril";

import { Model } from "../background/Model"
import { MessageTypes } from "../background/MessageTypes";

export class PopupController {
    port: browser.Runtime.Port;
    model: Model;

    constructor() {
        this.port = browser.runtime.connect({name: "popup"});
        this.port.onDisconnect.addListener(() => { // Do something with this?

        })
        this.port.onMessage.addListener((message) => {
            if(message.type == MessageTypes.UPDATE_MODEL) {
                this.model = message.content;
                m.redraw();
            }
        })
    }

    private sendMessage(type: MessageTypes, content: any) {
        this.port.postMessage({type: type, content: content});
    }

    addCard() {
        this.sendMessage(MessageTypes.SEND_WORD, null);
    }

    updateKeyTerm(term) {
        this.sendMessage(MessageTypes.KEY_TERM_TYPED, term);
    }

    updateTranslation(term) {
        this.sendMessage(MessageTypes.TRANSLATION_TYPED, term);
    }
}