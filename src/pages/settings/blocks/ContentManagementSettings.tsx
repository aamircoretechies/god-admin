import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Edit, 
  Eye,
  Save,
  Settings,
  RefreshCw
} from 'lucide-react';

const ContentManagementSettings = () => {
  return (
    <Card id="content_management_settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Content Management Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="max_content_length">Max Content Length</Label>
            <Input 
              id="max_content_length" 
              type="number"
              placeholder="10000"
              defaultValue="10000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content_approval">Content Approval Required</Label>
            <Input 
              id="content_approval" 
              placeholder="Auto"
              defaultValue="Auto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allowed_file_types">Allowed File Types</Label>
            <Input 
              id="allowed_file_types" 
              placeholder="jpg, png, pdf, doc"
              defaultValue="jpg, png, pdf, doc"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_file_size">Max File Size (MB)</Label>
            <Input 
              id="max_file_size" 
              type="number"
              placeholder="10"
              defaultValue="10"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Content Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_save">Auto Save</Label>
                <p className="text-sm text-gray-500">Automatically save content drafts</p>
              </div>
              <Switch id="auto_save" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="version_control">Version Control</Label>
                <p className="text-sm text-gray-500">Keep track of content versions</p>
              </div>
              <Switch id="version_control" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_preview">Content Preview</Label>
                <p className="text-sm text-gray-500">Show preview before publishing</p>
              </div>
              <Switch id="content_preview" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="seo_optimization">SEO Optimization</Label>
                <p className="text-sm text-gray-500">Enable SEO tools for content</p>
              </div>
              <Switch id="seo_optimization" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Advanced Options
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

export { ContentManagementSettings };
