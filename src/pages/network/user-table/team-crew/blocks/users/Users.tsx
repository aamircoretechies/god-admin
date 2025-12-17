/* eslint-disable prettier/prettier */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { ColumnDef, Column, RowSelectionState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UsersData, IUsersData } from './';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';


interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface UsersToolbarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortFilter: string;
  setSortFilter: (value: string) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
}

const UsersToolbar = ({
  statusFilter,
  setStatusFilter,
  sortFilter,
  setSortFilter,
  searchInput,
  setSearchInput
}: UsersToolbarProps) => {
  const { table, totalRows } = useDataGrid();

  return (
    <div className="card-header flex-wrap gap-2 border-b-0 px-5">
      <h3 className="card-title font-medium text-sm">
        Showing {table.getState().pagination.pageSize} of {totalRows} users
      </h3>

      <div className="flex flex-wrap gap-2 lg:gap-5">
        <div className="flex">
          <label className="input input-sm">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search users"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortFilter} onValueChange={setSortFilter}>
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="older">Older</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => {
              console.log('Filter button clicked', { statusFilter, sortFilter, searchInput });
            }}
          >
            <KeenIcon icon="setting-4" /> Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<IUsersData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row: IUsersData) => row.user,
        id: 'users',
        header: ({ column }) => <DataGridColumnHeader title="Member" filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: ({ row }) => {  // 'row' argumentini cell funksiyasiga qo'shdik
          return (

            <div className="flex items-center gap-4">
              <img
                src={toAbsoluteUrl(`/media/avatars/${row.original.user.avatar}`)}
                className="rounded-full size-9 shrink-0"
                alt={`${row.original.user.userName}`}
              />

              <div className="flex flex-col gap-0.5">
                <Link to="/network/user-table/user-detail" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.user.userName}
                </Link>

                <Link to="#" className="text-2sm text-gray-700 font-normal hover:text-primary-active">
                  {row.original.user.userGmail}
                </Link>

                <Link
                  to="/network/user-table/user-detail"
                  className="text-xs text-primary hover:text-primary-active mt-1"
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        },
        meta: {
          className: 'min-w-[300px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        accessorFn: (row) => row.role,
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Pole" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.role;
        },
        meta: {
          headerClassName: 'min-w-[180px]',
        }
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (
            <span className={`badge badge-${info.row.original.status.color} shrink-0 badge-outline rounded-[30px]`}>
              <span className={`size-1.5 rounded-full bg-${info.row.original.status.color} me-1.5`}></span>
              {info.row.original.status.label}
            </span>
          );
        },
        meta: {
          headerClassName: 'min-w-[180px]'
        }
      },
      {
        accessorFn: (row) => row.location,
        id: 'location',
        header: ({ column }) => <DataGridColumnHeader title="Location" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return (

            <div className="flex items-center text-gray-800 font-normal gap-1.5">
              <img
                src={toAbsoluteUrl(`/media/flags/${info.row.original.flag}`)}
                className="rounded-full size-4 shrink-0"
                alt={`${info.row.original.user.userName}`}
              />
              {info.row.original.location}
            </div>
          );
        },
        meta: {
          headerClassName: 'min-w-[180px]'
        }
      },
      {
        accessorFn: (row) => row.activity,
        id: 'activity',
        header: ({ column }) => <DataGridColumnHeader title="Activity" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.activity;
        },
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-gray-800 font-normal',
        }
      },
      {
        id: 'edit',
        header: () => '',
        enableSorting: false,
        cell: () => {
          return (
            <div className="flex gap-2">
              <Link
                to="/network/user-table/user-detail"
                className="btn btn-sm btn-outline btn-primary"
              >
                View Details
              </Link>
              <button className="btn btn-sm btn-icon btn-clear btn-light">
                <KeenIcon icon="dots-vertical" />
              </button>
            </div>
          );
        },
        meta: {
          headerClassName: 'w-[140px]'
        }
      }
    ],
    []
  );

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('latest');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter and sort data based on search, status, and sort filters
  const data: IUsersData[] = useMemo(() => {
    let filtered = [...UsersData];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((user) =>
        user.user.userName.toLowerCase().includes(searchLower) ||
        user.user.userGmail?.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => {
        const statusLabel = user.status.label.toLowerCase();
        if (statusFilter === 'active') {
          return statusLabel === 'active' || statusLabel === 'online';
        } else if (statusFilter === 'disabled') {
          return statusLabel === 'disabled' || statusLabel === 'offline';
        } else if (statusFilter === 'pending') {
          return statusLabel === 'pending';
        }
        return true;
      });
    }

    // Apply sort filter
    if (sortFilter === 'latest') {
      filtered = filtered.reverse();
    } else if (sortFilter === 'oldest') {
      filtered = filtered.reverse();
    }

    return filtered;
  }, [debouncedSearch, statusFilter, sortFilter]);

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  // UsersToolbar extracted to top level  };

  return (
    <DataGrid
      columns={columns}
      data={data}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      sorting={[{ id: 'users', desc: false }]}
      toolbar={
        <UsersToolbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      }
      layout={{ card: true }}
    />
  );
};

export { Users };
