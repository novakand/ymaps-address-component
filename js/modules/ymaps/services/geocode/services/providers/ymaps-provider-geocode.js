import { YmapsGeoJSONView } from './geojson-view.js';

export class GeocoderProvider {

  constructor() { }

  geocode(point, options) {
    const defer = ymaps.vow.defer();
    const onFail = (err) => {
      defer.reject(err);
    };
    const onSuccess = (result) => {
      defer.resolve(result);
    };

    ymaps.geocode(point.text, { results: 1 })
      .then((result) => {
        defer.notify(this.getText(point), this.getText(point));
        onSuccess(this.process({ result, point }));
      }).catch(error => onFail(error));

    return defer.promise();
  }

  process(data) {
    var view = new YmapsGeoJSONView(data, {});
    const f = view.toGeoJSON();
    return f;
  }

  getText(point) {
    return point;
  }
}
