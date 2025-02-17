import type {Point} from '../geo';

/**
 * Convert tile coordinates to special world coordinates.
 * It's not a real some standard, but it's used in mappable.
 */
export function tileToWorld(tx: number, ty: number, tz: number): [Point, Point] {
    const ntiles = 2 ** tz;
    const ts = (1 / ntiles) * 2;

    const x = (tx / ntiles) * 2 - 1;
    const y = -((ty / ntiles) * 2 - 1);

    return [
        {x, y},
        {x: x + ts, y: y - ts}
    ];
}
