import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toAbsoluteUrl } from '@/utils';
import { 
  Users, 
  BookOpen, 
  Search, 
  Filter,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Bell,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: 'new' | 'premium' | 'active' | 'inactive';
  assignedPlans: string[];
  lastActive: string;
}

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  assignedUsers: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/media/avatars/300-1.png',
    userType: 'premium',
    assignedPlans: ['1', '2'],
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/media/avatars/300-2.png',
    userType: 'new',
    assignedPlans: [],
    lastActive: '2024-01-19'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: '/media/avatars/300-3.png',
    userType: 'active',
    assignedPlans: ['1'],
    lastActive: '2024-01-21'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: '/media/avatars/300-4.png',
    userType: 'inactive',
    assignedPlans: ['2'],
    lastActive: '2024-01-15'
  }
];

const mockReadingPlans: ReadingPlan[] = [
  {
    id: '1',
    title: '30-Day New Testament',
    description: 'Complete journey through the New Testament in 30 days',
    status: 'active',
    assignedUsers: 1250
  },
  {
    id: '2',
    title: 'Psalms in 7 Days',
    description: 'Deep dive into the book of Psalms',
    status: 'active',
    assignedUsers: 890
  },
  {
    id: '3',
    title: 'Gospel of John Study',
    description: 'In-depth study of the Gospel of John',
    status: 'active',
    assignedUsers: 650
  }
];

const ReadingPlanAssignPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [readingPlans] = useState<ReadingPlan[]>(mockReadingPlans);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAssign = () => {
    if (!selectedPlan || selectedUsers.length === 0) return;

    setUsers(users.map(user => {
      if (selectedUsers.includes(user.id)) {
        return {
          ...user,
          assignedPlans: [...user.assignedPlans, selectedPlan]
        };
      }
      return user;
    }));

    setSelectedUsers([]);
    setSelectedPlan('');
    setShowBulkAssign(false);
  };

  const handleRemoveAssignment = (userId: string, planId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          assignedPlans: user.assignedPlans.filter(id => id !== planId)
        };
      }
      return user;
    }));
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedPlanTitle = (planId: string) => {
    const plan = readingPlans.find(p => p.id === planId);
    return plan?.title || 'Unknown Plan';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assign Reading Plans</h1>
          <p className="text-gray-600 mt-2">Manage user assignments to reading plans</p>
        </div>
        <Button 
          onClick={() => setShowBulkAssign(true)} 
          className="bg-primary hover:bg-primary-dark"
          disabled={selectedUsers.length === 0}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Bulk Assign ({selectedUsers.length})
        </Button>
      </div>

      {/* Bulk Assignment Modal */}
      {showBulkAssign && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Bulk Assign Reading Plan
              </span>
              <Button variant="outline" size="sm" onClick={() => setShowBulkAssign(false)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Reading Plan
                </label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reading plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {readingPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Selected Users: {selectedUsers.length}
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center space-x-2 text-sm">
                        <img src={toAbsoluteUrl(user?.avatar || '')} alt={user?.name} className="w-6 h-6 rounded-full" />
                        <span>{user?.name}</span>
                        <span className="text-gray-500">({user?.email})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowBulkAssign(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkAssign} 
                  className="bg-primary hover:bg-primary-dark"
                  disabled={!selectedPlan}
                >
                  Assign Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select All ({filteredUsers.length})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                    />
                    <img src={toAbsoluteUrl(user.avatar)} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUserTypeColor(user.userType)}>
                      {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last active: {user.lastActive}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Assigned Plans:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.assignedPlans.length > 0 ? (
                      user.assignedPlans.map((planId) => (
                        <Badge key={planId} variant="secondary" className="flex items-center space-x-1">
                          <span>{getAssignedPlanTitle(planId)}</span>
                          <button
                            onClick={() => handleRemoveAssignment(user.id, planId)}
                            className="ml-1 hover:text-red-600"
                          >
                            <UserX className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No plans assigned</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3 pt-3 border-t">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-1" />
                    Notify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Plans Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Reading Plans Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {readingPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                  <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{plan.assignedUsers} users</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ReadingPlanAssignPage }; 