import type { Level, RuntimeLogEntry } from '@axonivy/log-view-protocol';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IvyIcon,
  Label,
  selectRow,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  useTableGlobalFilter,
  useTableSort
} from '@axonivy/ui-components';
import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
import { useReactTable } from '@tanstack/react-table';
import { LogRow } from './LogRow';
import { useMemo, useState } from 'react';
import { FilterOptions } from './FilterOptions';
import './RuntimeLogTable.css';
import { SeverityIcon } from './SeverityIcon';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';

interface ViewProps {
  clearlogs: () => void;
  RuntimeLogEntry: RuntimeLogEntry[];
  onRowClick: (rowData: RuntimeLogEntry) => void;
}

export type LogLevel = Exclude<Level, 'OFF' | 'TRACE' | 'ALL'>;

export const levelPriority: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

export const RuntimeLogTable = ({ RuntimeLogEntry, clearlogs, onRowClick }: ViewProps) => {
  const { t } = useTranslation();
  const sort = useTableSort();
  const search = useTableGlobalFilter();

  const [selectedLevel, setSelectedLevel] = useState<LogLevel>('DEBUG');
  const [isUserLog, setIsUserLog] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const projectList = useMemo(
    () => Array.from(new Set(RuntimeLogEntry.map(entry => entry.project as string).filter(project => project !== null && project !== ''))),
    [RuntimeLogEntry]
  );

  const filteredData = useMemo(() => {
    return RuntimeLogEntry.filter(entry => selectedProjects.length === 0 || selectedProjects.includes(entry.project as string))
      .filter(entry => levelPriority[entry.level as LogLevel] >= levelPriority[selectedLevel])
      .filter(entry => (isUserLog ? entry.category === 'User' : true));
  }, [RuntimeLogEntry, selectedProjects, selectedLevel, isUserLog]);

  const columns: Array<ColumnDef<RuntimeLogEntry, string>> = [
    {
      accessorKey: 'level',
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.type')} />,
      cell: cell => (
        <Flex className='severity' gap={2}>
          <SeverityIcon level={cell.getValue() as LogLevel} />
          <Label>{cell.getValue()}</Label>
        </Flex>
      ),
      maxSize: 30,
      sortingFn: (rowA, rowB) => {
        const levelA = levelPriority[rowA.getValue('level') as LogLevel];
        const levelB = levelPriority[rowB.getValue('level') as LogLevel];
        return levelA - levelB;
      }
    },
    {
      accessorKey: 'project',
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.project')} />,
      cell: cell => cell.getValue(),
      maxSize: 30
    },
    {
      accessorKey: 'message',
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.message')} />,
      cell: cell => cell.getValue()
    }
  ];

  const table = useReactTable({
    enableMultiRowSelection: false,
    ...sort.options,
    ...search.options,
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...sort.tableState,
      ...search.tableState
    }
  });

  const handleLogLevelChange = (checked: boolean, level: LogLevel) => {
    if (checked) {
      setSelectedLevel(level);
    }
  };

  return (
    <Flex direction='column' gap={2} className='master-content-container'>
      <Flex gap={2}>
        <div className='search-field'>{search.filter}</div>
        <FilterOptions
          handleProjectFilterChange={setSelectedProjects}
          selectedProjects={selectedProjects}
          selectedLevel={selectedLevel}
          handleLogLevelChange={handleLogLevelChange}
          handleIsUserLogChange={setIsUserLog}
          isUserLog={isUserLog}
          projects={projectList}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button title={t('label.menu')} aria-label={t('label.menu')}>
              <IvyIcon icon={IvyIcons.Dots} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={clearlogs} className='dropdown-delete'>
                <IvyIcon icon={IvyIcons.Trash} />
                <Label>{t('label.removelogs')}</Label>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>

      <Table style={{ overflowX: 'unset' }}>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => selectRow(table)} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <LogRow key={row.id} row={row} onRowClick={onRowClick} />
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};
