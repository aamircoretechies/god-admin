import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Lock, 
  Shield, 
  Users,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

const UserManagementAccessControl = () => {
  return (
    <Card id="user_management_access_control">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Access Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">IP Whitelist</h4>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add IP
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">192.168.1.100</span>
                <p className="text-sm text-gray-500">Office Network</p>
              </div>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">10.0.0.50</span>
                <p className="text-sm text-gray-500">Development Server</p>
              </div>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Access Restrictions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip_restriction">IP Restriction</Label>
                <p className="text-sm text-gray-500">Only allow access from whitelisted IPs</p>
              </div>
              <Switch id="ip_restriction" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="time_restriction">Time Restriction</Label>
                <p className="text-sm text-gray-500">Restrict access to specific hours</p>
              </div>
              <Switch id="time_restriction" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="geographic_restriction">Geographic Restriction</Label>
                <p className="text-sm text-gray-500">Restrict access by country/region</p>
              </div>
              <Switch id="geographic_restriction" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Test Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { UserManagementAccessControl };
