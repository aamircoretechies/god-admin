import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Cpu, 
  Zap, 
  Gauge,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const SystemPerformance = () => {
  return (
    <Card id="system_performance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Performance Tuning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cache_size">Cache Size (MB)</Label>
            <Input 
              id="cache_size" 
              type="number"
              placeholder="512"
              defaultValue="512"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="worker_threads">Worker Threads</Label>
            <Input 
              id="worker_threads" 
              type="number"
              placeholder="4"
              defaultValue="4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="connection_pool">Connection Pool Size</Label>
            <Input 
              id="connection_pool" 
              type="number"
              placeholder="20"
              defaultValue="20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Request Timeout (seconds)</Label>
            <Input 
              id="timeout" 
              type="number"
              placeholder="30"
              defaultValue="30"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Performance Options</h4>
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
                <Label htmlFor="load_balancing">Load Balancing</Label>
                <p className="text-sm text-gray-500">Distribute load across multiple servers</p>
              </div>
              <Switch id="load_balancing" />
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
            Performance Test
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Optimize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SystemPerformance };
