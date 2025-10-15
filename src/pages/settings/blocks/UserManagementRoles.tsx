import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Shield, 
  UserCheck,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

const UserManagementRoles = () => {
  return (
    <Card id="user_management_roles">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Roles Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Available Roles</h4>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Administrator</h5>
                <p className="text-sm text-gray-500">Full system access and control</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Moderator</h5>
                <p className="text-sm text-gray-500">Content moderation and user management</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Editor</h5>
                <p className="text-sm text-gray-500">Content creation and editing</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Viewer</h5>
                <p className="text-sm text-gray-500">Read-only access to content</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Assign Roles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementRoles };
