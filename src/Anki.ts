interface NoteMedia {
    data?: any;
    path?: string;
    url?: string;
    filname: string;
    fields: string[];
    skipHash?: string;
}

export interface Note {
    deckName: string;
    modelName: string;
    fields: Object;
    options?: {
        allowDuplicate?: boolean,
        duplicateScope?: string,
        duplicateScopeOptions?: {
            deckName: string,
            checkChildren: boolean,
            checkAllModels: false
        }
    }
    tags?: string[];
    audio?: NoteMedia | NoteMedia[];
    video?: NoteMedia | NoteMedia[];
    picture?: NoteMedia | NoteMedia[];
}

export class Anki {
    host: string;
    port: number;
    key: string | undefined;

    constructor(host: string, key?: string, port: number = 8765) {
        this.host = host;
        this.port = port;
        this.key = key;
    }

    private async sendRequest(action: string, params?: object) {
        try {
            let body = {
                key: this.key,
                version: 6,
                action,
                params
            }
            let req = await fetch(`http://${this.host}:${this.port}`, {
                method: "POST",
                body: JSON.stringify(body)
            });
            if(req.status != 200) throw new Error("AnkiConnect returned a non-200 response");
            let json = await req.json();
            if(json.error != null) throw new Error("AnkiConnect Error: " + json.error);
            return json.result;
        } catch (e) {
            throw e;
        }
    }

    /* Decks */
    getDecksWithIds() {
        return this.sendRequest("deckNamesAndIds");
    }

    getDecks(): Promise<string[]> {
        return this.sendRequest("deckNames");
    }

    /* Models */
    getModelsWithIds() {
        return this.sendRequest("modelNamesAndIds");
    }

    getModels(): Promise<string[]> {
        return this.sendRequest("modelNames");
    }

    getModelFieldNames(name: string): Promise<string[]> {
        return this.sendRequest("modelFieldNames", {
            modelName: name
        })
    }

    /* Notes */
    addNotes(note: Note) {
        return this.sendRequest("addNote", note);
    }
}