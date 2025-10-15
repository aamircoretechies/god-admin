import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Mail,
  Clock,
  Calendar,
  Users,
  Send,
  Settings,
  Eye,
  Copy
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'reminder' | 'encouragement' | 'milestone' | 'completion';
  subject: string;
  message: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  isActive: boolean;
  createdAt: string;
  lastSent: string;
  sentCount: number;
}

interface NotificationSchedule {
  id: string;
  planId: string;
  planTitle: string;
  templateId: string;
  templateName: string;
  frequency: string;
  time: string;
  isActive: boolean;
  nextSend: string;
  recipients: number;
}

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Daily Reading Reminder',
    type: 'reminder',
    subject: 'Your Daily Bible Reading Awaits',
    message: 'Hi {{user_name}},\n\nDon\'t forget to complete today\'s reading from {{plan_title}}. You\'re making great progress!\n\nToday\'s reading: {{today_chapter}}\n\nKeep up the great work!\n\nBlessings,\nThe Bible App Team',
    frequency: 'daily',
    isActive: true,
    createdAt: '2024-01-15',
    lastSent: '2024-01-21',
    sentCount: 1250
  },
  {
    id: '2',
    name: 'Weekly Progress Update',
    type: 'encouragement',
    subject: 'Your Weekly Reading Progress',
    message: 'Hi {{user_name}},\n\nGreat news! You\'ve completed {{completed_chapters}} chapters this week in {{plan_title}}.\n\nYou\'re {{progress_percentage}}% through your reading plan. Keep going!\n\nThis week\'s highlight: {{weekly_highlight}}\n\nStay blessed!\n\nThe Bible App Team',
    frequency: 'weekly',
    isActive: true,
    createdAt: '2024-01-15',
    lastSent: '2024-01-20',
    sentCount: 890
  },
  {
    id: '3',
    name: 'Milestone Achievement',
    type: 'milestone',
    subject: 'Congratulations on Your Milestone!',
    message: 'Hi {{user_name}},\n\n🎉 Congratulations! You\'ve reached a major milestone in {{plan_title}}.\n\nYou\'ve completed {{milestone_chapters}} chapters - that\'s amazing!\n\nKeep up the excellent work and continue your spiritual journey.\n\nBlessings,\nThe Bible App Team',
    frequency: 'custom',
    isActive: true,
    createdAt: '2024-01-15',
    lastSent: '2024-01-19',
    sentCount: 340
  },
  {
    id: '4',
    name: 'Plan Completion',
    type: 'completion',
    subject: 'Congratulations on Completing Your Reading Plan!',
    message: 'Hi {{user_name}},\n\n🎊 Amazing! You\'ve successfully completed {{plan_title}}!\n\nYou\'ve read {{total_chapters}} chapters and grown in your faith journey.\n\nWe\'re so proud of your dedication and commitment.\n\nWhat\'s next? Check out our other reading plans to continue your spiritual growth.\n\nBlessings,\nThe Bible App Team',
    frequency: 'custom',
    isActive: true,
    createdAt: '2024-01-15',
    lastSent: '2024-01-18',
    sentCount: 120
  }
];

const mockSchedules: NotificationSchedule[] = [
  {
    id: '1',
    planId: '1',
    planTitle: '30-Day New Testament',
    templateId: '1',
    templateName: 'Daily Reading Reminder',
    frequency: 'Daily at 9:00 AM',
    time: '09:00',
    isActive: true,
    nextSend: '2024-01-22 09:00',
    recipients: 1250
  },
  {
    id: '2',
    planId: '1',
    planTitle: '30-Day New Testament',
    templateId: '2',
    templateName: 'Weekly Progress Update',
    frequency: 'Weekly on Sunday at 10:00 AM',
    time: '10:00',
    isActive: true,
    nextSend: '2024-01-28 10:00',
    recipients: 1250
  },
  {
    id: '3',
    planId: '2',
    planTitle: 'Psalms in 7 Days',
    templateId: '1',
    templateName: 'Daily Reading Reminder',
    frequency: 'Daily at 8:00 AM',
    time: '08:00',
    isActive: true,
    nextSend: '2024-01-22 08:00',
    recipients: 890
  }
];

const ReadingPlanNotificationsPage = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates);
  const [schedules, setSchedules] = useState<NotificationSchedule[]>(mockSchedules);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<NotificationSchedule | null>(null);
  const [templateFormData, setTemplateFormData] = useState<Partial<NotificationTemplate>>({
    name: '',
    type: 'reminder',
    subject: '',
    message: '',
    frequency: 'daily',
    isActive: true
  });
  const [scheduleFormData, setScheduleFormData] = useState<Partial<NotificationSchedule>>({
    planId: '',
    templateId: '',
    frequency: 'daily',
    time: '09:00',
    isActive: true
  });

  const readingPlans = [
    { id: '1', title: '30-Day New Testament' },
    { id: '2', title: 'Psalms in 7 Days' },
    { id: '3', title: 'Gospel of John Study' }
  ];

  const handleCreateTemplate = () => {
    setIsCreatingTemplate(true);
    setEditingTemplate(null);
    setTemplateFormData({
      name: '',
      type: 'reminder',
      subject: '',
      message: '',
      frequency: 'daily',
      isActive: true
    });
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setIsCreatingTemplate(false);
    setTemplateFormData(template);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...templateFormData, id: editingTemplate.id } as NotificationTemplate : t));
      setEditingTemplate(null);
    } else {
      const newTemplate: NotificationTemplate = {
        ...templateFormData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        lastSent: '',
        sentCount: 0
      } as NotificationTemplate;
      setTemplates([...templates, newTemplate]);
      setIsCreatingTemplate(false);
    }
    setTemplateFormData({
      name: '',
      type: 'reminder',
      subject: '',
      message: '',
      frequency: 'daily',
      isActive: true
    });
  };

  const handleCreateSchedule = () => {
    setIsCreatingSchedule(true);
    setEditingSchedule(null);
    setScheduleFormData({
      planId: '',
      templateId: '',
      frequency: 'daily',
      time: '09:00',
      isActive: true
    });
  };

  const handleEditSchedule = (schedule: NotificationSchedule) => {
    setEditingSchedule(schedule);
    setIsCreatingSchedule(false);
    setScheduleFormData(schedule);
  };

  const handleSaveSchedule = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...scheduleFormData, id: editingSchedule.id } as NotificationSchedule : s));
      setEditingSchedule(null);
    } else {
      const newSchedule: NotificationSchedule = {
        ...scheduleFormData,
        id: Date.now().toString(),
        planTitle: readingPlans.find(p => p.id === scheduleFormData.planId)?.title || '',
        templateName: templates.find(t => t.id === scheduleFormData.templateId)?.name || '',
        nextSend: new Date().toISOString(),
        recipients: 0
      } as NotificationSchedule;
      setSchedules([...schedules, newSchedule]);
      setIsCreatingSchedule(false);
    }
    setScheduleFormData({
      planId: '',
      templateId: '',
      frequency: 'daily',
      time: '09:00',
      isActive: true
    });
  };

  const handleCancel = () => {
    setIsCreatingTemplate(false);
    setEditingTemplate(null);
    setIsCreatingSchedule(false);
    setEditingSchedule(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-800';
      case 'encouragement':
        return 'bg-green-100 text-green-800';
      case 'milestone':
        return 'bg-purple-100 text-purple-800';
      case 'completion':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Reminders</h1>
          <p className="text-gray-600 mt-2">Manage reading plan notifications and reminder settings</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateTemplate} className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
          <Button onClick={handleCreateSchedule} className="bg-primary hover:bg-primary-dark">
            <Bell className="w-4 h-4 mr-2" />
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Template Creation/Edit Form */}
      {(isCreatingTemplate || editingTemplate) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                {editingTemplate ? 'Edit Notification Template' : 'Create New Template'}
              </span>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <Input
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    placeholder="e.g., Daily Reading Reminder"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <Select
                      value={templateFormData.type}
                      onValueChange={(value) => setTemplateFormData({ ...templateFormData, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="encouragement">Encouragement</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        <SelectItem value="completion">Completion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <Select
                      value={templateFormData.frequency}
                      onValueChange={(value) => setTemplateFormData({ ...templateFormData, frequency: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <Input
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                    placeholder="Enter email subject..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={templateFormData.isActive}
                    onCheckedChange={(checked) => setTemplateFormData({ ...templateFormData, isActive: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Template
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <Textarea
                    value={templateFormData.message}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, message: e.target.value })}
                    placeholder="Enter your message content..."
                    rows={12}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Available variables: {'{{user_name}}'}, {'{{plan_title}}'}, {'{{today_chapter}}'}, {'{{progress_percentage}}'}, {'{{completed_chapters}}'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Creation/Edit Form */}
      {(isCreatingSchedule || editingSchedule) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                {editingSchedule ? 'Edit Notification Schedule' : 'Create New Schedule'}
              </span>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Plan
                  </label>
                  <Select
                    value={scheduleFormData.planId}
                    onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, planId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reading plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {readingPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Template
                  </label>
                  <Select
                    value={scheduleFormData.templateId}
                    onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, templateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <Select
                      value={scheduleFormData.frequency}
                      onValueChange={(value) => setScheduleFormData({ ...scheduleFormData, frequency: value })}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={scheduleFormData.time}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={scheduleFormData.isActive}
                    onCheckedChange={(checked) => setScheduleFormData({ ...scheduleFormData, isActive: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Schedule
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Schedule Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">
                        {readingPlans.find(p => p.id === scheduleFormData.planId)?.title || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">
                        {templates.find(t => t.id === scheduleFormData.templateId)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium">{scheduleFormData.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{scheduleFormData.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveSchedule} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Notification Templates ({templates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(template.type)}>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                    <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{template.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{template.sentCount} sent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Last: {template.lastSent || 'Never'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Created: {template.createdAt}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {template.message.substring(0, 100)}...
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Schedules ({schedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bell className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{schedule.planTitle}</h3>
                      <p className="text-sm text-gray-600">{schedule.templateName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{schedule.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Next: {schedule.nextSend}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{schedule.recipients} recipients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t">
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-1" />
                    Send Now
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditSchedule(schedule)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ReadingPlanNotificationsPage }; 