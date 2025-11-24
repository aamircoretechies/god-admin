import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { ActivityAnalyticsContent } from './ActivityAnalyticsContent';
import { fetchActivityAnalytics } from '@/services/activityLogsApi';
import { toast } from 'sonner';

const ActivityAnalytics = () => {
  const { currentLayout } = useLayout();

  const handleExportCSV = async () => {
    try {
      // Fetch analytics data (default 7 days)
      const response = await fetchActivityAnalytics(7);
      if (response.status === 1 && response.data) {
        const data = response.data;
        
        // Prepare CSV headers
        const csvHeaders = [
          'Metric Type',
          'Metric Name',
          'Value',
          'Growth',
          'Trend'
        ];

        // Prepare CSV rows
        const csvRows: string[][] = [];

        // Add metrics
        csvRows.push(['Metrics', 'Active Users', String(data.metrics.activeUsers.value), String(data.metrics.activeUsers.growth), data.metrics.activeUsers.trend]);
        csvRows.push(['Metrics', 'Total Activities', String(data.metrics.totalActivities.value), String(data.metrics.totalActivities.growth), data.metrics.totalActivities.trend]);
        csvRows.push(['Metrics', 'Success Rate', String(data.metrics.successRate.value), String(data.metrics.successRate.growth), data.metrics.successRate.trend]);
        csvRows.push(['Metrics', 'Error Rate', String(data.metrics.errorRate.value), String(data.metrics.errorRate.growth), data.metrics.errorRate.trend]);

        // Add activity types distribution
        data.activityTypesDistribution.forEach(item => {
          csvRows.push(['Activity Type Distribution', item.type, String(item.count), '', '']);
        });

        // Add top verses
        data.topVerses.forEach(item => {
          csvRows.push(['Top Verses', item.verse, String(item.count), '', '']);
        });

        // Add device breakdown
        data.deviceBreakdown.forEach(item => {
          csvRows.push(['Device Breakdown', item.device, String(item.count), item.percentage, '']);
        });

        // Add daily active users
        data.dailyActiveUsers.forEach((value, index) => {
          csvRows.push(['Daily Active Users', `Day ${index + 1}`, String(value), '', '']);
        });

        // Add error rate trend
        data.errorRateTrend.forEach((value, index) => {
          csvRows.push(['Error Rate Trend', `Day ${index + 1}`, String(value), '', '']);
        });

        // Escape CSV values
        const escapeCsvValue = (value: string): string => {
          const cellStr = String(value || '');
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        };

        // Build CSV content
        const csvContent = [
          csvHeaders.map(escapeCsvValue).join(','),
          ...csvRows.map(row => row.map(cell => escapeCsvValue(String(cell || ''))).join(','))
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `activity_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Activity analytics exported to CSV successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch analytics data');
      }
    } catch (error: any) {
      console.error('Error exporting activity analytics:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to export activity analytics');
    }
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Analytics and insights for user activity patterns.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button 
                onClick={handleExportCSV}
                className="btn btn-sm btn-light"
              >
                Export CSV
              </button>
              {/* Export Excel - Commented out
              <a href="#" className="btn btn-sm btn-light">
                Export Excel
              </a>
              */}
              {/* Export PDF - Commented out
              <a href="#" className="btn btn-sm btn-primary">
                Export PDF
              </a>
              */}
              <a href="#" className="btn btn-sm btn-primary">
                Generate Insights
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ActivityAnalyticsContent />
      </Container>
    </Fragment>
  );
};

export default ActivityAnalytics;
