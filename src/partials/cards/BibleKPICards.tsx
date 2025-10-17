import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  Flag, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon, description }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          {changeType === 'increase' ? (
            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
          )}
          <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
            {change}%
          </span>
          <span className="ml-1">from last week</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const BibleKPICards = () => {
  const kpiData = [
    {
      title: 'Total Users',
      value: '12,847',
      change: 12.5,
      changeType: 'increase' as const,
      icon: <Users className="h-4 w-4 text-amber-500" />,
      description: 'Active registered users'
    },
    {
      title: 'Daily AI Queries',
      value: '3,421',
      change: 8.2,
      changeType: 'increase' as const,
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      description: 'AI explanations requested today'
    },
    {
      title: 'Flagged Responses',
      value: '23',
      change: -15.3,
      changeType: 'decrease' as const,
      icon: <Flag className="h-4 w-4 text-red-500" />,
      description: 'AI responses flagged for review'
    },
    {
      title: 'Active Translations',
      value: '47',
      change: 2.1,
      changeType: 'increase' as const,
      icon: <BookOpen className="h-4 w-4 text-purple-500" />,
      description: 'Bible translations available'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          changeType={kpi.changeType}
          icon={kpi.icon}
          description={kpi.description}
        />
      ))}
    </div>
  );
};

export { BibleKPICards };

