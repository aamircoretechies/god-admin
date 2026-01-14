import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';
import { Members } from './blocks';
import { UserManagementMembers, UserManagementRoles } from '../../../settings/blocks';

const AccountTeamMembersContent = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Tabs Navigation */}
      <div className="card">
        <div className="card-header border-b-0">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'members' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('members')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Team Members
            </Button>
            <Button
              variant={activeTab === 'roles' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('roles')}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Roles & Permissions
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <div className="grid gap-5 lg:gap-7.5">
          <Members />
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5"></div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid gap-5 lg:gap-7.5">
          <UserManagementMembers />
          <UserManagementRoles />
        </div>
      )}
    </div>
  );
};

export { AccountTeamMembersContent };
