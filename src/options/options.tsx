import browser from "webextension-polyfill";

import m from "mithril";

import { OptionsController } from "./OptionsController";

class App {
    controller: OptionsController;

    constructor() {
        this.controller = new OptionsController();
    }

    view() {
        if(!this.controller?.model?.anki) return (
            <div id="app"></div>
        )
        return (
            <div id="app">
                <h2>Ordkun Options</h2>
                <div id="anki">
                    <h3>Anki</h3>
                    <label for="deck">Deck:</label>
                    <select name="deck" id="deck-select" oninput={(e) => {
                        this.controller.deckUpdated(e.target.value);
                    }} value={this.controller.model.anki.selected.deck}>
                        {this.controller.model.anki.decks.map((d) => {
                            return (
                                <option value={d}>{d}</option>
                            )
                        })}
                    </select>
                    <label for="model">Model:</label>
                    <select name="model" id="model-select" oninput={(e) => {
                        this.controller.modelUpdated(e.target.value);
                    }} value={this.controller.model.anki.selected.model}>
                        {this.controller.model.anki.models.map(m => m.name).map((i) => {
                            return (
                                <option value={i}>{i}</option>
                            )
                        })}
                    </select>
                    <label for="front">Front:</label>
                    <select name="front" id="front-select" oninput={(e) => {
                        this.controller.frontUpdated(e.target.value);
                    }} value={this.controller.model.anki.selected.front}>
                        {console.log("selected front: " + this.controller.model.anki.selected.front)}
                        {console.log("indexOf: " + this.controller.model.anki.models.map(m => m.name).indexOf(this.controller.model.anki.selected.model))}
                        {this.controller.model.anki.models[this.controller.model.anki.models.map(m => m.name).indexOf(this.controller.model.anki.selected.model)].fields.map((f) => {
                            return (
                                <option key={"front" + f} value={f}>{f}</option>
                            )
                        })}
                    </select>
                    <label for="back">Back:</label>
                    <select name="back" id="back-select" oninput={(e) => {
                        this.controller.backUpdated(e.target.value);
                    }} value={this.controller.model.anki.selected.back}>
                        {console.log("selected back: " + this.controller.model.anki.selected.back)}
                        {console.log("indexOf: " + this.controller.model.anki.models.map(m => m.name).indexOf(this.controller.model.anki.selected.model))}
                        {this.controller.model.anki.models[this.controller.model.anki.models.map(m => m.name).indexOf(this.controller.model.anki.selected.model)].fields.map((f) => {
                            return (
                                <option key={"back" + f}value={f}>{f}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        )
    }
}

let a = new App();

m.mount(document.body, a);