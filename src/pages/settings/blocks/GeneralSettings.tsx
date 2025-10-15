import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Globe, 
  Clock, 
  Languages,
  Save,
  RefreshCw
} from 'lucide-react';

const GeneralSettings = () => {
  return (
    <Card id="general_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="app_name">Application Name</Label>
            <Input 
              id="app_name" 
              placeholder="Enter application name"
              defaultValue="GrowOnDaily"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app_version">Application Version</Label>
            <Input 
              id="app_version" 
              placeholder="Version number"
              defaultValue="1.0.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Default Timezone</Label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <Input 
                id="timezone" 
                placeholder="Select timezone"
                defaultValue="UTC"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Default Language</Label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-400" />
              <Input 
                id="language" 
                placeholder="Select language"
                defaultValue="English"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domain">Domain URL</Label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <Input 
                id="domain" 
                placeholder="https://growondaily.com"
                defaultValue="https://growondaily.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin_email">Admin Email</Label>
            <Input 
              id="admin_email" 
              type="email"
              placeholder="admin@growondaily.com"
              defaultValue="admin@growondaily.com"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
              </div>
              <Switch id="maintenance_mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug_mode">Debug Mode</Label>
                <p className="text-sm text-gray-500">Enable debug logging for development</p>
              </div>
              <Switch id="debug_mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_backup">Auto Backup</Label>
                <p className="text-sm text-gray-500">Automatically backup system data</p>
              </div>
              <Switch id="auto_backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send system notifications via email</p>
              </div>
              <Switch id="email_notifications" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
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

export { GeneralSettings };
