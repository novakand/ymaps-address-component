
import { default as uId } from "../../../../constants/unique-number.constants.js";
import { ymapsAddressType } from "../../../../constants/address-type.constant.js";
export class YmapsGeoJSONView {

    constructor(data, options) {
        this._data = data;
        this._options = options || {};
    }

    toJSON() {
        return this._data;
    }

    getDetailsAddress(geoObject) {
        return new Promise((resolve, reject) => {
            const components = geoObject.properties.get('metaDataProperty').GeocoderMetaData?.Address?.Components;
            if (!components) return null;

            const locality = this.getKind(components, ymapsAddressType.locality) || '';
            const locality2 = this.getKind(components, ymapsAddressType.province, 1) || '';
            const house = this.getKind(components, ymapsAddressType.house) || '';
            const district = this.getKind(components, ymapsAddressType.district) || '';
            const district2 = this.getKind(components, ymapsAddressType.district, 1);
            const district3 = this.getKind(components, ymapsAddressType.district, 2) || '';
            const area = this.getKind(components, ymapsAddressType.area) || '';
            const are2 = this.getKind(components, ymapsAddressType.area, 1) || '';
            const city = locality || locality2 || are2 || area || '';
            const region = locality2 || district || '';
            let street = this.getKind(components, ymapsAddressType.street)
                ? this.getKind(components, ymapsAddressType.street)
                : (district2 && district3) ? `${district2} ${district3}` : district3 || district || '';
            street = `${street} ${house}`;
            resolve({ region, city, street });
        });
    }

    getComponent(components, name) {
        return components?.filter((component) => component?.kind === name);
    }

    getKind(components, name, index = 0) {
        const component = this.getComponent(components, name);
        return component && component[index]?.name;
    }

    async toGeoJSON() {
        const geoObject = this._data.result.geoObjects?.get(0);

        if (!geoObject) {
            throw new Error('GeoObject Not Found');
        }

        const addressComponent = await this.getDetailsAddress(geoObject);
        const coordinates = geoObject.geometry.getCoordinates();
        const bounds = geoObject.properties.get('boundedBy');

        if (this._options.coordorder === 'longlat') {
            [bounds[0], bounds[1], coordinates].forEach((coordinates) => coordinates.reverse());

        }

        return {
            id: uId(),
            type: "Feature",
            bbox: bounds,
            geometry: {
                type: "Point",
                coordinates: coordinates,
            },
            properties: {
                addressComponent,
                ...this._data.point.properties,
                text: this._data.point.text,
                name: geoObject.properties.get('name'),
                description: geoObject.properties.get('description'),
                metaDataProperty: geoObject.properties.get('metaDataProperty')
            },
            options: {
                iconLayout: "default#image",
                iconImageHref: "./assets/images/marker-icon.svg",
            }
        };
    }
}

