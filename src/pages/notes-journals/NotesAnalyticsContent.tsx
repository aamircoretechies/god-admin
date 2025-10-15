import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Tag, 
  BookOpen, 
  Volume2, 
  Smartphone,
  Monitor,
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  notesCreated: {
    daily: [12, 19, 15, 25, 22, 30, 28],
    weekly: [85, 120, 95, 150, 180, 220, 195],
    monthly: [450, 520, 480, 600, 680, 750, 720, 800, 780, 850, 920, 890]
  },
  topTags: [
    { name: 'Faith', count: 245, percentage: 18 },
    { name: 'Prayer', count: 198, percentage: 15 },
    { name: 'Love', count: 156, percentage: 12 },
    { name: 'Hope', count: 134, percentage: 10 },
    { name: 'Trust', count: 112, percentage: 8 },
    { name: 'Gratitude', count: 98, percentage: 7 },
    { name: 'Study', count: 87, percentage: 6 },
    { name: 'Comfort', count: 76, percentage: 6 }
  ],
  bibleBooks: [
    { name: 'Psalms', count: 156, percentage: 22 },
    { name: 'Romans', count: 89, percentage: 13 },
    { name: 'John', count: 67, percentage: 10 },
    { name: 'Matthew', count: 54, percentage: 8 },
    { name: 'Genesis', count: 45, percentage: 6 },
    { name: 'Proverbs', count: 38, percentage: 5 },
    { name: 'Isaiah', count: 32, percentage: 5 },
    { name: 'Others', count: 234, percentage: 31 }
  ],
  usageByMode: [
    { name: 'Typed', count: 892, percentage: 68 },
    { name: 'Voice Dictated', count: 234, percentage: 18 },
    { name: 'Audio Recording', count: 187, percentage: 14 }
  ],
  statusDistribution: [
    { name: 'Active', count: 1156, percentage: 88 },
    { name: 'Flagged', count: 89, percentage: 7 },
    { name: 'Deleted', count: 68, percentage: 5 }
  ]
};

// Simple chart components (you can replace with actual chart libraries like recharts)
const SimpleBarChart: React.FC<{ data: number[], labels: string[], title: string }> = ({ data, labels, title }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="flex items-end gap-1 h-32">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="bg-blue-500 rounded-t w-full"
            style={{ height: `${(value / Math.max(...data)) * 100}%` }}
          />
          <span className="text-xs text-gray-500 mt-1">{labels[index]}</span>
        </div>
      ))}
    </div>
  </div>
);

const SimplePieChart: React.FC<{ data: Array<{ name: string, count: number, percentage: number }>, title: string }> = ({ data, title }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }}
            />
            <span className="text-sm">{item.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.count}</span>
            <span className="text-xs text-gray-500">({item.percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NotesAnalyticsContent: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<string>('notes');

  const getTimeLabels = (range: string) => {
    switch (range) {
      case 'daily':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'weekly':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
      case 'monthly':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return [];
    }
  };

  const getChartData = (range: string) => {
    return mockChartData.notesCreated[range as keyof typeof mockChartData.notesCreated] || [];
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">1,313</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Tag className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Tags</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-green-600">+15% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verse References</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-xs text-green-600">+20% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Created Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Notes Created Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={getChartData(timeRange)}
              labels={getTimeLabels(timeRange)}
              title={`Notes created (${timeRange})`}
            />
          </CardContent>
        </Card>

        {/* Usage by Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Usage by Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={mockChartData.usageByMode}
              title="How users create notes"
            />
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Most Used Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockChartData.topTags.slice(0, 8).map((tag, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{tag.name}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tag.count}</span>
                    <span className="text-xs text-gray-500">({tag.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bible Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Most Referenced Bible Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={mockChartData.bibleBooks}
              title="Bible books referenced in notes"
            />
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Notes Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={mockChartData.statusDistribution}
              title="Current status of all notes"
            />
          </CardContent>
        </Card>

        {/* Platform Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Mobile App</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">892</span>
                  <span className="text-xs text-gray-500">(68%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Web Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">421</span>
                  <span className="text-xs text-gray-500">(32%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Voice Notes Increasing</p>
                <p className="text-sm text-green-700">23% more voice recordings this month</p>
              </div>
              <Volume2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Psalm References Up</p>
                <p className="text-sm text-blue-700">Most referenced book this month</p>
              </div>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">New Users Active</p>
                <p className="text-sm text-yellow-700">45% of new users created notes</p>
              </div>
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Flagged Notes</span>
              <Badge variant="destructive">89</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-flagged</span>
              <span className="text-sm font-medium">67 (75%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User-reported</span>
              <span className="text-sm font-medium">22 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Response Time</span>
              <span className="text-sm font-medium">2.3 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">False Positives</span>
              <span className="text-sm font-medium">12 (13%)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { NotesAnalyticsContent };

