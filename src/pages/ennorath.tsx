import useDataFilters from '../components/use-data-filters';
import {useEffect} from 'react';
import {ennorathData} from '../data/ennorath-data';
import ModeTable from '../components/ModeTable';
import './page.css';

export default function Ennorath() {
    const {date_max, date_min, data, mapNames, userNames} = ennorathData;
    const {component, table} = useDataFilters();
    useEffect(() => {
        component.setSelectedUsers(Object.keys(userNames));
        component.setSelectedMapIds(Object.keys(mapNames));
    }, []);
    return(<div>
        <h1>Ennorath stats</h1>
        <h3>{date_min}</h3>
        <h3>{date_max}</h3>
        <div className={'modTables'}>
            {data.map(datum => (
            <ModeTable mapNames={mapNames} userNames={userNames} data={datum.data} title={datum.mode} key={datum.mode} />
        ))}
        </div>
    </div>);
}