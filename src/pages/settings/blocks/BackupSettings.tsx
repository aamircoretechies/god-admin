import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Cloud, 
  Settings,
  Save,
  Play,
  RefreshCw
} from 'lucide-react';

const BackupSettings = () => {
  return (
    <Card id="backup_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Backup Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="backup_frequency">Backup Frequency</Label>
            <Input 
              id="backup_frequency" 
              placeholder="Daily"
              defaultValue="Daily"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backup_time">Backup Time</Label>
            <Input 
              id="backup_time" 
              type="time"
              defaultValue="02:00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backup_retention">Retention Period (days)</Label>
            <Input 
              id="backup_retention" 
              type="number"
              placeholder="30"
              defaultValue="30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backup_location">Backup Location</Label>
            <Input 
              id="backup_location" 
              placeholder="/backups"
              defaultValue="/backups"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Backup Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_backup">Auto Backup</Label>
                <p className="text-sm text-gray-500">Automatically create backups</p>
              </div>
              <Switch id="auto_backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cloud_backup">Cloud Backup</Label>
                <p className="text-sm text-gray-500">Store backups in cloud storage</p>
              </div>
              <Switch id="cloud_backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compression">Compression</Label>
                <p className="text-sm text-gray-500">Compress backup files</p>
              </div>
              <Switch id="compression" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="encryption">Encryption</Label>
                <p className="text-sm text-gray-500">Encrypt backup files</p>
              </div>
              <Switch id="encryption" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Backup Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="full_backup">Full Backup</Label>
                <p className="text-sm text-gray-500">Complete system backup</p>
              </div>
              <Switch id="full_backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="incremental_backup">Incremental Backup</Label>
                <p className="text-sm text-gray-500">Backup only changed files</p>
              </div>
              <Switch id="incremental_backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="database_backup">Database Backup</Label>
                <p className="text-sm text-gray-500">Backup database separately</p>
              </div>
              <Switch id="database_backup" defaultChecked />
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
            Start Backup
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Restore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { BackupSettings };
