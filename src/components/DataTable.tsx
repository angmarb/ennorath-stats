import {allDataGroupBy, DataGroupBy, InfoItem} from '../data/use-data';
import {ForTableDataInfo} from './use-data-filters';
import './DataTable.css';
import {useCallback, useMemo, useState} from 'react';


function makeGroupKey(groupBy: DataGroupBy[], item: InfoItem) {
    return allDataGroupBy.filter(k => groupBy.includes(k)).map(k => item[k]).join('!');
}


interface TableItem extends InfoItem {
    winRate: number;
    total: number;
}

type Sort = {isAsc: boolean; column: keyof TableItem};
const defaultSort: Sort = {isAsc: false, column: 'winRate'};

interface Props extends ForTableDataInfo {
    rawData: InfoItem[];
    mapNames: Record<string, string>;
    userNames: Record<string, string>;
}

export default function DataTable({rawData, selectedMapIds, groupBy, selectedUsers, selectedFactions, minTotal, userNames, mapNames }: Props) {
    const [sort, setSort] = useState<Sort>(defaultSort);

    const onSort = useCallback((columnKey: keyof TableItem) => {
        setSort(old => ({column: columnKey, isAsc: old.column === columnKey ? !old.isAsc : false}));
    }, []);

    const sortFn = useMemo(() =>
        sort.column === 'total' || sort.column === 'wins' || sort.column === 'loss' || sort.column === 'winRate'
        ? (a: TableItem, b: TableItem) => a[sort.column] - b[sort.column]
        : (a: TableItem, b: TableItem) => (a[sort.column] as string).localeCompare(b[sort.column] as string),
        [sort]
    );

    const groupedData: TableItem[] = useMemo(() => {
        const users = new Set(selectedUsers);
        const map = new Set(selectedMapIds);
        const factions = new Set(selectedFactions);
        const result: Map<string, InfoItem> = new Map();
        rawData.forEach(datum => {
            if (users.has(datum.userUuid) && map.has(datum.map) && factions.has(datum.faction)) {
                const groupKey = makeGroupKey(groupBy, datum);
                let resultItem = result.get(groupKey);
                if (!resultItem) {
                    resultItem = {
                        ...datum,
                        wins: 0,
                        loss: 0,
                    };
                    result.set(groupKey, resultItem);
                }
                resultItem.wins += datum.wins;
                resultItem.loss += datum.loss;
            }
        });
        let sorted = Array.from(result.values()).map(it => ({
            faction: it.faction,
            userUuid: userNames[it.userUuid] ?? it.userUuid,
            map: mapNames[it.map] ?? it.map,
            wins: it.wins,
            loss: it.loss,
            winRate: Math.floor(10000 * it.wins / (it.wins + it.loss)) / 100,
            total: it.wins + it.loss
        })).sort(sortFn);
        if (!sort.isAsc) {
            sorted.reverse();
        }
        if (minTotal !== null && !Number.isNaN(minTotal)) {
            sorted = sorted.filter(datum => datum.total >= minTotal);
        }
        return sorted;
    }, [groupBy, rawData, selectedUsers, selectedMapIds, selectedFactions, minTotal, sortFn]);

    return (<div className={'tableWrap'}>
        <table border={1}>
            <thead>
                <tr>
                    {groupBy.includes('faction') && (<th onClick={() => onSort('faction')}>Фракция</th>)}
                    {groupBy.includes('userUuid') && (<th onClick={() => onSort('userUuid')}>Игрок</th>)}
                    {groupBy.includes('map') && (<th onClick={() => onSort('map')}>Карта</th>)}
                    <th onClick={() => onSort('total')}>Всего</th>
                    <th onClick={() => onSort('wins')}>Побед</th>
                    <th onClick={() => onSort('loss')}>Поражений</th>
                    <th onClick={() => onSort('winRate')}>Винрейт</th>
                </tr>
            </thead>
            <tbody>
                {groupedData.map((datum, i) => (<tr key={i} className={datum.winRate > 50 ? 'win' : (datum.winRate < 50 ? 'lose' : '')}>
                    {groupBy.includes('faction') && (<td>{datum.faction}</td>)}
                    {groupBy.includes('userUuid') && (<td>{datum.userUuid}</td>)}
                    {groupBy.includes('map') && (<td>{datum.map}</td>)}
                    <td>{datum.wins+datum.loss}</td>
                    <td>{datum.wins}</td>
                    <td>{datum.loss}</td>
                    <td>{datum.winRate}</td>
                </tr>))}
            </tbody>
        </table>
    </div>);
}