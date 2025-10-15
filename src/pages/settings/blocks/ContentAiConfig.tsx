import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Zap, 
  Settings,
  Save,
  TestTube,
  RefreshCw
} from 'lucide-react';

const ContentAiConfig = () => {
  return (
    <Card id="content_ai_config">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ai_model">AI Model</Label>
            <Input 
              id="ai_model" 
              placeholder="gpt-4"
              defaultValue="gpt-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai_temperature">Temperature</Label>
            <Input 
              id="ai_temperature" 
              type="number"
              step="0.1"
              placeholder="0.7"
              defaultValue="0.7"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai_max_tokens">Max Tokens</Label>
            <Input 
              id="ai_max_tokens" 
              type="number"
              placeholder="2048"
              defaultValue="2048"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai_api_key">API Key</Label>
            <Input 
              id="ai_api_key" 
              type="password"
              placeholder="Enter API key"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">AI Features</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_generation">Content Generation</Label>
                <p className="text-sm text-gray-500">Enable AI-powered content generation</p>
              </div>
              <Switch id="content_generation" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_summarization">Content Summarization</Label>
                <p className="text-sm text-gray-500">Automatically summarize long content</p>
              </div>
              <Switch id="content_summarization" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_translation">Content Translation</Label>
                <p className="text-sm text-gray-500">Translate content to different languages</p>
              </div>
              <Switch id="content_translation" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_optimization">Content Optimization</Label>
                <p className="text-sm text-gray-500">Optimize content for SEO and readability</p>
              </div>
              <Switch id="content_optimization" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">AI Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai_rate_limiting">Rate Limiting</Label>
                <p className="text-sm text-gray-500">Limit AI API requests per minute</p>
              </div>
              <Switch id="ai_rate_limiting" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai_caching">AI Response Caching</Label>
                <p className="text-sm text-gray-500">Cache AI responses for better performance</p>
              </div>
              <Switch id="ai_caching" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai_fallback">Fallback Mode</Label>
                <p className="text-sm text-gray-500">Use fallback when AI is unavailable</p>
              </div>
              <Switch id="ai_fallback" defaultChecked />
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
            Test AI
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

export { ContentAiConfig };
