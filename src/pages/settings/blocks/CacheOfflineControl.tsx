import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { fetchCacheConfiguration, updateCacheConfiguration } from '@/services/settingsApi';
import { 
  Database, 
  Download, 
  Trash2,
  AlertTriangle
} from 'lucide-react';

const CacheOfflineControl = () => {
  const [config, setConfig] = useState<{
    cache_enabled: boolean;
    cache_ttl: string;
    max_cache_size: string;
    offline_mode: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [localValues, setLocalValues] = useState<{
    cache_enabled: boolean;
    cache_ttl: string;
    max_cache_size: string;
    offline_mode: boolean;
  }>({
    cache_enabled: false,
    cache_ttl: '',
    max_cache_size: '',
    offline_mode: false
  });
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCacheConfiguration();
        if (response.status === 1 && response.data) {
          setConfig(response.data);
          setLocalValues({
            cache_enabled: response.data.cache_enabled,
            cache_ttl: response.data.cache_ttl,
            max_cache_size: response.data.max_cache_size,
            offline_mode: response.data.offline_mode
          });
        } else {
          setError(response.message || 'Failed to load settings');
        }
      } catch (err: any) {
        console.error('Error loading cache settings:', err);
        setError(err?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleValueChange = (key: keyof typeof localValues, value: string | boolean) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const requestData = {
        cache_enabled: localValues.cache_enabled,
        cache_ttl: parseInt(localValues.cache_ttl) || 0,
        max_cache_size: localValues.max_cache_size,
        offline_mode: localValues.offline_mode
      };

      const response = await updateCacheConfiguration(requestData);
      
      if (response.status === 1) {
        // Reload configuration
        const updatedResponse = await fetchCacheConfiguration();
        if (updatedResponse.status === 1 && updatedResponse.data) {
          setConfig(updatedResponse.data);
          setLocalValues({
            cache_enabled: updatedResponse.data.cache_enabled,
            cache_ttl: updatedResponse.data.cache_ttl,
            max_cache_size: updatedResponse.data.max_cache_size,
            offline_mode: updatedResponse.data.offline_mode
          });
        }
      } else {
        setError(response.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving cache settings:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card id="cache_offline_control">
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

  if (error && !config) {
    return (
      <Card id="cache_offline_control">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleClearCache = () => {
    setIsClearingCache(true);
    // Simulate cache clearing
    setTimeout(() => {
      setIsClearingCache(false);
      // Show success message
    }, 2000);
  };

  const handlePreloadTranslations = () => {
    setIsPreloading(true);
    // Simulate preloading
    setTimeout(() => {
      setIsPreloading(false);
      // Show success message
    }, 3000);
  };

  return (
    <Card id="cache_offline_control">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Cache & Offline Control
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

        {/* Phase 1 Cache & Offline Control - Simple confirmation dialogs */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Cache Management</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Manage system cache and offline content. These actions may take a few moments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cache Management</h4>
              <Button 
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="w-full justify-start"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isClearingCache ? 'Clearing Cache...' : 'Clear Cache'}
              </Button>
              <p className="text-xs text-gray-500">
                Remove all cached data to free up space and resolve issues
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Offline Content</h4>
              <Button 
                onClick={handlePreloadTranslations}
                disabled={isPreloading}
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {isPreloading ? 'Preloading...' : 'Preload Translations'}
              </Button>
              <p className="text-xs text-gray-500">
                Download translations for offline access
              </p>
            </div>
          </div>

          {/* Cache Settings from API */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900">Cache Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cache_enabled">Cache Enabled</Label>
                  <p className="text-xs text-gray-500">
                    Enable caching system
                  </p>
                </div>
                <Switch 
                  id="cache_enabled"
                  checked={localValues.cache_enabled}
                  onCheckedChange={(checked) => handleValueChange('cache_enabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cache_ttl">Cache TTL (seconds)</Label>
                <Input 
                  id="cache_ttl" 
                  type="number"
                  placeholder="3600"
                  value={localValues.cache_ttl}
                  onChange={(e) => handleValueChange('cache_ttl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_cache_size">Max Cache Size</Label>
                <Input 
                  id="max_cache_size" 
                  placeholder="100MB"
                  value={localValues.max_cache_size}
                  onChange={(e) => handleValueChange('max_cache_size', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="offline_mode">Offline Mode</Label>
                  <p className="text-xs text-gray-500">
                    Enable offline mode
                  </p>
                </div>
                <Switch 
                  id="offline_mode"
                  checked={localValues.offline_mode}
                  onCheckedChange={(checked) => handleValueChange('offline_mode', checked)}
                />
              </div>
            </div>
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
          {/* <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              if (config) {
                setLocalValues({
                  cache_enabled: config.cache_enabled,
                  cache_ttl: config.cache_ttl,
                  max_cache_size: config.max_cache_size,
                  offline_mode: config.offline_mode
                });
              }
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

export { CacheOfflineControl };

