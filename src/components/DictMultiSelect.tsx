import { MultiSelect } from 'react-multi-select-component';
import {useCallback, useMemo} from 'react';
import './select.css';

interface Props {
    items: Record<string, string>;
    selectedIds: string[];
    setSelectedIds: (v: string[]) => void;
    label: string;
}
export default function DictMultiSelect({selectedIds, setSelectedIds, items, label}: Props) {
    const options = useMemo(() => Object.entries(items).map(([mapId, mapName]) => ({
        value: mapId,
        label: mapName,
    })), [items]);
    const value = useMemo(() => options.filter(o => selectedIds.includes(o.value)), [selectedIds, options]);
    const onChange = useCallback((newValue: {value: string}[]) => {
        setSelectedIds(newValue.map(v => v.value));
    }, [setSelectedIds]);
    return (<div className={'selectWrap'}>
        <label>{label}</label>
        <MultiSelect
            options={options}
            value={value}
            onChange={onChange}
            labelledBy={label}
            overrideStrings={{
                'allItemsAreSelected': 'Все',
            }}
        />
    </div>);

}