import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Textarea 
} from '@/components/ui/textarea';
import { 
  Separator 
} from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Download, 
  Save, 
  RotateCcw,
  AlertTriangle,
  FileText,
  Volume2,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminSettingsContent: React.FC = () => {
  const [settings, setSettings] = useState({
    // Daily Reminders
    dailyReminderEnabled: true,
    reminderTime: '09:00',
    reminderMessage: 'Take a moment to reflect on your spiritual journey today.',
    
    // Reflection Length Defaults
    defaultReflectionLength: 'medium',
    shortLength: 100,
    mediumLength: 300,
    deepLength: 500,
    
    // AI Prompts
    aiPromptsEnabled: true,
    aiPromptFrequency: 'daily',
    customPrompts: [
      'What verse spoke to you today?',
      'How has God been working in your life this week?',
      'What are you grateful for today?',
      'What challenges are you facing and how can prayer help?'
    ],
    
    // Moderation Settings
    autoFlaggingEnabled: true,
    flagKeywords: ['spam', 'inappropriate', 'offensive'],
    maxVersesPerNote: 10,
    minNoteLength: 10,
    maxNoteLength: 5000,
    
    // Export Options
    exportFormats: ['csv', 'pdf', 'json'],
    includeMetadata: true,
    includeAttachments: false,
    
    // Content Guidelines
    contentGuidelines: `1. Keep content respectful and spiritually uplifting
2. Avoid inappropriate language or content
3. Focus on personal spiritual growth and reflection
4. Respect others' beliefs and perspectives
5. Use appropriate tags and verse references`,
    
    // Notification Settings
    notifyOnFlagged: true,
    notifyOnBulkActions: true,
    emailNotifications: true,
    notificationRecipients: ['admin@example.com', 'moderator@example.com']
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      dailyReminderEnabled: true,
      reminderTime: '09:00',
      reminderMessage: 'Take a moment to reflect on your spiritual journey today.',
      defaultReflectionLength: 'medium',
      shortLength: 100,
      mediumLength: 300,
      deepLength: 500,
      aiPromptsEnabled: true,
      aiPromptFrequency: 'daily',
      customPrompts: [
        'What verse spoke to you today?',
        'How has God been working in your life this week?',
        'What are you grateful for today?',
        'What challenges are you facing and how can prayer help?'
      ],
      autoFlaggingEnabled: true,
      flagKeywords: ['spam', 'inappropriate', 'offensive'],
      maxVersesPerNote: 10,
      minNoteLength: 10,
      maxNoteLength: 5000,
      exportFormats: ['csv', 'pdf', 'json'],
      includeMetadata: true,
      includeAttachments: false,
      contentGuidelines: `1. Keep content respectful and spiritually uplifting
2. Avoid inappropriate language or content
3. Focus on personal spiritual growth and reflection
4. Respect others' beliefs and perspectives
5. Use appropriate tags and verse references`,
      notifyOnFlagged: true,
      notifyOnBulkActions: true,
      emailNotifications: true,
      notificationRecipients: ['admin@example.com', 'moderator@example.com']
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Journaling Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Daily Journaling Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyReminder" className="text-sm font-medium">
                Enable Daily Reminders
              </Label>
              <Switch
                id="dailyReminder"
                checked={settings.dailyReminderEnabled}
                onCheckedChange={(checked) => handleSettingChange('dailyReminderEnabled', checked)}
              />
            </div>
            
            {settings.dailyReminderEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reminderTime" className="text-sm font-medium">
                    Reminder Time
                  </Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reminderMessage" className="text-sm font-medium">
                    Reminder Message
                  </Label>
                  <Textarea
                    id="reminderMessage"
                    value={settings.reminderMessage}
                    onChange={(e) => handleSettingChange('reminderMessage', e.target.value)}
                    rows={3}
                    placeholder="Enter a custom reminder message..."
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Reflection Length Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Reflection Length Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultLength" className="text-sm font-medium">
                Default Reflection Length
              </Label>
              <Select 
                value={settings.defaultReflectionLength} 
                onValueChange={(value) => handleSettingChange('defaultReflectionLength', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (100 words)</SelectItem>
                  <SelectItem value="medium">Medium (300 words)</SelectItem>
                  <SelectItem value="deep">Deep (500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shortLength" className="text-sm font-medium">
                  Short Length
                </Label>
                <Input
                  id="shortLength"
                  type="number"
                  value={settings.shortLength}
                  onChange={(e) => handleSettingChange('shortLength', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediumLength" className="text-sm font-medium">
                  Medium Length
                </Label>
                <Input
                  id="mediumLength"
                  type="number"
                  value={settings.mediumLength}
                  onChange={(e) => handleSettingChange('mediumLength', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deepLength" className="text-sm font-medium">
                  Deep Length
                </Label>
                <Input
                  id="deepLength"
                  type="number"
                  value={settings.deepLength}
                  onChange={(e) => handleSettingChange('deepLength', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Suggested Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              AI-Suggested Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="aiPrompts" className="text-sm font-medium">
                Enable AI Prompts
              </Label>
              <Switch
                id="aiPrompts"
                checked={settings.aiPromptsEnabled}
                onCheckedChange={(checked) => handleSettingChange('aiPromptsEnabled', checked)}
              />
            </div>
            
            {settings.aiPromptsEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="promptFrequency" className="text-sm font-medium">
                    Prompt Frequency
                  </Label>
                  <Select 
                    value={settings.aiPromptFrequency} 
                    onValueChange={(value) => handleSettingChange('aiPromptFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Custom Prompts
                  </Label>
                  <div className="space-y-2">
                    {settings.customPrompts.map((prompt, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={prompt}
                          onChange={(e) => {
                            const newPrompts = [...settings.customPrompts];
                            newPrompts[index] = e.target.value;
                            handleSettingChange('customPrompts', newPrompts);
                          }}
                          placeholder="Enter a custom prompt..."
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPrompts = settings.customPrompts.filter((_, i) => i !== index);
                            handleSettingChange('customPrompts', newPrompts);
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPrompts = [...settings.customPrompts, ''];
                        handleSettingChange('customPrompts', newPrompts);
                      }}
                    >
                      Add Prompt
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Moderation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Moderation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoFlagging" className="text-sm font-medium">
                Enable Auto-Flagging
              </Label>
              <Switch
                id="autoFlagging"
                checked={settings.autoFlaggingEnabled}
                onCheckedChange={(checked) => handleSettingChange('autoFlaggingEnabled', checked)}
              />
            </div>
            
            {settings.autoFlaggingEnabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Flag Keywords (comma-separated)
                  </Label>
                  <Input
                    value={settings.flagKeywords.join(', ')}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0);
                      handleSettingChange('flagKeywords', keywords);
                    }}
                    placeholder="spam, inappropriate, offensive"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxVerses" className="text-sm font-medium">
                      Max Verses per Note
                    </Label>
                    <Input
                      id="maxVerses"
                      type="number"
                      value={settings.maxVersesPerNote}
                      onChange={(e) => handleSettingChange('maxVersesPerNote', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minLength" className="text-sm font-medium">
                      Min Note Length
                    </Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={settings.minNoteLength}
                      onChange={(e) => handleSettingChange('minNoteLength', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxLength" className="text-sm font-medium">
                    Max Note Length
                  </Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={settings.maxNoteLength}
                    onChange={(e) => handleSettingChange('maxNoteLength', parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Export Formats
              </Label>
              <div className="space-y-2">
                {['csv', 'pdf', 'json'].map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={format}
                      checked={settings.exportFormats.includes(format)}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...settings.exportFormats, format]
                          : settings.exportFormats.filter(f => f !== format);
                        handleSettingChange('exportFormats', formats);
                      }}
                    />
                    <Label htmlFor={format} className="text-sm capitalize">
                      {format.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeMetadata" className="text-sm font-medium">
                Include Metadata
              </Label>
              <Switch
                id="includeMetadata"
                checked={settings.includeMetadata}
                onCheckedChange={(checked) => handleSettingChange('includeMetadata', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeAttachments" className="text-sm font-medium">
                Include Attachments
              </Label>
              <Switch
                id="includeAttachments"
                checked={settings.includeAttachments}
                onCheckedChange={(checked) => handleSettingChange('includeAttachments', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyFlagged" className="text-sm font-medium">
                Notify on Flagged Notes
              </Label>
              <Switch
                id="notifyFlagged"
                checked={settings.notifyOnFlagged}
                onCheckedChange={(checked) => handleSettingChange('notifyOnFlagged', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyBulk" className="text-sm font-medium">
                Notify on Bulk Actions
              </Label>
              <Switch
                id="notifyBulk"
                checked={settings.notifyOnBulkActions}
                onCheckedChange={(checked) => handleSettingChange('notifyOnBulkActions', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            
            {settings.emailNotifications && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Notification Recipients
                </Label>
                <Textarea
                  value={settings.notificationRecipients.join(', ')}
                  onChange={(e) => {
                    const recipients = e.target.value.split(',').map(r => r.trim()).filter(r => r.length > 0);
                    handleSettingChange('notificationRecipients', recipients);
                  }}
                  placeholder="admin@example.com, moderator@example.com"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Content Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="guidelines" className="text-sm font-medium">
              Guidelines for Users
            </Label>
            <Textarea
              id="guidelines"
              value={settings.contentGuidelines}
              onChange={(e) => handleSettingChange('contentGuidelines', e.target.value)}
              rows={8}
              placeholder="Enter content guidelines for users..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Status */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">
                You have unsaved changes
              </span>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { AdminSettingsContent };

