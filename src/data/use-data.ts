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
    userNames: Record<string, string>;
    data: {
        mode: string;
        data: InfoItem[];
    }[];
}
// const defaultData: PatchData = {
//     date_min: '-',
//     date_max: '-',
//     data: [],
//     mapNames: {},
//     userNames: {},
// };
export type _Data = [faction: string, userUuid: string, map: string, wins: number, loss: number][];
// export default function useData(name: string) {
//     const [data, setData] = useState<PatchData>(defaultData);
//     useEffect(() => {
//         fetch('/src/data/'+name)
//             .then(r => r.json())
//             .then(d => ({
//                 ...d,
//                 data: (d.data as _Data).map(([mode, faction, userUuid, map, wins, loss]) => ({
//                     mode, faction, userUuid, map, wins, loss
//                 }))
//             }))
//             .then(setData)
//             .catch(() => {
//                 alert('Failed to load data');
//             });
//     }, []);
//     return data;
// }