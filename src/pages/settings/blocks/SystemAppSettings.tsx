import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  AppWindow, 
  Database, 
  Server, 
  Cpu,
  Save,
  TestTube
} from 'lucide-react';

const SystemAppSettings = () => {
  return (
    <Card id="system_app_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AppWindow className="w-5 h-5" />
          Application Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
            <Input 
              id="session_timeout" 
              type="number"
              placeholder="30"
              defaultValue="30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_upload_size">Max Upload Size (MB)</Label>
            <Input 
              id="max_upload_size" 
              type="number"
              placeholder="10"
              defaultValue="10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cache_duration">Cache Duration (hours)</Label>
            <Input 
              id="cache_duration" 
              type="number"
              placeholder="24"
              defaultValue="24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rate_limit">Rate Limit (requests/min)</Label>
            <Input 
              id="rate_limit" 
              type="number"
              placeholder="100"
              defaultValue="100"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Performance Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable_caching">Enable Caching</Label>
                <p className="text-sm text-gray-500">Cache frequently accessed data</p>
              </div>
              <Switch id="enable_caching" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compression">Enable Compression</Label>
                <p className="text-sm text-gray-500">Compress responses to reduce bandwidth</p>
              </div>
              <Switch id="compression" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="minification">Enable Minification</Label>
                <p className="text-sm text-gray-500">Minify CSS and JavaScript files</p>
              </div>
              <Switch id="minification" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Development Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hot_reload">Hot Reload</Label>
                <p className="text-sm text-gray-500">Enable hot reload for development</p>
              </div>
              <Switch id="hot_reload" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="source_maps">Source Maps</Label>
                <p className="text-sm text-gray-500">Generate source maps for debugging</p>
              </div>
              <Switch id="source_maps" />
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
            Test Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SystemAppSettings };
