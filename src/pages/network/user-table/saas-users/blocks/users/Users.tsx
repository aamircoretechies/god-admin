import { useMemo, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid } from '@/components';
import { ColumnDef, Column, RowSelectionState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { fetchUsersForDataGrid, type TransformedUserData } from '@/services/usersApi';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface IUsersData extends TransformedUserData {
  enforce?: boolean;
}

const EnforceSwitch = ({ enforce }: { enforce: boolean }) => {
  return (
    <label className="switch switch-sm">
      <input type="checkbox" checked={enforce} value="1" readOnly />
    </label>
  );
};

interface UsersProps {
  hideRowsPerPage?: boolean;
}

interface SaaSUsersToolbarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortFilter: string;
  setSortFilter: (value: string) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
}

const SaaSUsersToolbar = ({
  statusFilter,
  setStatusFilter,
  sortFilter,
  setSortFilter,
  searchInput,
  setSearchInput
}: SaaSUsersToolbarProps) => {
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
              placeholder="Search new users"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
            }}
          >
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortFilter}
            onValueChange={(value) => {
              setSortFilter(value);
            }}
          >
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="older">Older</SelectItem>
              {/* <SelectItem value="oldest">Oldest</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const Users = ({ hideRowsPerPage = false }: UsersProps) => {
  // const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
  // return (
  //   <Input
  //     placeholder="Filter..."
  //     value={(column.getFilterValue() as string) ?? ''}
  //     onChange={(event) => column.setFilterValue(event.target.value)}
  //     className="h-9 w-full max-w-40"
  //   />
  // );
  // };

  const columns = useMemo<ColumnDef<IUsersData>[]>(
    () => [
      /*    {
           accessorKey: 'id',
           header: () => <DataGridRowSelectAll />,
           cell: ({ row }) => <DataGridRowSelect row={row} />,
           enableSorting: false,
           enableHiding: false,
           meta: {
             headerClassName: 'w-0'
           }
         }, */
      {
        accessorFn: (row: IUsersData) => row.user,
        id: 'user',
        // header: ({ column }) => (
        //   <DataGridColumnHeader
        //     title="New User"
        //     filter={<ColumnInputFilter column={column} />}
        //     column={column}
        //   />
        // ),
        header: () => (
          <span className="font-medium text-sm text-gray-900 ml-2">
            New User
          </span>
        ),

        enableSorting: false,
        cell: (info: any) => (
          <div className="flex items-center gap-2.5">
            <img
              src={
                info.row.original.user.avatar.startsWith('http')
                  ? info.row.original.user.avatar
                  : toAbsoluteUrl(`/media/avatars/${info.row.original.user.avatar}`)
              }
              className="size-7 rounded-full shrink-0"
              alt=""
            />
            <div className="flex flex-col">
              <Link
                className="font-medium text-gray-900 hover:text-primary-active mb-px"
                to={`/network/user-table/user-detail/${info.row.original.id}`}
              >
                {info.row.original.user.name}
              </Link>
              <Link
                className="text-2sm text-gray-700 hover:text-primary-active"
                to={`/network/user-table/user-detail/${info.row.original.id}`}
              >
                {info.row.original.user.email}
              </Link>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      /*  {
         accessorFn: (row: IUsersData) => row.labels,
         id: 'labels',
         header: ({ column }) => <DataGridColumnHeader title="Products" column={column} />,
         enableSorting: true,
         cell: (info: any) => (
           <div className="flex gap-1.5">
             {info.row.original.labels.map((label: string, index: number) => (
               <span key={index} className="badge badge-sm">
                 {label}
               </span>
             ))}
           </div>
         ),
         meta: {
           headerClassName: 'min-w-[200px]',
           cellClassName: 'text-gray-700 font-normal'
         }
       }, */
      {
        accessorFn: (row: IUsersData) => row.joinDate || '2024-01-15',
        id: 'joinDate',
        // header: ({ column }) => <DataGridColumnHeader title="Join Date" column={column} />,
        enableSorting: false,
        cell: (info: any) => (
          <span className="text-sm text-gray-800 font-medium">
            {info.row.original.joinDate || 'N/A'}
          </span>
        ),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-medium'
        }
      },
      /* {
        accessorFn: (row: IUsersData) => row.enforce,
        id: 'enforce',
        header: ({ column }) => <DataGridColumnHeader title="Enforce 2FA" column={column} />,
        enableSorting: true,
        cell: (info: any) => <EnforceSwitch enforce={info.row.original.enforce} />,
        meta: {
          headerClassName: 'min-w-[137px]',
          cellClassName: 'text-gray-800 font-medium'
        }
      }, */
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        enableSorting: false,
        enableHiding: false,
        cell: (info: any) => (
          <div className="flex gap-2">
            <Link
              to={`/network/user-table/user-detail/${info.row.original.id}`}
              className="btn btn-sm btn-outline btn-primary"
            >
              View Details
            </Link>
          </div>
        ),
        meta: {
          headerClassName: 'w-40',
          cellClassName: 'text-gray-800 font-medium'
        }
      }
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleRowSelection = (state: RowSelectionState) => {
    setRowSelection(state);
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => {
            setRowSelection({});
            // Clear selection in the table
            const table = document.querySelector('[data-table]');
            if (table) {
              // Trigger table row deselection
              const checkboxes = table.querySelectorAll('input[type="checkbox"]');
              checkboxes.forEach((checkbox: any) => {
                if (checkbox.checked) {
                  checkbox.click();
                }
              });
            }
          }
        }
      });
    }
  };

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

  // Custom fetch function that includes search and filters
  const customFetchData = React.useCallback(
    async (params: any) => {
      return fetchUsersForDataGrid(params, debouncedSearch, statusFilter, sortFilter);
    },
    [debouncedSearch, statusFilter, sortFilter]
  );

  // SaaSUsersToolbar extracted to top level

  // Create a unique key that changes when filters change to force remount
  const dataGridKey = React.useMemo(() => {
    return `users-grid-${debouncedSearch}-${statusFilter}-${sortFilter}`;
  }, [debouncedSearch, statusFilter, sortFilter]);

  return (
    <DataGrid
      key={dataGridKey}
      columns={columns}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5, hideRowsPerPage }}
      sorting={[{ id: 'joinDate', desc: true }]}
      toolbar={
        <SaaSUsersToolbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      }
      layout={{ card: true }}
      serverSide={true}
      onFetchData={customFetchData}
    />
  );
};

export { Users };
