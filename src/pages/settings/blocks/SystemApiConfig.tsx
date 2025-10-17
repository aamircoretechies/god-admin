import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Key,
  Eye,
  EyeOff,
  Save,
  TestTube,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useState } from 'react';

const SystemApiConfig = () => {
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showBibleAPIKey, setShowBibleAPIKey] = useState(false);
  const [showTTSAPIKey, setShowTTSAPIKey] = useState(false);

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
        {/* Phase 1 API Keys Management - Admin-only access */}
        <div className="space-y-6">
          {/* OpenAI API */}
          <div className="space-y-2">
            <Label htmlFor="openai_api_key">OpenAI API Key</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="openai_api_key" 
                type={showOpenAIKey ? "text" : "password"}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
              >
                {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Used for AI explanations and content generation</p>
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
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBibleAPIKey(!showBibleAPIKey)}
              >
                {showBibleAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Used for Bible verse retrieval and translations</p>
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
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTTSAPIKey(!showTTSAPIKey)}
              >
                {showTTSAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Used for text-to-speech functionality</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test API
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate New Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { SystemApiConfig };
