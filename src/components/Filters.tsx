import {ForFiltersProps} from './use-data-filters';
import {allDataGroupBy, DataGroupBy} from '../data/use-data';
import DictMultiSelect from './DictMultiSelect';
import './Filters.css';

function appendToGroupBy(groupBy: DataGroupBy[], key: DataGroupBy): DataGroupBy[] {
    return groupBy.concat([key]);
}

function removeFromGroupBy(groupBy: DataGroupBy[], key: DataGroupBy): DataGroupBy[] {
    return groupBy.filter(v => v !== key);
}

const names = {
    'faction': 'фракции',
    'userUuid': 'игроку',
    'map': 'карте'
}

interface Props extends ForFiltersProps {
    mapNames: Record<string, string>;
    userNames: Record<string, string>;
    allFactions: string[];
}
export default function Filters({
    selectedMapIds, setSelectedMapIds, setGroupBy, groupBy,
    setSelectedUsers, selectedUsers, userNames,
    mapNames, selectedFactions, setSelectedFactions, allFactions,
    minTotal, setMinTotal
}: Props) {
    return (<div className={'FiltersWrap'}>
        <div>
            {allDataGroupBy.map(groupByKey => (<div key={groupByKey}>
                <label htmlFor={`group_by_${groupByKey}`}>Группировать по {names[groupByKey]}</label>
                <input
                    id={`group_by_${groupByKey}`}
                    type={'checkbox'}
                    checked={groupBy.includes(groupByKey)}
                    onChange={e => setGroupBy(old => e.target.checked ? appendToGroupBy(old, groupByKey) : removeFromGroupBy(old, groupByKey))}
                />
            </div>))}
        </div>
        <DictMultiSelect items={mapNames} selectedIds={selectedMapIds} setSelectedIds={setSelectedMapIds} label={'Карты'} />
        <DictMultiSelect items={userNames} selectedIds={selectedUsers} setSelectedIds={setSelectedUsers} label={'Игроки'} />
        <DictMultiSelect items={allFactions} selectedIds={selectedFactions} setSelectedIds={setSelectedFactions} label={'Фракции'} />
        <label>
            Минимальное количество игр после группировки:
            <input
                value={`${minTotal ?? ''}`}
                type={'text'}
                onChange={e => setMinTotal(e.target.value === '' ? null : parseInt(e.target.value))}/>
        </label>
    </div>);
}