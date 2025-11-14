import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { fetchApiConfiguration, updateApiConfiguration } from '@/services/settingsApi';
import {
  Key,
  Eye,
  EyeOff,
  Save,
  TestTube,
  RefreshCw,
  Lock
} from 'lucide-react';

const SystemApiConfig = () => {
  const [config, setConfig] = useState<{
    openai_api_key: string;
    bible_api_key: string;
    tts_api_key: string;
    api_rate_limit: string;
    api_timeout: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [localValues, setLocalValues] = useState<{
    openai_api_key: string;
    bible_api_key: string;
    tts_api_key: string;
    api_rate_limit: string;
    api_timeout: string;
  }>({
    openai_api_key: '',
    bible_api_key: '',
    tts_api_key: '',
    api_rate_limit: '',
    api_timeout: ''
  });
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showBibleAPIKey, setShowBibleAPIKey] = useState(false);
  const [showTTSAPIKey, setShowTTSAPIKey] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchApiConfiguration();
        if (response.status === 1 && response.data) {
          setConfig(response.data);
          setLocalValues({
            openai_api_key: response.data.openai_api_key,
            bible_api_key: response.data.bible_api_key,
            tts_api_key: response.data.tts_api_key,
            api_rate_limit: response.data.api_rate_limit,
            api_timeout: response.data.api_timeout
          });
        } else {
          setError(response.message || 'Failed to load settings');
        }
      } catch (err: any) {
        console.error('Error loading API settings:', err);
        setError(err?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleValueChange = (key: keyof typeof localValues, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const requestData = {
        openai_api_key: localValues.openai_api_key,
        bible_api_key: localValues.bible_api_key,
        tts_api_key: localValues.tts_api_key,
        api_rate_limit: parseInt(localValues.api_rate_limit) || 0,
        api_timeout: parseInt(localValues.api_timeout) || 0
      };

      const response = await updateApiConfiguration(requestData);
      
      if (response.status === 1) {
        // Reload configuration
        const updatedResponse = await fetchApiConfiguration();
        if (updatedResponse.status === 1 && updatedResponse.data) {
          setConfig(updatedResponse.data);
          setLocalValues({
            openai_api_key: updatedResponse.data.openai_api_key,
            bible_api_key: updatedResponse.data.bible_api_key,
            tts_api_key: updatedResponse.data.tts_api_key,
            api_rate_limit: updatedResponse.data.api_rate_limit,
            api_timeout: updatedResponse.data.api_timeout
          });
        }
      } else {
        setError(response.message || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving API settings:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card id="system_api_config">
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
      <Card id="system_api_config">
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
    <Card id="system_api_config">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Keys Management
          <Badge variant="destructive" className="ml-2">
            <Lock className="w-3 h-3 mr-1" />
            Admin Only
          </Badge>
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

        <div className="space-y-6">
          {/* API Rate Limit */}
          <div className="space-y-2">
            <Label htmlFor="api_rate_limit">API Rate Limit (per hour)</Label>
            <Input 
              id="api_rate_limit" 
              type="number"
              placeholder="1000"
              value={localValues.api_rate_limit}
              onChange={(e) => handleValueChange('api_rate_limit', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              API rate limit per hour
            </p>
          </div>

          {/* API Timeout */}
          <div className="space-y-2">
            <Label htmlFor="api_timeout">API Timeout (milliseconds)</Label>
            <Input 
              id="api_timeout" 
              type="number"
              placeholder="30000"
              value={localValues.api_timeout}
              onChange={(e) => handleValueChange('api_timeout', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              API timeout in milliseconds
            </p>
          </div>

          {/* OpenAI API */}
          <div className="space-y-2">
            <Label htmlFor="openai_api_key">OpenAI API Key</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="openai_api_key" 
                type={showOpenAIKey ? "text" : "password"}
                placeholder="sk-..."
                className="flex-1"
                value={localValues.openai_api_key}
                onChange={(e) => handleValueChange('openai_api_key', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
              >
                {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              OpenAI API key for AI content generation
            </p>
          </div>
          
          {/* Bible API */}
          <div className="space-y-2">
            <Label htmlFor="bible_api_key">Bible API Key</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="bible_api_key" 
                type={showBibleAPIKey ? "text" : "password"}
                placeholder="Enter Bible API key"
                className="flex-1"
                value={localValues.bible_api_key}
                onChange={(e) => handleValueChange('bible_api_key', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBibleAPIKey(!showBibleAPIKey)}
              >
                {showBibleAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Bible API key for verse retrieval
            </p>
          </div>
          
          {/* TTS API */}
          <div className="space-y-2">
            <Label htmlFor="tts_api_key">TTS API Key</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="tts_api_key" 
                type={showTTSAPIKey ? "text" : "password"}
                placeholder="Enter TTS API key"
                className="flex-1"
                value={localValues.tts_api_key}
                onChange={(e) => handleValueChange('tts_api_key', e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTTSAPIKey(!showTTSAPIKey)}
              >
                {showTTSAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Text-to-Speech API key
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button 
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
          {/* <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test API
          </Button> */}
          {/* <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              if (config) {
                setLocalValues({
                  openai_api_key: config.openai_api_key,
                  bible_api_key: config.bible_api_key,
                  tts_api_key: config.tts_api_key,
                  api_rate_limit: config.api_rate_limit,
                  api_timeout: config.api_timeout
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

export { SystemApiConfig };
