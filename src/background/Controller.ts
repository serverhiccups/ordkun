import browser from "webextension-polyfill";

import { Model } from "./Model";
import { MessageTypes } from "./MessageTypes";

export class Controller {
    model: Model;
    ports: Map<string, browser.Runtime.Port>;

    constructor() {
        this.ports = new Map();

        browser.runtime.onConnect.addListener((port) => {
            this.ports.set(port.sender.url, port);
            port.onDisconnect.addListener(() => {
                this.ports.set(port.sender.url, undefined);
            })
            port.onMessage.addListener((message) => {
                this.onMessage(message);
            })
            port.postMessage({type: MessageTypes.UPDATE_POPUP, content: this.model});
        })

        this.resetModel();
    }

    private onMessage(message : {type: MessageTypes, content: any}) {
        switch(message.type) {
            case MessageTypes.SEND_WORD:
                this.send();
                break;
            case MessageTypes.KEY_TERM_TYPED:
                this.model.keyInput = message.content;
                this.updatePopups();
                break;
            case MessageTypes.TRANSLATION_TYPED:
                this.model.translationInput = message.content;
                this.updatePopups();
                break;
        }
    }

    private sendToPopups(type: MessageTypes, content: any) {
        this.ports.forEach((p) => {
            p.postMessage({type: type, content: content});
        })
    }

    private updatePopups() {
        this.sendToPopups(MessageTypes.UPDATE_POPUP, this.model);
    }

    private resetModel() {
        this.model = {
            wordSelected: false,
            keyInput: "",
            keySuggestions: [],
            translationInput: ""
        }
        this.updatePopups();
    }

    setWord(word: any) {
        this.model.keyInput = word.key;
        this.model.keySuggestions = ["bloo bloo", "blah blah"]
        this.model.translationInput = "fart"
        this.model.wordSelected = true;
        this.updatePopups();
        browser.browserAction.openPopup();
    }

    send() {
        //TODO(serverhiccups): implement sending logic
        this.resetModel();
    }
}