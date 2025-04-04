import {Dispatch, SetStateAction, useState} from 'react';
import {DataGroupBy} from '../data/use-data';

export interface ForFiltersProps {
    groupBy: DataGroupBy[];
    selectedMapIds: string[];
    selectedUsers: string[];
    setGroupBy: Dispatch<SetStateAction<DataGroupBy[]>>;
    setSelectedMapIds: Dispatch<SetStateAction<string[]>>;
    setSelectedUsers: Dispatch<SetStateAction<string[]>>;
    selectedFactions: string[];
    setSelectedFactions: Dispatch<SetStateAction<string[]>>;
    minTotal: number | null;
    setMinTotal: Dispatch<SetStateAction<number | null>>;
}
export interface ForTableDataInfo {
    groupBy: DataGroupBy[];
    selectedMapIds: string[];
    selectedUsers: string[];
    selectedFactions: string[];
    minTotal: number | null;
}

interface Result {
    component: ForFiltersProps;
    table: ForTableDataInfo;
}

const defaultGroupBy: DataGroupBy[] = ['faction'];

export default function useDataFilters(): Result {
    const [groupBy, setGroupBy] = useState<DataGroupBy[]>(defaultGroupBy);
    const [selectedMapIds, setSelectedMapIds] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedFactions, setSelectedFactions] = useState<string[]>([]);
    const [minTotal, setMinTotal] = useState<number | null>(null);
    return {
        table: {
            groupBy, selectedMapIds, selectedUsers, selectedFactions, minTotal
        },
        component: {
            groupBy, setGroupBy,
            selectedMapIds, setSelectedMapIds,
            selectedUsers, setSelectedUsers,
            selectedFactions, setSelectedFactions,
            minTotal, setMinTotal
        }
    }
}