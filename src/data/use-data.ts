import {useEffect, useState} from 'react';

export interface InfoItem {
    faction: string;
    userUuid: string;
    map: string;
    wins: number;
    loss: number;
}

export type DataGroupBy = 'map' | 'userUuid' | 'faction';
export const allDataGroupBy: DataGroupBy[] = ['map', 'userUuid', 'faction'];

export interface PatchData {
    date_min: string;
    date_max: string;
    mapNames: Record<string, string>;
    data: {
        mode: string;
        userNames: Record<string, string>;
        data: InfoItem[];
    }[];
}
export type _Data = [faction: string, userUuid: string, map: string, wins: number, loss: number][];


function parseData(raw: PatchData&{data: {mode: string, data: _Data}[]}): PatchData {
    return {
        ...raw,
        data: raw.data.map(({mode, data, userNames}) => ({
            mode,
            userNames,
            data: (data as _Data).map(([faction, userUuid, map, wins, loss]) => ({
                faction, userUuid, map, wins, loss
            }))
        }))
    }
}

export default function useData(name: string) {
    const [data, setData] = useState<PatchData | null>(null);
    useEffect(() => {
        fetch(name)
            .then(r => r.json())
            .then(parseData)
            .then(setData)
            .catch(() => {
                alert('Failed to load data');
            });
    }, []);
    return data;
}