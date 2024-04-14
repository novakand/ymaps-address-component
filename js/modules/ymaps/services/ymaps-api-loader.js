export class YMapsAPILoader {

    constructor(config) {

        this.windowRef = window;
        this.documentRef = document;
        this._SCRIPT_ID = 'ymapsScript';
        this._scriptLoading;
        this.config = config || {};
    }

    load() {
        if (this._scriptLoading) {
            return this._scriptLoading;
        }

        if (window.ymaps) {
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

    _getScriptSrc(config) {
        const { enterprise, version = '2.1', ...rest } = config;
        const params = this._getParams(rest);
        return `https://${enterprise ? 'enterprise.' : ''}api-maps.yandex.ru/${version}/?${params}`;
    }

    _getParams(config) {
        return Object.entries(config)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    }

    _assignScriptLoading(scriptElem) {
        this._scriptLoading = new Promise((resolve, reject) => {
            scriptElem.onload = () => ymaps.ready(() => resolve());
            scriptElem.onerror = (error) => console.log(error);
        });
    }
}