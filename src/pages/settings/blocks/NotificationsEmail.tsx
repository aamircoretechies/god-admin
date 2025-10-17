import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Send, 
  Settings,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const NotificationsEmail = () => {
  return (
    <Card id="notifications_email">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase 1 Notification Preferences - Optional Phase 1 */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Optional Phase 1 Feature</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Email notifications are optional for Phase 1. Configure if needed.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Notification Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system_emails">System Emails</Label>
                  <p className="text-sm text-gray-500">Receive system-generated emails</p>
                </div>
                <Switch id="system_emails" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alerts">Alerts</Label>
                  <p className="text-sm text-gray-500">Receive alert notifications</p>
                </div>
                <Switch id="alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance_notices">Maintenance Notices</Label>
                  <p className="text-sm text-gray-500">Receive maintenance notifications</p>
                </div>
                <Switch id="maintenance_notices" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Email
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { NotificationsEmail };
