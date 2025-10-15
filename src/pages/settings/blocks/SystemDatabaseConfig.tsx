import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Server, 
  Shield,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const SystemDatabaseConfig = () => {
  return (
    <Card id="system_database_config">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="db_host">Database Host</Label>
            <Input 
              id="db_host" 
              placeholder="localhost"
              defaultValue="localhost"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="db_port">Database Port</Label>
            <Input 
              id="db_port" 
              type="number"
              placeholder="5432"
              defaultValue="5432"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="db_name">Database Name</Label>
            <Input 
              id="db_name" 
              placeholder="growondaily_db"
              defaultValue="growondaily_db"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="db_username">Database Username</Label>
            <Input 
              id="db_username" 
              placeholder="db_user"
              defaultValue="db_user"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="db_password">Database Password</Label>
            <Input 
              id="db_password" 
              type="password"
              placeholder="Enter password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="db_connection_pool">Connection Pool Size</Label>
            <Input 
              id="db_connection_pool" 
              type="number"
              placeholder="10"
              defaultValue="10"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Database Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="db_ssl">Enable SSL</Label>
                <p className="text-sm text-gray-500">Use SSL connection for database</p>
              </div>
              <Switch id="db_ssl" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="db_logging">Enable Query Logging</Label>
                <p className="text-sm text-gray-500">Log database queries for debugging</p>
              </div>
              <Switch id="db_logging" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="db_migrations">Auto Migrations</Label>
                <p className="text-sm text-gray-500">Automatically run database migrations</p>
              </div>
              <Switch id="db_migrations" defaultChecked />
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
            Test Connection
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

export { SystemDatabaseConfig };
