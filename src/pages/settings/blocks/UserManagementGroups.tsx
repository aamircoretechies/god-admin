import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  UserPlus, 
  Settings,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

const UserManagementGroups = () => {
  return (
    <Card id="user_management_groups">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">User Groups</h4>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Administrators</h5>
                <p className="text-sm text-gray-500">5 members • Full system access</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Manage</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Content Editors</h5>
                <p className="text-sm text-gray-500">12 members • Content management</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Manage</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Moderators</h5>
                <p className="text-sm text-gray-500">8 members • Content moderation</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Manage</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Viewers</h5>
                <p className="text-sm text-gray-500">150 members • Read-only access</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Manage</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Group Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_assign">Auto-assign New Users</Label>
                <p className="text-sm text-gray-500">Automatically assign new users to default group</p>
              </div>
              <Switch id="auto_assign" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="group_permissions">Inherit Group Permissions</Label>
                <p className="text-sm text-gray-500">Users inherit permissions from their groups</p>
              </div>
              <Switch id="group_permissions" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Users
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementGroups };
