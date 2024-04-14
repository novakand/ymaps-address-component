export class CryptoAPILoader {

    constructor() {
        this.windowRef = window;
        this.documentRef = document;
        this._SCRIPT_ID = 'cryptScript';
        this._scriptLoading;
    }

    load() {
        if (this._scriptLoading) {
            return this._scriptLoading;
        }

        if (window.CryptoJS) {
            return Promise.resolve();
        }

        const scriptOnPage = this.documentRef.getElementById(this._SCRIPT_ID);
        if (scriptOnPage) {
            this._assignScriptLoading(scriptOnPage);
            return this._scriptLoading;
        }

        const script = this._createElementScript();
        script.src = this._getScriptSrc(this.config);
        this._assignScriptLoading(script);
        this.documentRef.head.appendChild(script);


        return this._scriptLoading;
    }

    _createElementScript() {
        const script = this.documentRef.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.id = this._SCRIPT_ID;
        return script;
    }

    _getScriptSrc() {
        return `https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js`;
    }

    _assignScriptLoading(scriptElem) {
        this._scriptLoading = new Promise((resolve, reject) => {
            scriptElem.onload = () => resolve(true);
            scriptElem.onerror = (error) => resolve(null);
        });
    }

}