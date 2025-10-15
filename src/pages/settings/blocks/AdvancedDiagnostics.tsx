import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Stethoscope, 
  Activity, 
  AlertTriangle,
  Play,
  Download,
  Eye
} from 'lucide-react';

const AdvancedDiagnostics = () => {
  return (
    <Card id="advanced_diagnostics">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          System Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Diagnostic Tools</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">System Health Check</h5>
                <p className="text-sm text-gray-500">Comprehensive system health analysis</p>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Performance Analysis</h5>
                <p className="text-sm text-gray-500">Analyze system performance metrics</p>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Security Scan</h5>
                <p className="text-sm text-gray-500">Scan for security vulnerabilities</p>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Database Diagnostics</h5>
                <p className="text-sm text-gray-500">Check database health and performance</p>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Real-time Monitoring</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">CPU Monitoring</h5>
                <p className="text-sm text-gray-500">Monitor CPU usage in real-time</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Memory Monitoring</h5>
                <p className="text-sm text-gray-500">Monitor memory usage in real-time</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Network Monitoring</h5>
                <p className="text-sm text-gray-500">Monitor network traffic and connections</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-sm">Error Tracking</h5>
                <p className="text-sm text-gray-500">Track and analyze system errors</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recent Diagnostics</h4>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm">System Health Check</h5>
                  <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Passed</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm">Performance Analysis</h5>
                  <p className="text-sm text-gray-500">Completed 1 day ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Warning</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm">Security Scan</h5>
                  <p className="text-sm text-gray-500">Completed 3 days ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Run All Diagnostics
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedDiagnostics };
