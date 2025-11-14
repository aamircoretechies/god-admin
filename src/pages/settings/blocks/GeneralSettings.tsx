import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { fetchSettings, updateSetting, type Setting } from '@/services/settingsApi';
import { 
  Settings, 
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchSettings();
        if (response.status === 1 && response.data?.general) {
          const generalSettings = response.data.general;
          setSettings(generalSettings);
          // Initialize local values
          const initialValues: Record<string, string> = {};
          generalSettings.forEach(setting => {
            initialValues[setting.setting_id] = setting.value;
          });
          setLocalValues(initialValues);
        } else {
          setError(response.message || 'Failed to load settings');
        }
      } catch (err: any) {
        console.error('Error loading general settings:', err);
        setError(err?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleValueChange = (settingId: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [settingId]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Update all changed settings
      const updatePromises = Object.entries(localValues).map(([settingId, value]) => {
        const originalSetting = settings.find(s => s.setting_id === settingId);
        if (originalSetting && originalSetting.value !== value) {
          return updateSetting(settingId, { value });
        }
        return Promise.resolve(null);
      });

      await Promise.all(updatePromises);
      
      // Reload settings
      const response = await fetchSettings();
      if (response.status === 1 && response.data?.general) {
        setSettings(response.data.general);
        const newValues: Record<string, string> = {};
        response.data.general.forEach(setting => {
          newValues[setting.setting_id] = setting.value;
        });
        setLocalValues(newValues);
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string): string => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      return localValues[setting.setting_id] || setting.value;
    }
    return '';
  };

  const getSettingId = (key: string): string | undefined => {
    return settings.find(s => s.key === key)?.setting_id;
  };

  if (loading) {
    return (
      <Card id="general_settings">
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

  if (error && settings.length === 0) {
    return (
      <Card id="general_settings">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="general_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Phase 1 General Settings - Brand Identity Alignment */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site_title">Site Title</Label>
            <Input 
              id="site_title" 
              placeholder="Enter site title"
              value={getSettingValue('site_title')}
              onChange={(e) => {
                const settingId = getSettingId('site_title');
                if (settingId) handleValueChange(settingId, e.target.value);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo_upload">Logo Upload</Label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {getSettingValue('logo_url') ? (
                  <img src={getSettingValue('logo_url')} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Input 
                  id="logo_url" 
                  placeholder="Enter logo URL"
                  value={getSettingValue('logo_url')}
                  onChange={(e) => {
                    const settingId = getSettingId('logo_url');
                    if (settingId) handleValueChange(settingId, e.target.value);
                  }}
                  className="mb-2"
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-500 mt-1">Recommended: 200x60px, PNG/JPG</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme_selector">Theme Selector</Label>
            <Select 
              value={getSettingValue('theme')} 
              onValueChange={(value) => {
                const settingId = getSettingId('theme');
                if (settingId) handleValueChange(settingId, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    Light Theme
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                    Dark Theme
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button 
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button 
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { GeneralSettings };
