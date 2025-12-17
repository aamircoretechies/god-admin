/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, KeenIcon, useDataGrid } from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
// import { DropdownCard1 } from '@/partials/dropdowns/general'; // Commented out - menu column is hidden
import { fetchAdminCreatedUsers, deleteMultipleTeamMembers, deleteTeamMember, type TeamMember } from '@/services/usersApi';
import { IMembersData } from '.';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface ITeamMembersToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCount: number;
  handleDeleteSelected: () => void;
  isLoading: boolean;
}

const TeamMembersToolbar = ({ searchTerm, setSearchTerm, selectedCount, handleDeleteSelected, isLoading }: ITeamMembersToolbarProps) => {
  const { table } = useDataGrid();

  return (
    <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
      <h3 className="card-title">Team Members</h3>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <KeenIcon
            icon="magnifier"
            className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
          />
          <input
            type="text"
            placeholder="Search Members"
            className="input input-sm ps-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedCount > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="btn btn-sm btn-danger"
            disabled={isLoading}
          >
            <KeenIcon icon="trash" className="me-1" />
            Delete ({selectedCount})
          </button>
        )}
        <DataGridColumnVisibility table={table} />
        {/* Active Users toggle - commented out
        <label className="switch switch-sm">
          <input name="check" type="checkbox" value="1" className="order-2" readOnly />
          <span className="switch-label order-1">Active Users</span>
        </label>
        */}
      </div>
    </div>
  );
};

const Members = () => {
  const { isRTL } = useLanguage();
  const storageFilterId = 'members-filter';

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

  const columns = useMemo<ColumnDef<IMembersData>[]>(
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
        accessorFn: (row) => row.member,
        id: 'member',
        header: ({ column }) => <DataGridColumnHeader title='Member' filter={<ColumnInputFilter column={column} />} column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="shrink-0">
              <img
                src={toAbsoluteUrl(`/media/avatars/${info.row.original.member.avatar}`)}
                className="h-9 rounded-full"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <a className="leading-none font-medium text-sm text-gray-900 hover:text-primary" href="#">
                {info.row.original.member.name}
              </a>
              <span className="text-2sm text-gray-700 font-normal">
                {info.row.original.member.tasks} tasks
              </span>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-700 font-normal'
        },
      },
      {
        accessorFn: (row) => row.roles,
        id: 'roles',
        header: ({ column }) => <DataGridColumnHeader title='Roles' column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-wrap gap-2.5 mb-2">
            {info.row.original.roles.map((role: string, index: number) => (
              <span key={index} className="badge badge-sm badge-light badge-outline">
                {role}
              </span>
            ))}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[165px]'
        },
      },
      /*  {
         accessorFn: (row) => row.location,
         id: 'location',
         header: ({ column }) => <DataGridColumnHeader title='Location' column={column} />,
         enableSorting: true,
         cell: (info) => (
           <div className="flex items-center gap-1.5">
             <img
               src={toAbsoluteUrl(`/media/flags/${info.row.original.location.flag}`)}
               className="h-4 rounded-full"
               alt=""
             />
             <span className="leading-none text-gray-800 font-normal">
               {info.row.original.location.name}
             </span>
           </div>
         ),
         meta: {
           headerClassName: 'min-w-[165px]',
           cellClassName: 'text-gray-700 font-normal'
         },
       }, */
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title='Status' column={column} />,
        enableSorting: true,
        cell: (info) => (
          <span className={`badge badge-sm badge-outline  ${info.row.original.status.variant}`}>
            {info.row.original.status.label}
          </span>
        ),
        meta: {
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        },
      },
      {
        accessorFn: (row) => row.recentlyActivity,
        id: 'recentlyActivity',
        header: ({ column }) => <DataGridColumnHeader title='Recent activity' column={column} />,
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          headerTitle: 'Recent activity',
          headerClassName: 'min-w-[165px]',
          cellClassName: 'text-gray-700 font-normal'
        },
      },
      // Three dots menu column - commented out to hide from UI
      /* {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: () => (
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {DropdownCard1()}
            </MenuItem>
          </Menu>
        ),
        meta: {
          headerClassName: 'w-[60px]',
        },
      }, */
    ],
    [isRTL]
  );

  // State for team members data
  const [teamMembers, setTeamMembers] = useState<IMembersData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize search term from localStorage if available
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem(storageFilterId) || '';
  });

  // Update localStorage whenever the search term changes
  useEffect(() => {
    localStorage.setItem(storageFilterId, searchTerm);
  }, [searchTerm]);

  // Transform API data to UI format
  const transformTeamMember = (member: TeamMember): IMembersData => {
    // Generate a consistent avatar based on user_id (with safety check)
    const userId = member.user_id || member.email || 'default';
    const avatarNumber = (parseInt(userId.replace(/-/g, '').replace(/[^0-9a-f]/gi, ''), 16) % 34) + 1;
    const avatar = `300-${avatarNumber}.png`;

    // Get role names from custom_roles (with safety check)
    const roles: string[] = [];
    if (member.custom_roles && Array.isArray(member.custom_roles) && member.custom_roles.length > 0) {
      member.custom_roles.forEach(cr => {
        if (cr && cr.role_name) {
          roles.push(cr.role_name);
        }
      });
    }
    // If no custom roles, use the base role
    if (roles.length === 0 && member.role) {
      roles.push(member.role);
    }
    // If no roles at all (no custom roles and no base role), show "None"
    if (roles.length === 0) {
      roles.push('None');
    }

    // Format recent activity
    const formatRecentActivity = (lastLogin: string | null) => {
      if (!lastLogin) return '-';
      const loginDate = new Date(lastLogin);
      const now = new Date();
      const diffMs = now.getTime() - loginDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return 'Current session';
      if (diffHours < 24) return `Today, ${loginDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      return 'Month ago';
    };

    // Determine status (simplified - you can enhance this based on your needs)
    const status = member.last_login ? {
      label: 'Active',
      variant: 'badge-success'
    } : {
      label: 'Pending',
      variant: 'badge-warning'
    };

    return {
      id: member.user_id || member.email || `user-${Date.now()}-${Math.random()}`,
      member: {
        avatar,
        name: `${member.first_name} ${member.last_name}`,
        tasks: '0', // API doesn't provide tasks count
        email: member.email
      },
      roles,
      location: {
        name: 'Unknown', // API doesn't provide location
        flag: 'united-states.svg'
      },
      status,
      recentlyActivity: formatRecentActivity(member.last_login)
    };
  };

  // Fetch team members from API
  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAdminCreatedUsers({
        page: currentPage,
        limit: 10
      });

      // Safety check: ensure users array exists and is valid
      if (!response.data || !response.data.users || !Array.isArray(response.data.users)) {
        console.error('Invalid API response structure:', response);
        toast.error('Invalid response from server');
        setTeamMembers([]);
        return;
      }

      const transformedData = response.data.users.map(transformTeamMember);

      setTeamMembers(transformedData);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, refreshTrigger]);

  // Listen for team member added event to refresh list
  useEffect(() => {
    const handleMemberAdded = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('teamMemberAdded', handleMemberAdded);
    return () => {
      window.removeEventListener('teamMemberAdded', handleMemberAdded);
    };
  }, []);

  // Filtered data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return teamMembers; // If no search term, return full data

    return teamMembers.filter(
      (member) =>
        member.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, teamMembers]);

  const handleRowSelection = (state: RowSelectionState, table?: any) => {
    setRowSelection(state);
    const selectedRowIds = Object.keys(state).filter(id => id && id !== '');

    if (selectedRowIds.length > 0) {
      // Get selected member names from filteredData by matching row IDs
      const selectedMembers = selectedRowIds
        .map(id => {
          const member = filteredData.find(row => row.id === id);
          return member?.member?.name;
        })
        .filter(Boolean);

      // Create user-friendly message
      const memberCount = selectedRowIds.length;
      const message = memberCount === 1
        ? '1 member selected'
        : `${memberCount} members selected`;

      // Show member names only if 3 or fewer, otherwise just show count
      const description = selectedMembers.length <= 3 && selectedMembers.length > 0
        ? selectedMembers.join(', ')
        : undefined;

      const toastId = toast(message, {
        ...(description && { description }),
        action: {
          label: 'Undo',
          onClick: () => {
            // Clear selection using table API
            if (table) {
              table.resetRowSelection();
            }
            setRowSelection({});
            toast.dismiss(toastId);
          }
        }
      });
    } else {
      setRowSelection({});
    }
  };

  const handleDeleteSelected = async () => {
    const selectedRowIds = Object.keys(rowSelection).filter(id => id !== undefined && id !== null && id !== '');

    if (selectedRowIds.length === 0) {
      toast.error('No members selected for deletion');
      return;
    }

    // Ensure we have a valid array with at least one ID
    if (!Array.isArray(selectedRowIds) || selectedRowIds.length === 0) {
      toast.error('Invalid selection. Please select at least one member to delete.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedRowIds.length} selected member(s)? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setIsLoading(true);

      // If only one member, use single delete endpoint
      if (selectedRowIds.length === 1) {
        const response = await deleteTeamMember(selectedRowIds[0]);

        if (response.status === 1) {
          toast.success(response.message || 'Successfully deleted member');
          setRowSelection({});
          setRefreshTrigger(prev => prev + 1);
        } else {
          toast.error(response.message || 'Failed to delete member');
        }
      } else {
        // Multiple members - use delete multiple endpoint
        const response = await deleteMultipleTeamMembers(selectedRowIds);

        if (response.status === 1) {
          toast.success(response.message || `Successfully deleted ${selectedRowIds.length} member(s)`);
          setRowSelection({});
          setRefreshTrigger(prev => prev + 1);
        } else {
          toast.error(response.message || 'Failed to delete members');
        }
      }
    } catch (error: any) {
      console.error('Error deleting members:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete members';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // TeamMembersToolbar extracted to top level

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-10">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading team members...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataGrid
      columns={columns}
      data={filteredData}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      getRowId={(row) => row.id || String(Math.random())}
      pagination={{ size: 10 }}
      sorting={[{ id: 'member', desc: false }]}
      toolbar={<TeamMembersToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCount={Object.keys(rowSelection).length} handleDeleteSelected={handleDeleteSelected} isLoading={isLoading} />}
      layout={{ card: true }}
    />
  );
};

export { Members };
