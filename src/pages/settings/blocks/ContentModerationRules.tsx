import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

const ContentModerationRules = () => {
  return (
    <Card id="content_moderation_rules">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Content Moderation Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Moderation Rules</h4>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Rule
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Profanity Filter</h5>
                <p className="text-sm text-gray-500">Block content containing profanity</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Spam Detection</h5>
                <p className="text-sm text-gray-500">Detect and block spam content</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Duplicate Content</h5>
                <p className="text-sm text-gray-500">Flag duplicate content submissions</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Link Validation</h5>
                <p className="text-sm text-gray-500">Validate external links in content</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Moderation Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_moderation">Auto Moderation</Label>
                <p className="text-sm text-gray-500">Automatically moderate content based on rules</p>
              </div>
              <Switch id="auto_moderation" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="manual_review">Manual Review Required</Label>
                <p className="text-sm text-gray-500">Require manual review for flagged content</p>
              </div>
              <Switch id="manual_review" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user_notifications">User Notifications</Label>
                <p className="text-sm text-gray-500">Notify users when content is moderated</p>
              </div>
              <Switch id="user_notifications" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Rules
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Test Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ContentModerationRules };
