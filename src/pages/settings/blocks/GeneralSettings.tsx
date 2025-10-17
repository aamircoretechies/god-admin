import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Upload,
  Palette,
  Save,
  RefreshCw
} from 'lucide-react';

const GeneralSettings = () => {
  return (
    <Card id="general_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase 1 General Settings - Brand Identity Alignment */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site_title">Site Title</Label>
            <Input 
              id="site_title" 
              placeholder="Enter site title"
              defaultValue="GrowOnDaily"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo_upload">Logo Upload</Label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
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
            <Select defaultValue="light">
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
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
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

export { GeneralSettings };
