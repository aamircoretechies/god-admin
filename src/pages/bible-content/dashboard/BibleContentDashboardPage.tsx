import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { BibleContentDashboardContent } from './BibleContentDashboardContent';
import { useLayout } from '@/providers';
import { fetchBibleDashboard } from '@/services/bibleContentApi';
import { toast } from 'sonner';

const BibleContentDashboardPage = () => {
  const { currentLayout } = useLayout();

  const handleExportData = async () => {
    try {
      const response = await fetchBibleDashboard();
      if (response.success && response.data) {
        // Convert dashboard data to CSV
        const headers = ['Metric', 'Value'];
        const rows = [
          ['Total Translations', response.data.overview.totalTranslations],
          ['Total Verses', response.data.overview.totalVerses],
          ['Active Translations', response.data.overview.activeTranslations],
          ['AI Explanations', response.data.overview.aiExplanations],
          ['Flagged Content', response.data.overview.flaggedContent],
          ['Pending Updates', response.data.translationsByStatus.Pending || 0],
        ];

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => {
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bible_content_dashboard_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Dashboard data exported successfully');
      } else {
        toast.error('Failed to export dashboard data');
      }
    } catch (error: any) {
      console.error('Error exporting dashboard data:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to export dashboard data');
    }
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage Bible translations, content, and AI explanations.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button 
                onClick={handleExportData}
                className="btn btn-sm btn-light"
              >
                Export Data
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BibleContentDashboardContent />
      </Container>
    </Fragment>
  );
};

export { BibleContentDashboardPage }; 