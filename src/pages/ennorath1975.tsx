import ModeTable from '../components/ModeTable';
import './page.css';
import url1975 from 'url:../data/ennorath_data_1975.json';
import useData from '../data/use-data';

export default function Ennorath1975() {
    const info = useData(url1975);
    if (!info) {
        return <></>;
    }
    const {date_max, date_min, data, mapNames} = info;
    return(<div>
        <h1>Ennorath 1.9.7.5 stats</h1>
        <h2>{date_min}</h2>
        <h2>{date_max}</h2>
        <div>
            <a href={'/ennorath-stats/1973.html'}>к 1.9.7.3</a>
        </div>
        <div>
            <a href={'/ennorath-stats/matchaps1975.html'}>к матчапам</a>
        </div>
        <pre>Нажмите на заголовок столбца таблицы для сортировки</pre>
        <div className={'modTables'}>
            {data.map(datum => (
                <ModeTable mapNames={mapNames} userNames={datum.userNames} data={datum.data} title={datum.mode} key={datum.mode} />
            ))}
        </div>
    </div>);
}