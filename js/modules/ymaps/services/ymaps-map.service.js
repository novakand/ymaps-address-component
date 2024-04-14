import { YMapsAPILoader } from './ymaps-api-loader.js';

export class YMapsMapService {

    constructor(htmlElement, options) {
        this._options = options || {}
        this.loader = new YMapsAPILoader(this._options.config);
        this.ready = this._apiLoader(htmlElement, this._options);
    }

    async destroy() {
        const map = await this._maps;
        map.destroy();
        document.getElementById('ymapsScript').remove();
        ymaps = null;
    }

    _apiLoader(htmlElement, options) {
        return new Promise((resolve, reject) => {
            this.loader.load().then(() => {
                this._maps = this._createMap(htmlElement, options);
                this._setBackgroundContainerMap();
                resolve(this._maps);
            }).catch((error) => error);
        });
    }

    _createMap(htmlElement, options) {
        return new Promise((resolve, reject) => {
            resolve(this._createOptions(htmlElement, options));
        }).catch((error) => error && new Error(error));
    }

    _createOptions(htmlElement, options) {
        return new ymaps.Map(htmlElement, { ...options.state }, {
            ...options.options, yandexMapDisablePoiInteractivity: true,
            restrictMapArea: [[-83.8, -170.8], [83.8, 170.8]],
            suppressMapOpenBlock: true,
        });
    }

    async _setBackgroundContainerMap() {
        const { container } = await this._maps;
        container.getElement().style.background = '#fff';
    }
}