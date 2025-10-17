import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { toAbsoluteUrl } from '@/utils';
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

// Types
interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'Free' | 'Premium' | 'Admin' | 'Moderator';
  activityType: 'Verse Read' | 'AI Query' | 'Bookmark' | 'Share' | 'Feedback Submitted' | 'Login' | 'Logout' | 'Password Change' | 'Profile Update';
  details: string;
  bookReference?: string;
  chapterReference?: string;
  verseReference?: string;
  queryText?: string;
  device: 'Mobile iOS' | 'Mobile Android' | 'Web Desktop' | 'Web Mobile' | 'Tablet';
  platform: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'Success' | 'Error' | 'Warning';
  errorMessage?: string;
  sessionId: string;
  location?: string;
}

// Mock data
const mockActivityLogs: UserActivityLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userAvatar: '/media/avatars/300-1.png',
    userRole: 'Premium',
    activityType: 'Verse Read',
    details: 'Read John 3:16',
    bookReference: 'John',
    chapterReference: '3',
    verseReference: '16',
    device: 'Mobile iOS',
    platform: 'iOS 17.2',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)',
    timestamp: '2024-01-21T14:30:00Z',
    status: 'Success',
    sessionId: 'sess_123456',
    location: 'New York, US'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    userAvatar: '/media/avatars/300-2.png',
    userRole: 'Free',
    activityType: 'AI Query',
    details: 'Asked about the meaning of love in 1 Corinthians 13',
    queryText: 'What does 1 Corinthians 13 say about love?',
    device: 'Web Desktop',
    platform: 'Chrome 120.0',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-01-21T14:25:00Z',
    status: 'Success',
    sessionId: 'sess_123457',
    location: 'Los Angeles, US'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@example.com',
    userAvatar: '/media/avatars/300-3.png',
    userRole: 'Admin',
    activityType: 'Login',
    details: 'Successful login',
    device: 'Web Desktop',
    platform: 'Firefox 121.0',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-01-21T14:20:00Z',
    status: 'Success',
    sessionId: 'sess_123458',
    location: 'Chicago, US'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Sarah Wilson',
    userEmail: 'sarah.wilson@example.com',
    userAvatar: '/media/avatars/300-4.png',
    userRole: 'Premium',
    activityType: 'Bookmark',
    details: 'Bookmarked Psalm 23',
    bookReference: 'Psalms',
    chapterReference: '23',
    device: 'Mobile Android',
    platform: 'Android 14',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-G991B)',
    timestamp: '2024-01-21T14:15:00Z',
    status: 'Success',
    sessionId: 'sess_123459',
    location: 'Miami, US'
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'David Brown',
    userEmail: 'david.brown@example.com',
    userAvatar: '/media/avatars/300-5.png',
    userRole: 'Free',
    activityType: 'AI Query',
    details: 'Failed AI query due to rate limit',
    queryText: 'Explain the book of Revelation',
    device: 'Web Mobile',
    platform: 'Safari Mobile',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)',
    timestamp: '2024-01-21T14:10:00Z',
    status: 'Error',
    errorMessage: 'Rate limit exceeded. Please try again in 1 minute.',
    sessionId: 'sess_123460',
    location: 'Seattle, US'
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Emily Davis',
    userEmail: 'emily.davis@example.com',
    userAvatar: '/media/avatars/300-6.png',
    userRole: 'Moderator',
    activityType: 'Feedback Submitted',
    details: 'Submitted feedback about AI explanations',
    device: 'Tablet',
    platform: 'iPadOS 17.2',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X)',
    timestamp: '2024-01-21T14:05:00Z',
    status: 'Success',
    sessionId: 'sess_123461',
    location: 'Boston, US'
  }
];

const ActivityLogListContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter(log => {
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.queryText && log.queryText.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.bookReference && log.bookReference.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUser = userFilter === 'all' || log.userRole === userFilter;
      const matchesActivityType = activityTypeFilter === 'all' || log.activityType === activityTypeFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      return matchesSearch && matchesUser && matchesActivityType && matchesStatus;
    });
  }, [searchTerm, userFilter, activityTypeFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'Error':
        return <Badge variant="destructive">Error</Badge>;
      case 'Warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Free':
        return <Badge variant="secondary">Free</Badge>;
      case 'Premium':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'Moderator':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">Moderator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getActivityTypeBadge = (type: string) => {
    const colors = {
      'Verse Read': 'bg-amber-100 text-amber-800',
      'AI Query': 'bg-purple-100 text-purple-800',
      'Bookmark': 'bg-green-100 text-green-800',
      'Share': 'bg-orange-100 text-orange-800',
      'Feedback Submitted': 'bg-pink-100 text-pink-800',
      'Login': 'bg-gray-100 text-gray-800',
      'Logout': 'bg-gray-100 text-gray-800',
      'Password Change': 'bg-red-100 text-red-800',
      'Profile Update': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge variant="default" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
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
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-12'
        }
      },
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
                {row.original.bookReference} {row.original.chapterReference}:{row.original.verseReference}
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
              <DropdownMenuItem>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag Activity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem>
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

  const Toolbar = () => (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, activity, verse reference, query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Error">Error</option>
            <option value="Warning">Warning</option>
          </select>
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {mockActivityLogs.length} activities
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <DataGrid
      columns={columns}
      data={filteredLogs}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'timestamp', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ActivityLogListContent };
