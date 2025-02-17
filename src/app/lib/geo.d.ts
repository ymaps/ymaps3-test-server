export type LngLat = [number, number] | [number, number, number];

export interface Point {
    x: number;
    y: number;
    z?: number;
}

export type WorldCoordinates = Point;

export type Bounds = [LngLat, LngLat];

export interface Projection {
    toWorldCoordinates(point: LngLat): WorldCoordinates;
    fromWorldCoordinates(coordinates: WorldCoordinates): LngLat;
}
