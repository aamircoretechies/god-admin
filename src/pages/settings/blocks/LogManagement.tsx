import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Trash2, 
  Settings,
  Save,
  Download,
  Eye
} from 'lucide-react';

const LogManagement = () => {
  return (
    <Card id="log_management">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Log Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="log_level">Log Level</Label>
            <Input 
              id="log_level" 
              placeholder="INFO"
              defaultValue="INFO"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="log_retention">Log Retention (days)</Label>
            <Input 
              id="log_retention" 
              type="number"
              placeholder="90"
              defaultValue="90"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="log_rotation">Log Rotation Size (MB)</Label>
            <Input 
              id="log_rotation" 
              type="number"
              placeholder="100"
              defaultValue="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="log_location">Log Location</Label>
            <Input 
              id="log_location" 
              placeholder="/var/log/app"
              defaultValue="/var/log/app"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Log Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="error_logs">Error Logs</Label>
                <p className="text-sm text-gray-500">Log system errors and exceptions</p>
              </div>
              <Switch id="error_logs" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="access_logs">Access Logs</Label>
                <p className="text-sm text-gray-500">Log user access and requests</p>
              </div>
              <Switch id="access_logs" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security_logs">Security Logs</Label>
                <p className="text-sm text-gray-500">Log security events and violations</p>
              </div>
              <Switch id="security_logs" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="performance_logs">Performance Logs</Label>
                <p className="text-sm text-gray-500">Log performance metrics</p>
              </div>
              <Switch id="performance_logs" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Log Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log_compression">Log Compression</Label>
                <p className="text-sm text-gray-500">Compress old log files</p>
              </div>
              <Switch id="log_compression" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log_encryption">Log Encryption</Label>
                <p className="text-sm text-gray-500">Encrypt sensitive log data</p>
              </div>
              <Switch id="log_encryption" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log_monitoring">Log Monitoring</Label>
                <p className="text-sm text-gray-500">Monitor logs for anomalies</p>
              </div>
              <Switch id="log_monitoring" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Logs
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { LogManagement };
