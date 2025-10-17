import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

interface TopVerse {
  verse: string;
  views: number;
  aiQueries: number;
  book: string;
  chapter: number;
  verseNumber: number;
}

interface TopicAnalytics {
  topic: string;
  queries: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

const BibleAnalyticsContent = () => {
  const [dateRange, setDateRange] = useState('7d');

  const topVerses: TopVerse[] = [
    {
      verse: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      views: 1247,
      aiQueries: 89,
      book: 'John',
      chapter: 3,
      verseNumber: 16
    },
    {
      verse: 'The Lord is my shepherd, I lack nothing.',
      views: 892,
      aiQueries: 67,
      book: 'Psalm',
      chapter: 23,
      verseNumber: 1
    },
    {
      verse: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      views: 756,
      aiQueries: 54,
      book: 'Romans',
      chapter: 8,
      verseNumber: 28
    },
    {
      verse: 'You are the light of the world. A town built on a hill cannot be hidden.',
      views: 634,
      aiQueries: 43,
      book: 'Matthew',
      chapter: 5,
      verseNumber: 14
    },
    {
      verse: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
      views: 521,
      aiQueries: 38,
      book: '1 Corinthians',
      chapter: 13,
      verseNumber: 4
    }
  ];

  const topicAnalytics: TopicAnalytics[] = [
    { topic: 'Salvation', queries: 234, trend: 'up', percentage: 28.5 },
    { topic: 'Love', queries: 189, trend: 'up', percentage: 23.0 },
    { topic: 'Faith', queries: 156, trend: 'stable', percentage: 19.0 },
    { topic: 'Hope', queries: 134, trend: 'down', percentage: 16.3 },
    { topic: 'Forgiveness', queries: 109, trend: 'up', percentage: 13.2 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Analytics Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Verse Views</p>
                <p className="text-2xl font-bold">12,847</p>
                <p className="text-xs text-green-600">+12.5% from last week</p>
              </div>
              <BookOpen className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Queries</p>
                <p className="text-2xl font-bold">3,421</p>
                <p className="text-xs text-green-600">+8.2% from last week</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">2,156</p>
                <p className="text-xs text-green-600">+15.3% from last week</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Time</p>
                <p className="text-2xl font-bold">4.2m</p>
                <p className="text-xs text-red-600">-2.1% from last week</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Verses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Top Verses by Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topVerses.map((verse, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium">{verse.book} {verse.chapter}:{verse.verseNumber}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{verse.verse}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{verse.views} views</span>
                    <span>{verse.aiQueries} AI queries</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-600">{verse.views}</div>
                  <div className="text-xs text-gray-500">total views</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Popular Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicAnalytics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span className="font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(topic.trend)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{topic.queries}</div>
                    <div className="text-xs text-gray-500">{topic.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Query Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicAnalytics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    <span className={`text-sm font-bold ${getTrendColor(topic.trend)}`}>
                      {topic.queries} queries
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">API Uptime</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">245ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1.2s</div>
              <div className="text-sm text-gray-600">AI Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BibleAnalyticsContent };

