import React, { Fragment, useState, useEffect } from 'react';
import { Users, Eye, UserPlus, Mic, AlertCircle } from 'lucide-react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { fetchDashboardAnalytics } from '@/services/dashboardApi';

interface IChannelStatsItem {
  icon: React.ReactElement;
  value: string;
  label: string;
  path?: string;
}
interface IChannelStatsItems extends Array<IChannelStatsItem> {}

// Helper function to format numbers (e.g., 1000 -> "1k", 1000000 -> "1M")
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const ChannelStats = () => {
  const [items, setItems] = useState<IChannelStatsItems>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDashboardAnalytics('30d');
        
        if (response.status === 1 && response.data) {
          const { secondaryMetrics } = response.data;
          
          const transformedItems: IChannelStatsItems = [
            {
              icon: <Users className="w-6 h-6 text-olive-500" />,
              value: formatNumber(secondaryMetrics.totalUsers.numericValue),
              label: secondaryMetrics.totalUsers.label
            },
            {
              icon: <Eye className="w-6 h-6 text-clay-500" />,
              value: formatNumber(secondaryMetrics.lessonsViews.numericValue),
              label: secondaryMetrics.lessonsViews.label
            },
            {
              icon: <UserPlus className="w-6 h-6 text-forest-500" />,
              value: formatNumber(secondaryMetrics.newUsersToday.numericValue),
              label: secondaryMetrics.newUsersToday.label
            },
            {
              icon: <Mic className="w-6 h-6 text-forest-500" />,
              value: formatNumber(secondaryMetrics.reports.numericValue),
              label: secondaryMetrics.reports.label
            }
          ];
          
          setItems(transformedItems);
        } else {
          throw new Error(response.message || 'Failed to fetch dashboard analytics');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load analytics');
        // Set empty items on error
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const renderItem = (item: IChannelStatsItem, index: number) => {
    return (
      <div
        key={index}
        className="card flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-transparent">
          {item.icon}
        </div>

        <div className="flex flex-col gap-1 pb-4 px-5">
          <span className="text-3xl font-semibold text-gray-900">{item.value}</span>
          <span className="text-2sm font-normal text-gray-700">{item.label}</span>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Fragment>
        <style>
          {`
            .channel-stats-bg {
              background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
            }
            .dark .channel-stats-bg {
              background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
            }
          `}
        </style>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-transparent">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-1 pb-4 px-5">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </Fragment>
    );
  }

  // Show error state
  if (error) {
    return (
      <Fragment>
        <style>
          {`
            .channel-stats-bg {
              background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
            }
            .dark .channel-stats-bg {
              background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
            }
          `}
        </style>
        <div className="card flex-col justify-center items-center gap-2 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg col-span-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="text-sm text-red-600 text-center px-4">{error}</p>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
