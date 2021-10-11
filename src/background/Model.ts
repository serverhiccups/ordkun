export interface AnkiModel {
    name: string;
    fields: string[];
}

export interface Model {
    wordSelected: boolean;
    keyInput: string;
    keySuggestions: Array<string>;
    translationInput: string;
    anki: {
        selected: {
            deck: string;
            model: string;
            front: string;
            back: string;
        }
        decks: string[];
        models: AnkiModel[];
    }
}