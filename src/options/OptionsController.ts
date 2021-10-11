import browser from "webextension-polyfill";

import m from "mithril";

import { Model } from "../background/Model";
import { MessageTypes } from "../background/MessageTypes";

export class OptionsController {
    model: Model;
    port: browser.Runtime.Port;

    constructor() {
        this.port = browser.runtime.connect({name: "options"})
        this.port.onDisconnect.addListener((message) => {
        })
        this.port.onMessage.addListener((message) => {
            this.onMessage(message);
        })
    }

    private onMessage(message) {
        if(message.type == MessageTypes.UPDATE_MODEL) {
            this.model = message.content;
            m.redraw();
            return;
        }
    }

    private sendMessage(type: MessageTypes, content: any) {
        this.port.postMessage({type: type, content: content});
    }

    deckUpdated(deck: string) {
        this.sendMessage(MessageTypes.CARD_DESTINATION_UPDATED, {...this.model.anki.selected, deck});
    }

    modelUpdated(model: string) {
        this.sendMessage(MessageTypes.CARD_DESTINATION_UPDATED, {...this.model.anki.selected, model});
    }

    frontUpdated(front: string) {
        this.sendMessage(MessageTypes.CARD_DESTINATION_UPDATED, {...this.model.anki.selected, front});
    }

    backUpdated(back: string) {
        this.sendMessage(MessageTypes.CARD_DESTINATION_UPDATED, {...this.model.anki.selected, back});
    }
}