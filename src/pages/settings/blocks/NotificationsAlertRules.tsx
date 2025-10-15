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
  Plus,
  Trash2
} from 'lucide-react';

const NotificationsAlertRules = () => {
  return (
    <Card id="notifications_alert_rules">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Alert Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Alert Rules</h4>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Rule
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">High CPU Usage</h5>
                <p className="text-sm text-gray-500">Alert when CPU usage exceeds 80%</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Low Disk Space</h5>
                <p className="text-sm text-gray-500">Alert when disk space is below 10%</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Failed Login Attempts</h5>
                <p className="text-sm text-gray-500">Alert after 5 failed login attempts</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Database Connection Errors</h5>
                <p className="text-sm text-gray-500">Alert on database connection failures</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Rule Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rule_aggregation">Rule Aggregation</Label>
                <p className="text-sm text-gray-500">Combine similar alerts</p>
              </div>
              <Switch id="rule_aggregation" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rule_escalation">Alert Escalation</Label>
                <p className="text-sm text-gray-500">Escalate alerts if not acknowledged</p>
              </div>
              <Switch id="rule_escalation" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rule_suppression">Alert Suppression</Label>
                <p className="text-sm text-gray-500">Suppress alerts during maintenance</p>
              </div>
              <Switch id="rule_suppression" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Rules
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Test Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { NotificationsAlertRules };
