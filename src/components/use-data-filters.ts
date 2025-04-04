import {Dispatch, SetStateAction, useState} from 'react';
import {DataGroupBy} from '../data/use-data';

export interface ForFiltersProps {
    groupBy: DataGroupBy[];
    selectedMapIds: string[];
    selectedUsers: string[];
    setGroupBy: Dispatch<SetStateAction<DataGroupBy[]>>;
    setSelectedMapIds: Dispatch<SetStateAction<string[]>>;
    setSelectedUsers: Dispatch<SetStateAction<string[]>>;
}
export interface ForTableDataInfo {
    groupBy: DataGroupBy[];
    selectedMapIds: string[];
    selectedUsers: string[];
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
    return {
        table: {
            groupBy, selectedMapIds, selectedUsers
        },
        component: {
            groupBy, setGroupBy,
            selectedMapIds, setSelectedMapIds,
            selectedUsers, setSelectedUsers
        }
    }
}