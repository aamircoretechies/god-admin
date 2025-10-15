import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  Settings,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const NotificationsSystemAlerts = () => {
  return (
    <Card id="notifications_system_alerts">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Alert Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security_alerts">Security Alerts</Label>
                <p className="text-sm text-gray-500">Notify about security incidents</p>
              </div>
              <Switch id="security_alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="performance_alerts">Performance Alerts</Label>
                <p className="text-sm text-gray-500">Notify about system performance issues</p>
              </div>
              <Switch id="performance_alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="error_alerts">Error Alerts</Label>
                <p className="text-sm text-gray-500">Notify about system errors</p>
              </div>
              <Switch id="error_alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_alerts">Maintenance Alerts</Label>
                <p className="text-sm text-gray-500">Notify about scheduled maintenance</p>
              </div>
              <Switch id="maintenance_alerts" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Alert Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="alert_threshold">Alert Threshold</Label>
              <Input 
                id="alert_threshold" 
                type="number"
                placeholder="5"
                defaultValue="5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert_cooldown">Alert Cooldown (minutes)</Label>
              <Input 
                id="alert_cooldown" 
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Notification Channels</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_alerts">Email Alerts</Label>
                <p className="text-sm text-gray-500">Send alerts via email</p>
              </div>
              <Switch id="email_alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms_alerts">SMS Alerts</Label>
                <p className="text-sm text-gray-500">Send alerts via SMS</p>
              </div>
              <Switch id="sms_alerts" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="webhook_alerts">Webhook Alerts</Label>
                <p className="text-sm text-gray-500">Send alerts to webhook endpoints</p>
              </div>
              <Switch id="webhook_alerts" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dashboard_alerts">Dashboard Alerts</Label>
                <p className="text-sm text-gray-500">Show alerts in admin dashboard</p>
              </div>
              <Switch id="dashboard_alerts" defaultChecked />
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
            Test Alert
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

export { NotificationsSystemAlerts };
