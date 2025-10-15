import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const SystemSecuritySettings = () => {
  return (
    <Card id="system_security_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="password_min_length">Minimum Password Length</Label>
            <Input 
              id="password_min_length" 
              type="number"
              placeholder="8"
              defaultValue="8"
            />
          </div>
          
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
            <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
            <Input 
              id="max_login_attempts" 
              type="number"
              placeholder="5"
              defaultValue="5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
            <Input 
              id="lockout_duration" 
              type="number"
              placeholder="15"
              defaultValue="15"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Security Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two_factor_auth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require 2FA for all users</p>
              </div>
              <Switch id="two_factor_auth" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password_complexity">Password Complexity</Label>
                <p className="text-sm text-gray-500">Require complex passwords</p>
              </div>
              <Switch id="password_complexity" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip_whitelist">IP Whitelist</Label>
                <p className="text-sm text-gray-500">Restrict access to specific IPs</p>
              </div>
              <Switch id="ip_whitelist" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audit_logging">Audit Logging</Label>
                <p className="text-sm text-gray-500">Log all security events</p>
              </div>
              <Switch id="audit_logging" defaultChecked />
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
            Security Scan
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

export { SystemSecuritySettings };
