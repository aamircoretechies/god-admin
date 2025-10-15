import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Server, 
  Database,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

const AdvancedSystemInfo = () => {
  return (
    <Card id="advanced_system_info">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Application Version</h5>
              <p className="text-sm text-gray-600">1.0.0</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Node.js Version</h5>
              <p className="text-sm text-gray-600">18.17.0</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Database Version</h5>
              <p className="text-sm text-gray-600">PostgreSQL 15.3</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Operating System</h5>
              <p className="text-sm text-gray-600">Ubuntu 22.04 LTS</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Resource Usage</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">CPU Usage</h5>
              <p className="text-sm text-gray-600">45%</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Memory Usage</h5>
              <p className="text-sm text-gray-600">2.1 GB / 8 GB</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Disk Usage</h5>
              <p className="text-sm text-gray-600">45 GB / 100 GB</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Average Response Time</h5>
              <p className="text-sm text-gray-600">120ms</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Requests per Second</h5>
              <p className="text-sm text-gray-600">150</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Active Connections</h5>
              <p className="text-sm text-gray-600">25</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm">Error Rate</h5>
              <p className="text-sm text-gray-600">0.1%</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Health</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium text-sm">Database Connection</h5>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium text-sm">Cache Service</h5>
                <p className="text-sm text-gray-600">Running</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium text-sm">Email Service</h5>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium text-sm">File Storage</h5>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Info
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedSystemInfo };
