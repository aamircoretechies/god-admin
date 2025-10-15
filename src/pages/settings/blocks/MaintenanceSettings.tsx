import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Wrench, 
  Clock, 
  Settings,
  Save,
  Play,
  AlertTriangle
} from 'lucide-react';

const MaintenanceSettings = () => {
  return (
    <Card id="maintenance_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          System Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maintenance_window">Maintenance Window</Label>
            <Input 
              id="maintenance_window" 
              placeholder="Sunday 2:00 AM - 4:00 AM"
              defaultValue="Sunday 2:00 AM - 4:00 AM"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance_duration">Duration (hours)</Label>
            <Input 
              id="maintenance_duration" 
              type="number"
              placeholder="2"
              defaultValue="2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance_frequency">Frequency</Label>
            <Input 
              id="maintenance_frequency" 
              placeholder="Weekly"
              defaultValue="Weekly"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance_notice">Notice Period (hours)</Label>
            <Input 
              id="maintenance_notice" 
              type="number"
              placeholder="24"
              defaultValue="24"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Maintenance Tasks</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="database_optimization">Database Optimization</Label>
                <p className="text-sm text-gray-500">Optimize database performance</p>
              </div>
              <Switch id="database_optimization" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cache_cleanup">Cache Cleanup</Label>
                <p className="text-sm text-gray-500">Clean up expired cache entries</p>
              </div>
              <Switch id="cache_cleanup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log_rotation">Log Rotation</Label>
                <p className="text-sm text-gray-500">Rotate and compress log files</p>
              </div>
              <Switch id="log_rotation" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="temp_cleanup">Temp File Cleanup</Label>
                <p className="text-sm text-gray-500">Remove temporary files</p>
              </div>
              <Switch id="temp_cleanup" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Maintenance Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_maintenance">Auto Maintenance</Label>
                <p className="text-sm text-gray-500">Run maintenance automatically</p>
              </div>
              <Switch id="auto_maintenance" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Enable maintenance mode during tasks</p>
              </div>
              <Switch id="maintenance_mode" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user_notifications">User Notifications</Label>
                <p className="text-sm text-gray-500">Notify users about maintenance</p>
              </div>
              <Switch id="user_notifications" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Maintenance
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Schedule Maintenance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { MaintenanceSettings };
