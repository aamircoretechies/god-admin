import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye,
  Save,
  CheckSquare,
  Square
} from 'lucide-react';

const UserManagementPermissions = () => {
  return (
    <Card id="user_management_permissions">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Permissions Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Permissions</h4>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">User Management</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create Users</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edit Users</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete Users</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">View User List</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">Content Management</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create Content</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edit Content</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete Content</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Publish Content</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">System Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">View Settings</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edit Settings</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Logs</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup/Restore</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Permissions
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Select All
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementPermissions };
