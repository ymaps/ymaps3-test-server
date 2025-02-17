import {tileToWorld} from './projection';
import {wgs84Mercator} from './wgs84-mercator';

describe('Projection', () => {
    describe('Convert tiles coordinates to wgs84 bounds', () => {
        it('Should return wgs84 bounds by x, y, z', () => {
            const bounds = tileToWorld(10, 10, 10);
            expect(bounds).toEqual([
                {x: -0.98046875, y: 0.98046875},
                {x: -0.978515625, y: 0.978515625}
            ]);

            const bounds2 = tileToWorld(2, 3, 12);
            expect(bounds2).toEqual([
                {x: -0.9990234375, y: 0.99853515625},
                {x: -0.99853515625, y: 0.998046875}
            ]);

            const bounds3 = tileToWorld(619, 321, 10);
            expect(bounds3).toEqual([
                {x: 0.208984375, y: 0.373046875},
                {x: 0.2109375, y: 0.37109375}
            ]);
        });
    });

    describe('Convert tiles coordinates to LngLat bounds', () => {
        it('Should return LngLat bounds by x, y, z', () => {
            const bounds = tileToWorld(10, 10, 10);

            expect(bounds.map((p) => wgs84Mercator.fromWorldCoordinates(p))).toEqual([
                [-176.484375, 84.77337592309675],
                [-176.1328125, 84.74125036296263]
            ]);

            const bounds2 = tileToWorld(12, 11, 5);
            expect(bounds2.map((p) => wgs84Mercator.fromWorldCoordinates(p))).toEqual([
                [-45, 49.11291284486365],
                [-33.75, 41.17042723849767]
            ]);

            const bounds3 = tileToWorld(619, 321, 10);
            expect(bounds3.map((p) => wgs84Mercator.fromWorldCoordinates(p))).toEqual([
                [37.6171875, 55.757444263112916],
                [37.96875, 55.558692299089046]
            ]);
        });
    });
});
