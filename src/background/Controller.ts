import browser from "webextension-polyfill";

import { Model } from "./Model";
import { MessageTypes } from "./MessageTypes";

import { Anki } from "../Anki";

export class Controller {
    model: Model;
    ports: Map<string, browser.Runtime.Port>;
    anki: Anki;

    constructor() {
    }
    
    async init() {
        this.ports = new Map();

        browser.runtime.onConnect.addListener((port) => {
            this.ports.set(port.sender.url, port);
            port.onDisconnect.addListener(() => {
                this.ports.delete(port.sender.url);
            })
            port.onMessage.addListener((message) => {
                this.onMessage(message);
            })
            port.postMessage({type: MessageTypes.UPDATE_MODEL, content: this.model});
        })

        this.resetModel();

        this.anki = new Anki("127.0.0.1");

        this.model.anki.decks = await this.anki.getDecks();
        this.model.anki.models = await Promise.all((await this.anki.getModels()).map(async (modelName: string) => {
            return {
                name: modelName,
                fields: await this.anki.getModelFieldNames(modelName)
            }
        }));

        if(!(await browser.storage.local.get(["ordkunAnkiSelected"]))["ordkunAnkiSelected"]) {
            await browser.storage.local.set({ordkunAnkiSelected: {
                deck: this.model.anki.decks[0],
                model: this.model.anki.models[0].name,
                front: this.model.anki.models[0].fields[0],
                back: this.model.anki.models[0].fields[1]
            }})
        }
        let v = this.validateAnkiSelected((await browser.storage.local.get("ordkunAnkiSelected"))["ordkunAnkiSelected"]);
        await browser.storage.local.set({ordkunAnkiSelected: v});
        this.model.anki.selected = (await browser.storage.local.get("ordkunAnkiSelected"))["ordkunAnkiSelected"];
    }

    private validateAnkiSelected(s) {
        // let s = await browser.storage.local.get("ordkunAnkiSelected")["ordkunAnkiSelected"];
        if(!this.model.anki.decks.includes(s.deck)) s.deck = this.model.anki.decks[0];
        if(!this.model.anki.models.map(m => m.name).includes(s.model)) s.model = this.model.anki.models[0].name;
        let modelIdx = this.model.anki.models.map(m => m.name).indexOf(s.model);
        if(!this.model.anki.models[modelIdx].fields.includes(s.front)) s.front = this.model.anki.models[modelIdx].fields[0];
        if(!this.model.anki.models[modelIdx].fields.includes(s.back)) s.back = this.model.anki.models[modelIdx].fields[1];
        console.log("validated")
        console.dir(s);
        return s;
    }

    private onMessage(message: {type: MessageTypes, content: any}) {
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
            case MessageTypes.CARD_DESTINATION_UPDATED:
                this.model.anki.selected = this.validateAnkiSelected(message.content);
                browser.storage.local.set({ordkunAnkiSelected: this.model.anki.selected});
                this.updatePopups();
                break;
        }
    }

    private sendToPopups(type: MessageTypes, content: any) {
        this.ports.forEach((p, k) => {
            p.postMessage({type: type, content: content});
        })
    }

    private updatePopups() {
        this.sendToPopups(MessageTypes.UPDATE_MODEL, this.model);
    }

    private resetModel() {
        this.model = {
            wordSelected: false,
            keyInput: "",
            keySuggestions: [],
            translationInput: "",
            anki: {
                selected: {
                    deck: "",
                    model: "",
                    front: "",
                    back: ""
                },
                decks: [],
                models: []
            }
        }
        this.updatePopups();
    }

    setWord(word: any) {
        this.model.keyInput = word.key;
        this.model.keySuggestions = ["bloo bloo", "blah blah"]
        this.model.translationInput = "fart"
        this.model.wordSelected = true;
        this.updatePopups();
    }

    send() {
        //TODO(serverhiccups): implement sending logic
        this.resetModel();
    }
}