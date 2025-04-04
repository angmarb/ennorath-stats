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
    useEffect(() => {
        component.setSelectedUsers(Object.keys(userNames));
        component.setSelectedMapIds(Object.keys(mapNames));
    }, []);

    const total = useMemo(() => data.reduce((a, r) => a + r.wins, 0), [data]);
    return (<div className={'mode'}>
        <h3>{title}, всего игр: {total}</h3>
        <Filters {...component} mapNames={mapNames} userNames={userNames} />

        <DataTable {...table} rawData={data} mapNames={mapNames} userNames={userNames} />
    </div>);
}