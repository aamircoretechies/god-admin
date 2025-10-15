import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Code, 
  Bug, 
  Settings,
  Save,
  Play,
  Terminal
} from 'lucide-react';

const AdvancedDeveloperTools = () => {
  return (
    <Card id="advanced_developer_tools">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Developer Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Development Features</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug_mode">Debug Mode</Label>
                <p className="text-sm text-gray-500">Enable detailed debugging information</p>
              </div>
              <Switch id="debug_mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profiling">Performance Profiling</Label>
                <p className="text-sm text-gray-500">Enable performance profiling tools</p>
              </div>
              <Switch id="profiling" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="query_logging">Query Logging</Label>
                <p className="text-sm text-gray-500">Log database queries for debugging</p>
              </div>
              <Switch id="query_logging" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="api_documentation">API Documentation</Label>
                <p className="text-sm text-gray-500">Enable interactive API documentation</p>
              </div>
              <Switch id="api_documentation" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Testing Tools</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="test_mode">Test Mode</Label>
                <p className="text-sm text-gray-500">Enable test environment features</p>
              </div>
              <Switch id="test_mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mock_data">Mock Data</Label>
                <p className="text-sm text-gray-500">Use mock data for testing</p>
              </div>
              <Switch id="mock_data" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="test_emails">Test Emails</Label>
                <p className="text-sm text-gray-500">Capture emails for testing</p>
              </div>
              <Switch id="test_emails" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Development Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dev_port">Development Port</Label>
              <Input 
                id="dev_port" 
                type="number"
                placeholder="3000"
                defaultValue="3000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hot_reload">Hot Reload Port</Label>
              <Input 
                id="hot_reload" 
                type="number"
                placeholder="3001"
                defaultValue="3001"
              />
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
            Run Tests
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Open Console
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedDeveloperTools };
