import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
// Email notifications are disabled - API calls removed
import { Mail, Settings, Save } from 'lucide-react';

const NotificationsEmail = () => {
  const [loading, setLoading] = useState(true);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Email notifications are disabled for now - skip API call
    setLoading(false);
    // Set default disabled values
    setLocalValues({
      email_enabled: 'false',
      system_emails: 'false',
      alerts: 'false',
      maintenance_notices: 'false'
    });
  }, []);

  const handleSave = async () => {
    // Email notifications are disabled - save functionality is disabled
    return;
  };

  const getSettingValue = (key: string): string => {
    // Return disabled value directly from localValues
    return localValues[key] || 'false';
  };

  if (loading) {
    return (
      <Card id="notifications_email">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="notifications_email">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase 1 Notification Preferences - Optional Phase 1 */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Optional Phase 1 Feature</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Email notifications are optional for Phase 1. Configure if needed.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Notification Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system_emails">System Emails</Label>
                  <p className="text-sm text-gray-500">Receive system-generated emails</p>
                </div>
                <Switch
                  id="system_emails"
                  checked={getSettingValue('system_emails') === 'true'}
                  onCheckedChange={() => {}} // Disabled - no action
                  disabled={true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alerts">Alerts</Label>
                  <p className="text-sm text-gray-500">Receive alert notifications</p>
                </div>
                <Switch
                  id="alerts"
                  checked={getSettingValue('alerts') === 'true'}
                  onCheckedChange={() => {}} // Disabled - no action
                  disabled={true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance_notices">Maintenance Notices</Label>
                  <p className="text-sm text-gray-500">Receive maintenance notifications</p>
                </div>
                <Switch
                  id="maintenance_notices"
                  checked={getSettingValue('maintenance_notices') === 'true'}
                  onCheckedChange={() => {}} // Disabled - no action
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2" onClick={handleSave} disabled={true}>
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          {/* <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Email
          </Button> */}
          {/* <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              const initialValues: Record<string, string> = {};
              settings.forEach(setting => {
                initialValues[setting.setting_id] = setting.value;
              });
              setLocalValues(initialValues);
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export { NotificationsEmail };
