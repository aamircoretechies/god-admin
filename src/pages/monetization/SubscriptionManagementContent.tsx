import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Edit, 
  Crown, 
  Users, 
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Types
interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: 'Free' | 'Premium';
  subscriptionStatus: 'Active' | 'Expired' | 'Trial' | 'Cancelled';
  startDate: string;
  endDate: string;
  planType: string;
  monthlyAmount: number;
  paymentMethod: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  trialEndDate?: string;
}

// Mock data
const mockUserSubscriptions: UserSubscription[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userAvatar: '/media/avatars/300-1.png',
    role: 'Premium',
    subscriptionStatus: 'Active',
    startDate: '2024-01-15T10:30:00Z',
    endDate: '2024-02-15T10:30:00Z',
    planType: 'Monthly Premium',
    monthlyAmount: 29.99,
    paymentMethod: 'Credit Card',
    lastPaymentDate: '2024-01-15T10:30:00Z',
    nextPaymentDate: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userAvatar: '/media/avatars/300-2.png',
    role: 'Free',
    subscriptionStatus: 'Trial',
    startDate: '2024-01-20T08:15:00Z',
    endDate: '2024-02-20T08:15:00Z',
    planType: 'Free Trial',
    monthlyAmount: 0,
    paymentMethod: 'N/A',
    lastPaymentDate: 'N/A',
    nextPaymentDate: 'N/A',
    trialEndDate: '2024-02-20T08:15:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    userAvatar: '/media/avatars/300-3.png',
    role: 'Premium',
    subscriptionStatus: 'Expired',
    startDate: '2023-12-01T14:20:00Z',
    endDate: '2024-01-01T14:20:00Z',
    planType: 'Monthly Premium',
    monthlyAmount: 29.99,
    paymentMethod: 'Credit Card',
    lastPaymentDate: '2023-12-01T14:20:00Z',
    nextPaymentDate: '2024-01-01T14:20:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    userAvatar: '/media/avatars/300-4.png',
    role: 'Premium',
    subscriptionStatus: 'Active',
    startDate: '2024-01-10T12:00:00Z',
    endDate: '2024-02-10T12:00:00Z',
    planType: 'Annual Premium',
    monthlyAmount: 24.99,
    paymentMethod: 'PayPal',
    lastPaymentDate: '2024-01-10T12:00:00Z',
    nextPaymentDate: '2024-02-10T12:00:00Z'
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'David Brown',
    userEmail: 'david@example.com',
    userAvatar: '/media/avatars/300-5.png',
    role: 'Free',
    subscriptionStatus: 'Active',
    startDate: '2024-01-05T09:30:00Z',
    endDate: 'N/A',
    planType: 'Free Plan',
    monthlyAmount: 0,
    paymentMethod: 'N/A',
    lastPaymentDate: 'N/A',
    nextPaymentDate: 'N/A'
  }
];

const SubscriptionManagementContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    return mockUserSubscriptions.filter(subscription => {
      const matchesSearch = 
        subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.planType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || subscription.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || subscription.subscriptionStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Trial':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Trial</Badge>;
      case 'Expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'Cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Premium':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Free':
        return <Badge variant="secondary">Free</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const columns = useMemo<ColumnDef<UserSubscription>[]>(
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
        accessorFn: (row: UserSubscription) => row,
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
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8">
              <AvatarImage src={row.original.userAvatar} />
              <AvatarFallback>{row.original.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link 
                to={`/network/user-table/user-detail/${row.original.userId}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
              >
                {row.original.userName}
              </Link>
              <span className="text-2sm text-gray-700 font-normal">
                {row.original.userEmail}
              </span>
              <Link 
                to={`/network/user-table/user-detail/${row.original.userId}`}
                className="text-xs text-primary hover:text-primary-active mt-1"
              >
                View Profile →
              </Link>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.role,
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getRoleBadge(row.original.role),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.subscriptionStatus,
        id: 'subscriptionStatus',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getStatusBadge(row.original.subscriptionStatus),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.planType,
        id: 'planType',
        header: ({ column }) => <DataGridColumnHeader title="Plan" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium">{row.original.planType}</p>
            <p className="text-xs text-gray-500">{formatCurrency(row.original.monthlyAmount)}/month</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.startDate,
        id: 'startDate',
        header: ({ column }) => <DataGridColumnHeader title="Start Date" column={column} />,
        enableSorting: true,
        cell: ({ row }) => formatDate(row.original.startDate),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.endDate,
        id: 'endDate',
        header: ({ column }) => <DataGridColumnHeader title="End Date" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{formatDate(row.original.endDate)}</p>
            {row.original.trialEndDate && (
              <p className="text-xs text-yellow-600">Trial: {formatDate(row.original.trialEndDate)}</p>
            )}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: UserSubscription) => row.nextPaymentDate,
        id: 'nextPayment',
        header: ({ column }) => <DataGridColumnHeader title="Next Payment" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{formatDate(row.original.nextPaymentDate)}</p>
            <p className="text-xs text-gray-500">{formatCurrency(row.original.monthlyAmount)}</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[140px]',
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
                <Link to={`/monetization/subscription-detail/${row.original.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Subscription
              </DropdownMenuItem>
              {row.original.role === 'Free' ? (
                <DropdownMenuItem>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Downgrade to Free
                </DropdownMenuItem>
              )}
              {row.original.subscriptionStatus === 'Active' && (
                <DropdownMenuItem>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Calendar className="w-4 h-4 mr-2" />
                Extend Subscription
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="w-4 h-4 mr-2" />
                View Payment History
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
    console.log(`Selected ${selectedRowIds.length} subscriptions:`, selectedRowIds);
  };

  const Toolbar = () => (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, email, plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredSubscriptions.length} of {mockUserSubscriptions.length} subscriptions
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <DataGrid
      columns={columns}
      data={filteredSubscriptions}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'user', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { SubscriptionManagementContent };
