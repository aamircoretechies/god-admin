import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Mail
} from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'moderator' | 'member' | 'editor';
  status: 'active' | 'inactive';
  lastActive: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'moderator',
    status: 'active',
    lastActive: '2024-01-19'
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    role: 'editor',
    status: 'active',
    lastActive: '2024-01-18'
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    role: 'member',
    status: 'inactive',
    lastActive: '2024-01-15'
  }
];

const getRoleBadge = (role: string) => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-blue-100 text-blue-800',
    editor: 'bg-purple-100 text-purple-800',
    member: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  return status === 'active' ? (
    <Badge className="bg-green-100 text-green-800">Active</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  );
};

const UserManagementMembers = () => {
  return (
    <Card id="user_management_members">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
          <AddMemberModal
            trigger={
              <Button size="sm" className="btn btn-sm btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {member.firstName[0]}{member.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </h4>
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Last active: {member.lastActive}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Member
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementMembers };

