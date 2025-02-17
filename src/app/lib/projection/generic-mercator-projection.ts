import {MetricMercator} from './metric-mercator';
import {restrict, cycleRestrict} from './restrict';
import {RAD_TO_DEG} from './angle';
import type {LngLat, Projection, WorldCoordinates} from '../geo';

class GenericMercatorProjection implements Projection {
    private _mercator: MetricMercator;
    private _halfEquator: number;

    public readonly type?: string;

    constructor({radius, e, type}: {radius?: number; e?: number; type?: string}) {
        this._mercator = new MetricMercator(radius, e);
        this._halfEquator = Math.PI * this._mercator.radius;
        this.type = type;
    }

    toWorldCoordinates(point: LngLat): WorldCoordinates {
        const mercatorCoords = this._mercator.geoToMercator(point);
        return {
            x: (this._halfEquator + mercatorCoords.x) / this._halfEquator - 1,
            y: restrict(1 - (this._halfEquator - mercatorCoords.y) / this._halfEquator, -1, 1),
            z: mercatorCoords.z !== undefined ? mercatorCoords.z / this._halfEquator : undefined
        };
    }

    fromWorldCoordinates(coordinates: WorldCoordinates): LngLat {
        let lat = this._mercator.yToLatitude(this._halfEquator - (1 - coordinates.y) * this._halfEquator);
        lat = restrict(lat, -90, 90);
        const lng = RAD_TO_DEG * cycleRestrict(Math.PI * coordinates.x, -Math.PI, Math.PI);
        const alt = coordinates.z !== undefined ? coordinates.z * this._halfEquator : undefined;
        return alt !== undefined ? [lng, lat, alt] : [lng, lat];
    }
}

export {GenericMercatorProjection};
