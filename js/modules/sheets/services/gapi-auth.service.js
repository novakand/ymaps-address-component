import { JsenCryptAPILoader } from './jsen-crypt-api.loader.js';
import { CryptoAPILoader } from './crypto-api-loader.js';
import { gapiAuthConfig } from '../constants/gapi-auth-config.js';

export class GapiAuthService {

    constructor() {
        this._jsenLoader = new JsenCryptAPILoader();
        this._cryptoLoader = new CryptoAPILoader();
        this.onInit();
    }

    async onInit() {
        this._importLib();
        this._onLoadClient();
    }

    async _onInitGapiClient() {

        await gapi.client.init({
            apiKey: gapiAuthConfig.apiKey,
            discoveryDocs: gapiAuthConfig.discoveryDocs,

        });
        this.token = await this._getAuthToken();

        gapi.client.setToken(this.token);
    }

    _getAuthToken() {
        const header = { alg: "RS256", typ: "JWT" };
        const now = Math.floor(Date.now() / 1000);
        const claim = {
            iss: gapiAuthConfig.clientEmail,
            scope: gapiAuthConfig.scopes.join(" "),
            aud: gapiAuthConfig.url,
            exp: (now + 3600).toString(),
            iat: now.toString(),
        };
        const signature =
            btoa(JSON.stringify(header)) + "." + btoa(JSON.stringify(claim));
        const sign = new JSEncrypt();
        sign.setPrivateKey(gapiAuthConfig.privateKey);
        const jwt =
            signature + "." + sign.sign(signature, CryptoJS.SHA256, "sha256");
        const params = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                assertion: jwt,
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            }),
        };

        const obj = fetch(gapiAuthConfig.url, params)
            .then((res) => res.json())
            .catch((err) => console.log(err));

        return obj;
    }

    async _importLib() {
        await this._jsenLoader.load();
        await this._cryptoLoader.load();
    }

    async _onLoadClient() {
        gapi.load('client', await this._onInitGapiClient.bind(this));
    }

}