import Filters from './Filters';
import DataTable from './DataTable';
import useDataFilters from './use-data-filters';
import {useEffect, useMemo} from 'react';
import {InfoItem} from '../data/use-data';
import './ModeTable.css';

interface Props {
    mapNames: Record<string, string>;
    userNames: Record<string, string>;
    data: InfoItem[];
    title: string;
}
export default function ModeTable({mapNames, userNames, data, title}: Props) {
    const {component, table} = useDataFilters();
    const allFactions = useMemo(() => Object.fromEntries(Array.from(new Set(data.map(x => x.faction))).sort().map(x => [x, x])), [data]);
    useEffect(() => {
        component.setSelectedUsers(Object.keys(userNames));
        component.setSelectedMapIds(Object.keys(mapNames));
        component.setSelectedFactions(Object.keys(allFactions));
    }, [allFactions, userNames, mapNames]);


    const total = useMemo(() => {
        const t = data.reduce((a, r) => a + r.wins + r.loss, 0);
        const versus = title.match(/(?<v>\d+) versus \d+/);
        if (versus) {
            return t / (2*versus.groups.v);
        }
        const ffa = title.match(/FFA\s?(?<v>\d+)/);
        if (ffa) {
            return t / +ffa.groups.v;
        }
        return t;

    }, [data]);
    return (<>
        <h3>{title}, всего игр: {total}</h3>
        <div className={'mode'}>
            <Filters {...component} mapNames={mapNames} userNames={userNames} allFactions={allFactions} />
            <DataTable {...table} rawData={data} mapNames={mapNames} userNames={userNames} />
        </div>
    </>);
}