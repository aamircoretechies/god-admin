import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  MessageSquare,
  Flag,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { fetchDashboardAnalytics } from '@/services/dashboardApi';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
  period?: string;
}

interface KPICardWithNavigation extends KPICardProps {
  navigationPath?: string;
}

const KPICard: React.FC<KPICardWithNavigation> = ({
  title,
  value,
  change,
  changeType,
  icon,
  description,
  period,
  navigationPath
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigationPath) {
      navigate(navigationPath);
    }
  };

  return (
    <Card
      className={navigationPath ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
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
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="ml-1">{period || 'from last week'}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const BibleKPICards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<KPICardWithNavigation[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDashboardAnalytics('30d');

        if (response.status === 1 && response.data) {
          const { mainKPIs } = response.data;

          const transformedData: KPICardWithNavigation[] = [
            {
              title: mainKPIs.totalUsers.label,
              value: mainKPIs.totalUsers.value,
              change: mainKPIs.totalUsers.growth,
              changeType: mainKPIs.totalUsers.trend === 'up' ? 'increase' : 'decrease',
              icon: <Users className="h-4 w-4 text-amber-500" />,
              description: mainKPIs.totalUsers.description,
              period: mainKPIs.totalUsers.period,
              navigationPath: '/network/user-table/saas-users'
            },
            {
              title: mainKPIs.dailyAIQueries.label,
              value: mainKPIs.dailyAIQueries.value,
              change: mainKPIs.dailyAIQueries.growth,
              changeType: mainKPIs.dailyAIQueries.trend === 'up' ? 'increase' : 'decrease',
              icon: <MessageSquare className="h-4 w-4 text-green-500" />,
              description: mainKPIs.dailyAIQueries.description,
              period: mainKPIs.dailyAIQueries.period,
              navigationPath: '/bible-content/ai-explanations'
            },
            {
              title: mainKPIs.flaggedResponses.label,
              value: mainKPIs.flaggedResponses.value,
              change: mainKPIs.flaggedResponses.growth,
              changeType: mainKPIs.flaggedResponses.trend === 'up' ? 'increase' : 'decrease',
              icon: <Flag className="h-4 w-4 text-red-500" />,
              description: mainKPIs.flaggedResponses.description,
              period: mainKPIs.flaggedResponses.period,
              navigationPath: '/feedback/ai-flags'
            },
            {
              title: mainKPIs.activeTranslations.label,
              value: mainKPIs.activeTranslations.value,
              change: mainKPIs.activeTranslations.growth,
              changeType: mainKPIs.activeTranslations.trend === 'up' ? 'increase' : 'decrease',
              icon: <BookOpen className="h-4 w-4 text-purple-500" />,
              description: mainKPIs.activeTranslations.description,
              period: mainKPIs.activeTranslations.period,
              navigationPath: '/bible-content/translations'
            }
          ];

          setKpiData(transformedData);
        } else {
          throw new Error(response.message || 'Failed to fetch dashboard analytics');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard analytics');
        // Set default/fallback data on error
        setKpiData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="md:col-span-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          period={kpi.period}
          navigationPath={kpi.navigationPath}
        />
      ))}
    </div>
  );
};

export { BibleKPICards };
