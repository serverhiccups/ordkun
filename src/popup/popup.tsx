import browser from "webextension-polyfill";
import m from "mithril";

import { PopupController } from "./PopupController";

class App {
    controller: PopupController

    constructor() {
        this.controller = new PopupController();
    }

    view() {
        if(!this.controller?.model?.wordSelected) {
            return (
                <div id="app">
                    <div id="not-selected">
                        <h3>There is not currently a word selected</h3>
                        <p>Try opening Refolk! and selecting one.</p>
                    </div>
                </div>
            )
        }
        return (
            <div id="app">
                <div id="add">
                    <div id="info-bar">
                        <span>Add to Anki with Ordkun</span>
                    </div>
                    <div id="key-term">
                        <label for="term" id="key-term-description">Term:</label>
                        <input type="text" name="term" value={this.controller.model.keyInput} oninput={(e) => {
                            this.controller.updateKeyTerm(e.target.value);
                        }}></input>
                        <div id="key-term-suggestions">
                            {this.controller.model.keySuggestions.map((s) => {
                                return (
                                    <div class="suggestion">{s}</div>
                                )
                            })}
                        </div>
                    </div>
                    <div id="translation">
                        <label for="translation" id="translation-description">Translation:</label>
                        <input type="text" name="translation" value={this.controller.model.translationInput}></input>
                    </div>
                    <button onclick={() => {
                        this.controller.addCard();
                        window.close();
                    }}>Add</button>
                </div>
            </div>
        )
    }
}

let a = new App();

m.mount(document.body, a)