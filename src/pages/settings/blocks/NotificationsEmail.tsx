import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Send, 
  Settings,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const NotificationsEmail = () => {
  return (
    <Card id="notifications_email">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smtp_host">SMTP Host</Label>
            <Input 
              id="smtp_host" 
              placeholder="smtp.gmail.com"
              defaultValue="smtp.gmail.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_port">SMTP Port</Label>
            <Input 
              id="smtp_port" 
              type="number"
              placeholder="587"
              defaultValue="587"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_username">SMTP Username</Label>
            <Input 
              id="smtp_username" 
              placeholder="noreply@growondaily.com"
              defaultValue="noreply@growondaily.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp_password">SMTP Password</Label>
            <Input 
              id="smtp_password" 
              type="password"
              placeholder="Enter password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from_email">From Email</Label>
            <Input 
              id="from_email" 
              type="email"
              placeholder="noreply@growondaily.com"
              defaultValue="noreply@growondaily.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from_name">From Name</Label>
            <Input 
              id="from_name" 
              placeholder="GrowOnDaily"
              defaultValue="GrowOnDaily"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Email Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_ssl">Enable SSL</Label>
                <p className="text-sm text-gray-500">Use SSL/TLS for email encryption</p>
              </div>
              <Switch id="email_ssl" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_authentication">SMTP Authentication</Label>
                <p className="text-sm text-gray-500">Require authentication for SMTP</p>
              </div>
              <Switch id="email_authentication" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_queue">Email Queue</Label>
                <p className="text-sm text-gray-500">Queue emails for better delivery</p>
              </div>
              <Switch id="email_queue" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Notification Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="welcome_emails">Welcome Emails</Label>
                <p className="text-sm text-gray-500">Send welcome emails to new users</p>
              </div>
              <Switch id="welcome_emails" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password_reset">Password Reset</Label>
                <p className="text-sm text-gray-500">Send password reset emails</p>
              </div>
              <Switch id="password_reset" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_notifications">Content Notifications</Label>
                <p className="text-sm text-gray-500">Notify about new content</p>
              </div>
              <Switch id="content_notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system_alerts">System Alerts</Label>
                <p className="text-sm text-gray-500">Send system alert emails</p>
              </div>
              <Switch id="system_alerts" defaultChecked />
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
            Test Email
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

export { NotificationsEmail };
