import ennorathUrl from 'url:./ennorath_data.json'
import useData from './use-data';

export default function useEnnorathData() {
    return useData(ennorathUrl);
}