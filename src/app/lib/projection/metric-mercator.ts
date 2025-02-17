import {cycleRestrict, restrict} from './restrict';
import {RAD_TO_DEG, DEG_TO_RAD} from './angle';
import {LngLat, Point as Vec2} from '../geo';

/**
 * Similar to WorldCoordinates, but with different coordinates units:
 * they are specified in meters.
 */
interface WorldMetricCoordinates extends Vec2 {
    readonly type?: 'world-metric';
    z?: number;
}

class MetricMercator {
    private _e2: number;
    private _e4: number;
    private _e6: number;
    private _e8: number;
    private _d2: number;
    private _d4: number;
    private _d6: number;
    private _d8: number;
    private _subradius: number;

    readonly radius: number;
    readonly e: number;

    constructor(radius = 6378137, e = 0.0818191908426) {
        this.radius = radius;
        this.e = e;

        // Четные степени эксцентриситета
        this._e2 = this.e * this.e;
        this._e4 = this._e2 * this._e2;
        this._e6 = this._e4 * this._e2;
        this._e8 = this._e4 * this._e4;
        this._subradius = 1 / radius;

        // Предвычисленные коэффициенты для быстрого обратного преобразования Меркатора
        // Подробнее см. тут: http://mercator.myzen.co.uk/mercator.pdf формула 6.52
        // Работает только при небольших значения эксцентриситета!
        this._d2 = this._e2 / 2 + (5 * this._e4) / 24 + this._e6 / 12 + (13 * this._e8) / 360;
        this._d4 = (7 * this._e4) / 48 + (29 * this._e6) / 240 + (811 * this._e8) / 11520;
        this._d6 = (7 * this._e6) / 120 + (81 * this._e8) / 1120;
        this._d8 = (4279 * this._e8) / 161280;
    }

    mercatorToGeo(coords: WorldMetricCoordinates): LngLat {
        const lng = this.xToLongitude(coords.x);
        const lat = this.yToLatitude(coords.y);
        const alt = coords.z !== undefined ? this.zToAltitude(coords.z, lat) : undefined;
        return alt !== undefined ? [lng, lat, alt] : [lng, lat];
    }

    geoToMercator(geo: LngLat): WorldMetricCoordinates {
        const altitude = geo.length === 3 ? geo[2] : undefined;

        return {
            x: this.longitudeToX(geo[0]),
            y: this.latitudeToY(geo[1]),
            z: altitude !== undefined ? this.altitudeToZ(altitude, geo[1]) : undefined
        };
    }

    xToLongitude(x: number): number {
        return RAD_TO_DEG * cycleRestrict(x * this._subradius, -Math.PI, Math.PI);
    }

    yToLatitude(y: number): number {
        const xphi = Math.PI * 0.5 - 2 * Math.atan(1 / Math.exp(y * this._subradius));
        const latitude =
            xphi +
            this._d2 * Math.sin(2 * xphi) +
            this._d4 * Math.sin(4 * xphi) +
            this._d6 * Math.sin(6 * xphi) +
            this._d8 * Math.sin(8 * xphi);

        return RAD_TO_DEG * latitude;
    }

    /**
     * Converts z coordinate to altitude by reversing mercator distortion.
     */
    zToAltitude(z: number, lat: number): number {
        return z * Math.cos(DEG_TO_RAD * lat);
    }

    longitudeToX(lng: number): number {
        const longitude = cycleRestrict(DEG_TO_RAD * lng, -Math.PI, Math.PI);
        return this.radius * longitude;
    }

    latitudeToY(lat: number): number {
        const epsilon = 1e-10;

        // epsilon чтобы не получить (-)Infinity
        const latitude = DEG_TO_RAD * restrict(lat, -90 + epsilon, 90 - epsilon);
        const esinLat = this.e * Math.sin(latitude);

        // Для широты -90 получается 0, и в результате по широте выходит -Infinity
        const tanTemp = Math.tan(Math.PI * 0.25 + latitude * 0.5);
        const powTemp = Math.pow(Math.tan(Math.PI * 0.25 + Math.asin(esinLat) * 0.5), this.e);
        const U = tanTemp / powTemp;

        return this.radius * Math.log(U);
    }

    /**
     * Converts altitude to z coordinate by applying mercator distortion.
     */
    altitudeToZ(alt: number, lat: number): number {
        // it doesn't support ellipsoidness of the model and uses spherical one instead,
        // which is much simpler and works "well enough", it can be reconsidered if more accuracy
        // is needed, but it still has to be confirmed with backend data
        return alt / Math.cos(DEG_TO_RAD * lat);
    }
}

export {MetricMercator};
