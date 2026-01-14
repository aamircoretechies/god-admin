import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, MoreVertical, Edit, Trash2, Mail, AlertCircle } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import { AddExistingUserModal } from './AddExistingUserModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteTeamMember } from '@/services/usersApi';
import { fetchTeamMembers, type TeamMember } from '@/services/dashboardApi';
import { toast } from 'sonner';
import { usePermission } from '@/utils/permissions';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'moderator' | 'member' | 'editor';
  status: 'active' | 'inactive';
  lastActive: string;
}

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
  const canView = usePermission('team_members', 'view');
  const canCreate = usePermission('team_members', 'create');
  const canDelete = usePermission('team_members', 'delete');

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchTeamMembers();
        if (response.status === 1 && response.data) {
          // Transform API data to component format
          const transformedMembers: Member[] = response.data.map((member: TeamMember) => {
            // Parse name into first and last name
            const nameParts = member.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            return {
              id: member.id,
              firstName,
              lastName,
              email: member.email,
              role: (member.role?.toLowerCase() || 'member') as 'admin' | 'moderator' | 'member' | 'editor',
              status: (member.status?.toLowerCase() || 'inactive') as 'active' | 'inactive',
              lastActive: 'N/A' // API doesn't provide lastActive, could be enhanced later
            };
          });
          setMembers(transformedMembers);
        } else {
          setError(response.message || 'Failed to load team members');
        }
      } catch (err: any) {
        console.error('Error loading team members:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const response = await deleteTeamMember(memberId);
      if (response.status === 1) {
        toast.success('Team member removed successfully');
        // Reload members
        const updatedResponse = await fetchTeamMembers();
        if (updatedResponse.status === 1 && updatedResponse.data) {
          const transformedMembers: Member[] = updatedResponse.data.map((member: TeamMember) => {
            const nameParts = member.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            return {
              id: member.id,
              firstName,
              lastName,
              email: member.email,
              role: (member.role?.toLowerCase() || 'member') as 'admin' | 'moderator' | 'member' | 'editor',
              status: (member.status?.toLowerCase() || 'inactive') as 'active' | 'inactive',
              lastActive: 'N/A'
            };
          });
          setMembers(transformedMembers);
        }
      } else {
        toast.error(response.message || 'Failed to remove team member');
      }
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to remove team member';
      
      if (err?.response?.status === 403 || errorMessage.toLowerCase().includes('forbidden') || errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('You are not authorized to remove team members. Please contact a super admin.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <Card id="user_management_members">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && members.length === 0) {
    return (
      <Card id="user_management_members">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="user_management_members">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
                 <div className="flex items-center gap-2">
                   {canCreate && (
                     <AddMemberModal
                       trigger={
                         <Button size="sm" className="btn btn-sm btn-primary">
                           <UserPlus className="w-4 h-4 mr-2" />
                           Add Member
                         </Button>
                       }
                       onMemberAdded={async () => {
              // Reload members after adding
              const response = await fetchTeamMembers();
              if (response.status === 1 && response.data) {
                const transformedMembers: Member[] = response.data.map((member: TeamMember) => {
                  const nameParts = member.name.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';
                  
                  return {
                    id: member.id,
                    firstName,
                    lastName,
                    email: member.email,
                    role: (member.role?.toLowerCase() || 'member') as 'admin' | 'moderator' | 'member' | 'editor',
                    status: (member.status?.toLowerCase() || 'inactive') as 'active' | 'inactive',
                    lastActive: 'N/A'
                  };
                });
                setMembers(transformedMembers);
              }
            }}
          />
                   )}
                   {canCreate && (
                     <AddExistingUserModal
                       onMemberAdded={async () => {
              // Reload members after adding
              const response = await fetchTeamMembers();
              if (response.status === 1 && response.data) {
                const transformedMembers: Member[] = response.data.map((member: TeamMember) => {
                  const nameParts = member.name.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';
                  
                  return {
                    id: member.id,
                    firstName,
                    lastName,
                    email: member.email,
                    role: (member.role?.toLowerCase() || 'member') as 'admin' | 'moderator' | 'member' | 'editor',
                    status: (member.status?.toLowerCase() || 'inactive') as 'active' | 'inactive',
                    lastActive: 'N/A'
                  };
                });
                setMembers(transformedMembers);
              }
            }}
          />
                   )}
        </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No team members found</p>
            </div>
          ) : (
            members.map((member) => (
              <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {member.firstName[0]}
                    {member.lastName[0]}
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
                  <p className="text-xs text-gray-400 mt-1">Last active: {member.lastActive}</p>
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
                           <DropdownMenuItem 
                             className="text-red-600"
                             onClick={() => handleDeleteMember(member.id)}
                             disabled={!canDelete}
                             title={!canDelete ? 'You do not have permission to delete team members' : ''}
                           >
                             <Trash2 className="w-4 h-4 mr-2" />
                             Remove Member
                           </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementMembers };
