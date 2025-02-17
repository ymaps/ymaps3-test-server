import {GenericMercatorProjection} from './generic-mercator-projection';

const wgs84Mercator = new GenericMercatorProjection({type: 'EPSG:3395'});

export {wgs84Mercator};
