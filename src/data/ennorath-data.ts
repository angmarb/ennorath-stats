
import ennorathDataRaw from '../data/ennorath_data.json';
import {_Data, PatchData} from './use-data';

export const ennorathData: PatchData = {
    ...ennorathDataRaw,
    data: (ennorathDataRaw.data as {data: _Data, mode: string}[]).map(({mode, data}) => ({
        mode,
        data: data.map(([faction, userUuid, map, wins, loss]) => ({
            faction, userUuid, map, wins, loss
        }))
    }))
};