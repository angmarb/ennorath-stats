import ModeTable from '../components/ModeTable';
import './page.css';
import url1976 from 'url:../data/ennorath_data_1976.json';
import useData from '../data/use-data';

export default function Ennorath1976() {
    const info = useData(url1976);
    if (!info) {
        return <></>;
    }
    const {date_max, date_min, data, mapNames} = info;
    return(<div>
        <h1>Ennorath 1.9.7.6 stats</h1>
        <h2>{date_min}</h2>
        <h2>{date_max}</h2>
        <div>
            <p><a href={'/ennorath-stats/1973.html'}>к 1.9.7.3</a></p>
            <p><a href={'/ennorath-stats/1975.html'}>к 1.9.7.5</a></p>
        </div>
        <div>
            <a href={'/ennorath-stats/matchaps1976.html'}>к матчапам</a>
        </div>
        <pre>Нажмите на заголовок столбца таблицы для сортировки</pre>
        <div className={'modTables'}>
            {data.map(datum => (
                <ModeTable mapNames={mapNames} userNames={datum.userNames} data={datum.data} title={datum.mode} key={datum.mode} />
            ))}
        </div>
    </div>);
}