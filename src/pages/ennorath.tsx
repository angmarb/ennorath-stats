import ModeTable from '../components/ModeTable';
import './page.css';
import useEnnorathData from '../data/ennorath-data';

export default function Ennorath() {
    const info = useEnnorathData();
    if (!info) {
        return <></>;
    }
    const {date_max, date_min, data, mapNames} = info;
    return(<div>
        <h1>Ennorath stats</h1>
        <h3>{date_min}</h3>
        <h3>{date_max}</h3>
        <div className={'modTables'}>
            {data.map(datum => (
                <ModeTable mapNames={mapNames} userNames={datum.userNames} data={datum.data} title={datum.mode} key={datum.mode} />
            ))}
        </div>
    </div>);
}