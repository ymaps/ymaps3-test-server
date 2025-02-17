import {Request, Response} from 'express';
import {z} from 'zod';
import * as Boom from '@hapi/boom';
import {formatZodError, numericString} from '../lib/zod';
import {Bounds} from '../lib/geo';
import {tileToWorld} from '../lib/projection/projection';
import {wgs84Mercator} from '../lib/projection/wgs84-mercator';

const getTileRequestSchema = z
    .object({
        limit: numericString(z.number().int().min(100).max(10000).default(10000)),
        x: numericString(z.number().int()),
        y: numericString(z.number().int()),
        z: numericString(z.number().int())
    })
    .strict();

export async function loadByTile(req: Request, res: Response): Promise<void> {
    const validationResult = getTileRequestSchema.safeParse(req.query);
    if (!validationResult.success) {
        throw Boom.badRequest(formatZodError(validationResult.error));
    }

    const {x: tx, y: ty, z: tz, limit} = validationResult.data;

    const coordinates: Bounds = tileToWorld(tx, ty, tz).map((p) => wgs84Mercator.fromWorldCoordinates(p)) as Bounds;
    const result = await req.dataProvider.getFeaturesByBBox(coordinates, limit);

    res.send({features: result.features, total: result.total, bounds: coordinates});
}
