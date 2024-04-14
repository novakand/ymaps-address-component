import { GeocoderProvider } from './providers/ymaps-provider-geocode.js';
import { default as QueueServise } from '../../../../../vow-queue.js';

export class YmapsGeocoderService {

    constructor(options) {
        this._options = options || {};
        this._queue = null;
        this._provider = new GeocoderProvider(this._options);
    }

    geocode(points, options) {

        const { timeout } = options;

        const Queue = QueueServise(ymaps.vow, timeout);

        const provider = this._provider;
        const queue = this._queue = new Queue({ weightLimit: 1 });
        const tasks = [];

        const enqueue = (task) => {
            tasks.push(queue.enqueue(task, { priority: 1, weight: 1 }));
        };
        const getProgress = (num) => {
            return Math.round(num * 100 / tasks.length);
        };

        points.forEach((point) => enqueue(provider.geocode.bind(provider, point, options)));
        queue.start();

        return ymaps.vow.allResolved(tasks)
            .then((results) => {
                var features = [], errors = [];

                results.forEach((promise, index) => {
                    var value = promise.valueOf();

                    if (promise.isFulfilled()) {
                        features.push(value);
                    }
                    else {
                        errors.push({
                            request: points[index],
                            index: index,
                            reason: value instanceof Error ? value.message : value
                        });
                    }
                });

                return {
                    result: {
                        type: "FeatureCollection",
                        sheet: points[0]?.properties?.sheet || '',
                        features: features
                    },
                    errors: errors
                };
            })
            .progress((message) => {
                const stats = queue.getStats();
                return {
                    message: message,
                    processed: getProgress(stats.processedTasksCount),
                    processing: getProgress(stats.processingTasksCount)
                };
            });
    }
}