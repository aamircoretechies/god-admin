import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll
} from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { toAbsoluteUrl } from '@/utils';
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
  // Generate avatar from user ID
  const avatarNumber = (parseInt(apiData.user.userId.replace(/-/g, ''), 16) % 34) + 1;
  const userAvatar = `/media/avatars/300-${avatarNumber}.png`;

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

const ActivityLogListContent: React.FC = () => {
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

  // Fetch activity logs from API
  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchActivityLogs();
        if (response.status === 1 && response.data) {
          const transformedLogs = response.data.map(transformActivityLog);
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
  }, []);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.queryText && log.queryText.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.bookReference && log.bookReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.verseReference && log.verseReference.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUser =
        userFilter === 'all' ||
        log.userRole === userFilter ||
        log.userRole.toLowerCase() === userFilter.toLowerCase();
      const matchesActivityType =
        activityTypeFilter === 'all' || log.activityType === activityTypeFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      // Date range filter
      let matchesDateRange = true;
      if (dateRangeFilter !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (dateRangeFilter) {
          case 'today':
            matchesDateRange = logDate >= today;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDateRange = logDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDateRange = logDate >= monthAgo;
            break;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            matchesDateRange = logDate >= yearAgo;
            break;
        }
      }

      return (
        matchesSearch && matchesUser && matchesActivityType && matchesStatus && matchesDateRange
      );
    });
  }, [activityLogs, searchTerm, userFilter, activityTypeFilter, statusFilter, dateRangeFilter]);

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
        return <Badge variant="secondary">Free</Badge>;
      case 'PREMIUM':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Premium
          </Badge>
        );
      case 'ADMIN':
        return <Badge variant="destructive">Admin</Badge>;
      case 'MODERATOR':
        return (
          <Badge variant="default" className="bg-amber-100 text-amber-800">
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
        header: ({ column }) => (
          <DataGridColumnHeader
            title="User"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <img src={toAbsoluteUrl(row.original.userAvatar)} alt={row.original.userName} />
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
        header: ({ column }) => <DataGridColumnHeader title="Activity Type" column={column} />,
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
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Details"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
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
        header: ({ column }) => <DataGridColumnHeader title="Device" column={column} />,
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
        header: ({ column }) => <DataGridColumnHeader title="Date & Time" column={column} />,
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
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getStatusBadge(row.original.status),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
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
                Block User
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
    []
  );

  const handleRowSelection = (state: any) => {
    const selectedRowIds = Object.keys(state);
    console.log(`Selected ${selectedRowIds.length} logs:`, selectedRowIds);
  };

  const handleBlockUser = async () => {
    try {
      const res = await blockUser(selectedUserId!, reason, duration);

      if (res.status === 1) {
        toast.success('User blocked successfully!');
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
    // <div className="flex flex-col gap-4 p-5">
    <div className="flex flex-col gap-4 p-3 md:p-5">
      {/* <div className="flex items-center justify-between"> */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* <div className="flex items-center gap-4"> */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          {/* <div className="flex-1 relative"> */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, activity, verse reference, query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // className="pl-10 max-w-md"
              className="pl-10 w-full"
            />
          </div>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            // className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Users</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
          </select>
          <select
            value={activityTypeFilter}
            onChange={(e) => setActivityTypeFilter(e.target.value)}
            // className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Activities</option>
            <option value="Verse Read">Verse Read</option>
            <option value="AI Query">AI Query</option>
            <option value="Bookmark">Bookmark</option>
            <option value="Share">Share</option>
            <option value="Feedback Submitted">Feedback</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            // className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card"
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
            // className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card w-full md:w-auto"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        {/* <div className="flex items-center gap-2"> */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {activityLogs.length} activities
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* <div className="bg-white p-6 rounded-lg w-[400px] space-y-4"> */}
          <div className="bg-white p-6 rounded-lg w-full max-w-[400px] mx-4 space-y-4">
            <h2 className="text-lg font-semibold">Block User</h2>

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
                Block
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
  );
};

export { ActivityLogListContent };
