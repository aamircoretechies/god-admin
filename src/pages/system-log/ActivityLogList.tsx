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
import { ActivityLogListContent } from './ActivityLogListContent';
import { fetchActivityLogs } from '@/services/activityLogsApi';
import { toast } from 'sonner';

const ActivityLogList = () => {
  const { currentLayout } = useLayout();

  const handleExportCSV = async () => {
    try {
      // Fetch all activity logs (with a large limit to get all data)
      const response = await fetchActivityLogs({ limit: 10000 });
      if (response.status === 1 && response.data) {
        // Prepare CSV headers
        const csvHeaders = [
          'Log ID',
          'User ID',
          'User Name',
          'User Email',
          'User Role',
          'Activity Type',
          'Details',
          'Verse Reference',
          'Device',
          'Platform',
          'IP Address',
          'Location',
          'Session ID',
          'Status',
          'Error Message',
          'Timestamp'
        ];

        // Prepare CSV rows
        const csvRows = response.data.map((log) => [
          log.log_id,
          log.user.userId,
          log.user.name,
          log.user.email,
          log.user.role,
          log.activityType,
          log.details || '',
          log.verseReference || '',
          log.device,
          log.device, // Platform same as device
          log.ipAddress,
          log.location || '',
          log.sessionId,
          log.status,
          log.errorMessage || '',
          log.dateTime
        ]);

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
          ...csvRows.map((row) => row.map((cell) => escapeCsvValue(String(cell || ''))).join(','))
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `activity_logs_${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Activity logs exported to CSV successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch activity logs');
      }
    } catch (error: any) {
      console.error('Error exporting activity logs:', error);
      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to export activity logs'
      );
    }
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Monitor and track user activities across the platform.
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button onClick={handleExportCSV} className="btn btn-sm btn-light">
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
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ActivityLogListContent />
      </Container>
    </Fragment>
  );
};

export default ActivityLogList;
