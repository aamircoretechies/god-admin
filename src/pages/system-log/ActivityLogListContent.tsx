import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid
} from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { toAbsoluteUrl, getUploadedFileUrl } from '@/utils';
import { debounce } from '@/lib/helpers';
import {
  blockUser,
  fetchActivityLogs,
  suspendUser,
  type ActivityLogResponse
} from '@/services/activityLogsApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  Eye,
  AlertTriangle,
  Shield,
  UserX,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'Free' | 'Premium' | 'Admin' | 'Moderator' | 'FREE' | 'PREMIUM' | 'ADMIN' | 'MODERATOR';
  activityType: string;
  details: string;
  bookReference?: string;
  chapterReference?: string;
  verseReference?: string;
  queryText?: string;
  device: string;
  platform: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  status: 'Success' | 'Error' | 'Warning';
  errorMessage?: string | null;
  sessionId: string;
  location?: string | null;
}

// Transform API response to component format
const transformActivityLog = (apiData: ActivityLogResponse): UserActivityLog => {
  // Use real avatar if available, otherwise fallback to random
  const userAvatar = apiData.user.profile_picture
    ? getUploadedFileUrl(apiData.user.profile_picture)
    : `/media/avatars/300-${(parseInt(apiData.user.userId.replace(/-/g, ''), 16) % 34) + 1}.png`;

  // Map role from API format to component format
  const mapRole = (role: string): UserActivityLog['userRole'] => {
    const roleMap: { [key: string]: UserActivityLog['userRole'] } = {
      FREE: 'Free',
      PREMIUM: 'Premium',
      ADMIN: 'Admin',
      MODERATOR: 'Moderator'
    };
    return roleMap[role] || (role as UserActivityLog['userRole']);
  };

  // Parse verse reference if available
  let bookReference: string | undefined;
  let chapterReference: string | undefined;
  let verseReference: string | undefined;

  if (apiData.verseReference) {
    // Try to parse "John 3:16" format
    const match = apiData.verseReference.match(/^(\w+)\s+(\d+):(\d+)$/);
    if (match) {
      bookReference = match[1];
      chapterReference = match[2];
      verseReference = match[3];
    } else {
      verseReference = apiData.verseReference;
    }
  }

  return {
    id: apiData.log_id,
    userId: apiData.user.userId,
    userName: apiData.user.name,
    userEmail: apiData.user.email,
    userAvatar: userAvatar,
    userRole: mapRole(apiData.user.role),
    activityType: apiData.activityType,
    details: apiData.details,
    bookReference: bookReference,
    chapterReference: chapterReference,
    verseReference: verseReference || apiData.verseReference || undefined,
    device: apiData.device,
    platform: apiData.device, // Use device as platform since API doesn't provide separate platform
    ipAddress: apiData.ipAddress,
    timestamp: apiData.dateTime,
    status: apiData.status as 'Success' | 'Error' | 'Warning',
    errorMessage: apiData.errorMessage || undefined,
    sessionId: apiData.sessionId,
    location: apiData.location || undefined
  };
};

interface ToolbarContentProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (value: string) => void;
}

// Toolbar component moved outside to prevent recreation on every render
const ToolbarContent = ({
  searchTerm,
  setSearchTerm,
  userFilter,
  setUserFilter,
  statusFilter,
  setStatusFilter,
  dateRangeFilter,
  setDateRangeFilter
}: ToolbarContentProps) => {
  const { table, totalRows } = useDataGrid();
  // Get the actual number of rows on the current page
  const currentPageRows = table.getRowModel().rows.length;

  // Local state for the search input to prevent immediate parent re-renders and focus loss
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sync local state with external searchTerm prop (e.g. if cleared externally)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search update
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [setSearchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, activity, verse reference, query..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Users</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Error">Error</option>
            <option value="Warning">Warning</option>
          </select>
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm text-gray-600">
            Showing {currentPageRows} of {totalRows} activities
          </span>
        </div>
      </div>
    </div>
  );
};

export const ActivityLogListContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MODALS STATE
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // FORM INPUTS
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');

  // SELECTED USER
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Track blocked users locally (Set of userIds that are blocked)
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());

  // Fetch activity logs from API with filters
  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build API params from filters
        const apiParams: {
          page?: number;
          limit?: number;
          activityType?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
          search?: string;
        } = {
          limit: 1000 // Get more records for client-side filtering if needed
        };

        // Map activity type filter
        if (activityTypeFilter !== 'all') {
          apiParams.activityType = activityTypeFilter;
        }

        // Map status filter
        if (statusFilter !== 'all') {
          apiParams.status = statusFilter;
        }

        // Map date range filter
        if (dateRangeFilter !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          let startDate: Date;

          switch (dateRangeFilter) {
            case 'today':
              startDate = today;
              break;
            case 'week':
              startDate = new Date(today);
              startDate.setDate(startDate.getDate() - 7);
              break;
            case 'month':
              startDate = new Date(today);
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case 'year':
              startDate = new Date(today);
              startDate.setFullYear(startDate.getFullYear() - 1);
              break;
            default:
              startDate = today;
          }
          apiParams.startDate = startDate.toISOString();
          apiParams.endDate = now.toISOString();
        }

        // Map search term
        if (searchTerm) {
          apiParams.search = searchTerm;
        }

        const response = await fetchActivityLogs(apiParams);
        if (response.status === 1 && response.data) {
          let transformedLogs = response.data.map(transformActivityLog);

          // Apply user role filter on client side (since API doesn't support it directly)
          if (userFilter !== 'all') {
            transformedLogs = transformedLogs.filter((log) => {
              const normalizedLogRole = log.userRole.toUpperCase();
              const normalizedFilterRole = userFilter.toUpperCase();
              // Map both formats
              const roleMap: { [key: string]: string[] } = {
                'FREE': ['FREE'],
                'PREMIUM': ['PREMIUM'],
                'ADMIN': ['ADMIN'],
                'MODERATOR': ['MODERATOR']
              };
              const filterRoles = roleMap[normalizedFilterRole] || [normalizedFilterRole];
              return filterRoles.includes(normalizedLogRole);
            });
          }

          setActivityLogs(transformedLogs);
        } else {
          setError(response.message || 'Failed to load activity logs');
        }
      } catch (err: any) {
        console.error('Error loading activity logs:', err);
        setError(err?.message || 'Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    loadActivityLogs();
  }, [activityTypeFilter, statusFilter, dateRangeFilter, searchTerm, userFilter]);

  // Filter logs (now mostly done server-side, but keep for any remaining client-side filtering)
  const filteredLogs = useMemo(() => {
    // Since we're applying most filters server-side, just return the logs
    // Only apply additional client-side filtering if needed
    return activityLogs;
  }, [activityLogs]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case 'Error':
        return <Badge variant="destructive">Error</Badge>;
      case 'Warning':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case 'FREE':
        return <Badge variant="outline" className="inline-flex w-fit">Free</Badge>;
      case 'PREMIUM':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800 inline-flex w-fit">
            Premium
          </Badge>
        );
      case 'ADMIN':
        return <Badge variant="destructive" className="inline-flex w-fit">Admin</Badge>;
      case 'MODERATOR':
        return (
          <Badge variant="default" className="bg-amber-100 text-amber-800 inline-flex w-fit">
            Moderator
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getActivityTypeBadge = (type: string) => {
    const colors = {
      'Verse Read': 'bg-amber-100 text-amber-800',
      'AI Query': 'bg-purple-100 text-purple-800',
      Bookmark: 'bg-green-100 text-green-800',
      Share: 'bg-orange-100 text-orange-800',
      'Feedback Submitted': 'bg-pink-100 text-pink-800',
      Login: 'bg-gray-100 text-gray-800',
      Logout: 'bg-gray-100 text-gray-800',
      'Password Change': 'bg-red-100 text-red-800',
      'Profile Update': 'bg-indigo-100 text-indigo-800'
    };

    return (
      <Badge
        variant="default"
        className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}
      >
        {type}
      </Badge>
    );
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile iOS':
      case 'Mobile Android':
        return <Smartphone className="w-4 h-4" />;
      case 'Web Desktop':
      case 'Web Mobile':
        return <Monitor className="w-4 h-4" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ColumnInputFilter = <TData, TValue>({ column }: any) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<UserActivityLog>[]>(
    () => [
      // {
      //   accessorKey: 'id',
      //   header: () => <DataGridRowSelectAll />,
      //   cell: ({ row }) => <DataGridRowSelect row={row} />,
      //   enableSorting: false,
      //   enableHiding: false,
      //   meta: {
      //     headerClassName: 'w-12'
      //   }
      // },
      {
        accessorFn: (row: UserActivityLog) => row,
        id: 'user',
        // header: ({ column }) => (
        //   <DataGridColumnHeader
        //     title="User"
        //     filter={<ColumnInputFilter column={column} />}
        //     column={column}
        //   />
        // ),
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">User</span>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <img
                src={row.original.userAvatar.startsWith('http') ? row.original.userAvatar : toAbsoluteUrl(row.original.userAvatar)}
                alt={row.original.userName}
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
            <div className="flex flex-col">
              <Link
                to={`/system-log/user/${row.original.userId}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-active"
              >
                {row.original.userName}
              </Link>
              <span className="text-xs text-gray-500">{row.original.userEmail}</span>
              {getRoleBadge(row.original.userRole)}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserActivityLog) => row.activityType,
        id: 'activityType',
        // header: ({ column }) => <DataGridColumnHeader title="Activity Type" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Activity Type</span>
        ),
        enableSorting: true,
        cell: ({ row }) => getActivityTypeBadge(row.original.activityType),
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserActivityLog) => row.details,
        id: 'details',
        // header: ({ column }) => (
        //   <DataGridColumnHeader
        //     title="Details"
        //     filter={<ColumnInputFilter column={column} />}
        //     column={column}
        //   />
        // ),
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Details</span>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 truncate">{row.original.details}</p>
            {row.original.queryText && (
              <p className="text-xs text-gray-500 truncate">"{row.original.queryText}"</p>
            )}
            {row.original.bookReference && (
              <p className="text-xs text-amber-600">
                {row.original.bookReference} {row.original.chapterReference}:
                {row.original.verseReference}
              </p>
            )}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserActivityLog) => row.device,
        id: 'device',
        // header: ({ column }) => <DataGridColumnHeader title="Device" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Device</span>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {getDeviceIcon(row.original.device)}
            <span className="text-sm">{row.original.device}</span>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserActivityLog) => row.timestamp,
        id: 'timestamp',
        // header: ({ column }) => <DataGridColumnHeader title="Date & Time" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Time Stamp</span>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{formatDate(row.original.timestamp)}</p>
            <p className="text-xs text-gray-500">{row.original.location}</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserActivityLog) => row.status,
        id: 'status',
        // header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Status</span>
        ),
        enableSorting: true,
        cell: ({ row }) => getStatusBadge(row.original.status),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        // header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Actions</span>
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/system-log/user/${row.original.userId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View User Activity
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag Activity
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUserId(row.original.userId);
                  setShowBlockModal(true);
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                {blockedUsers.has(row.original.userId) ? 'Unblock User' : 'Block User'}
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <UserX className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUserId(row.original.userId);
                  setShowSuspendModal(true);
                }}
              >
                <UserX className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        meta: {
          headerClassName: 'w-40',
          cellClassName: 'text-gray-800 font-medium'
        }
      }
    ],
    [blockedUsers]
  );

  const handleRowSelection = (state: any) => {
    const selectedRowIds = Object.keys(state);
    console.log(`Selected ${selectedRowIds.length} logs:`, selectedRowIds);
  };

  const handleBlockUser = async () => {
    try {
      const res = await blockUser(selectedUserId!, reason, duration);

      if (res.status === 1) {
        // Toggle blocked status for this user
        setBlockedUsers((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(selectedUserId!)) {
            newSet.delete(selectedUserId!);
            toast.success('User unblocked successfully!');
          } else {
            newSet.add(selectedUserId!);
            toast.success('User blocked successfully!');
          }
          return newSet;
        });
        setShowBlockModal(false);
        setReason('');
        setDuration('');
      } else {
        toast.error(res.message || 'Failed to block user');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error blocking user');
    }
  };

  const handleSuspendUser = async () => {
    try {
      const res = await suspendUser(selectedUserId!, reason, duration);

      if (res.status === 1) {
        toast.success('User suspended successfully!');
        setShowSuspendModal(false);
        setReason('');
        setDuration('');
      } else {
        toast.error(res.message || 'Failed to suspend user');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error suspending user');
    }
  };

  const toolbar = (
    <ToolbarContent
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      userFilter={userFilter}
      setUserFilter={setUserFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      dateRangeFilter={dateRangeFilter}
      setDateRangeFilter={setDateRangeFilter}
    />
  );

  return (
    <div className="[&_[data-container]]:overflow-y-auto [&_[data-container]]:max-h-[calc(100vh-250px)]">
      {loading && activityLogs.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Loading activity logs...</p>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      ) : (
        <>
          {showBlockModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              {/* <div className="bg-white p-6 rounded-lg w-[400px] space-y-4"> */}
              <div className="bg-white p-6 rounded-lg w-full max-w-[400px] mx-4 space-y-4">
                <h2 className="text-lg font-semibold">
                  {selectedUserId && blockedUsers.has(selectedUserId) ? 'Unblock User' : 'Block User'}
                </h2>

                <input
                  type="text"
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Duration (e.g., 1 day)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                  <button className="btn btn-sm btn-light" onClick={() => setShowBlockModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-sm btn-danger" onClick={handleBlockUser}>
                    {selectedUserId && blockedUsers.has(selectedUserId) ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSuspendModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              {/* <div className="bg-white p-6 rounded-lg w-[400px] space-y-4"> */}
              <div className="bg-white p-6 rounded-lg w-full max-w-[400px] mx-4 space-y-4">
                <h2 className="text-lg font-semibold">Suspend User</h2>

                <input
                  type="text"
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Duration (e.g., 7 days)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                  <button className="btn btn-sm btn-light" onClick={() => setShowSuspendModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-sm btn-warning" onClick={handleSuspendUser}>
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          )}

          <DataGrid
            columns={columns}
            data={filteredLogs}
            rowSelection={true}
            onRowSelectionChange={handleRowSelection}
            pagination={{ size: 10 }}
            sorting={[{ id: 'timestamp', desc: true }]}
            toolbar={toolbar}
            layout={{ card: true }}
          />
        </>
      )}
    </div>
  );
};


