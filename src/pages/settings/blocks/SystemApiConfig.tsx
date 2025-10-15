import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Network,
  Key,
  Shield,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const SystemApiConfig = () => {
  return (
    <Card id="system_api_config">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="api_base_url">API Base URL</Label>
            <Input 
              id="api_base_url" 
              placeholder="https://api.growondaily.com"
              defaultValue="https://api.growondaily.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_version">API Version</Label>
            <Input 
              id="api_version" 
              placeholder="v1"
              defaultValue="v1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_key">API Key</Label>
            <Input 
              id="api_key" 
              type="password"
              placeholder="Enter API key"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_secret">API Secret</Label>
            <Input 
              id="api_secret" 
              type="password"
              placeholder="Enter API secret"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_timeout">API Timeout (seconds)</Label>
            <Input 
              id="api_timeout" 
              type="number"
              placeholder="30"
              defaultValue="30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api_retry_attempts">Retry Attempts</Label>
            <Input 
              id="api_retry_attempts" 
              type="number"
              placeholder="3"
              defaultValue="3"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">API Security</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="api_ssl">Enable SSL</Label>
                <p className="text-sm text-gray-500">Use HTTPS for API communication</p>
              </div>
              <Switch id="api_ssl" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="api_rate_limiting">Rate Limiting</Label>
                <p className="text-sm text-gray-500">Enable API rate limiting</p>
              </div>
              <Switch id="api_rate_limiting" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="api_authentication">Authentication Required</Label>
                <p className="text-sm text-gray-500">Require authentication for API access</p>
              </div>
              <Switch id="api_authentication" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test API
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate New Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SystemApiConfig };
