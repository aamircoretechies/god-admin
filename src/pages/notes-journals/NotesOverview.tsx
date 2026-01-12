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
import { NotesOverviewContent } from './NotesOverviewContent';
import { fetchNotes } from '@/services/notesApi';
import { toast } from 'sonner';

const NotesOverview = () => {
  const { currentLayout } = useLayout();

  const handleExportCSV = async () => {
    try {
      // Fetch all notes (with a large limit to get all data)
      const response = await fetchNotes({ page: 1, limit: 10000 });
      if (response.status === 1 && response.data) {
        // Prepare CSV headers
        const csvHeaders = [
          'Note ID',
          'User ID',
          'User Name',
          'Verse ID',
          'Reflection ID',
          'Content',
          'Emotion Tags',
          'Created At',
          'Updated At'
        ];

        // Prepare CSV rows
        const csvRows = response.data.map((note) => [
          note.note_id,
          note.user_id,
          note.username || '',
          note.verse_id || '',
          note.reflection_id || '',
          note.content || '',
          note.emotion_tags?.join('; ') || '',
          note.created_at,
          note.updated_at
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
        link.setAttribute('download', `notes_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Notes exported to CSV successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch notes');
      }
    } catch (error: any) {
      console.error('Error exporting notes:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to export notes');
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
                Manage and moderate user notes and journal entries.
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
              {/* View Guidelines - Commented out
              <a href="#" className="btn btn-sm btn-primary">
                View Guidelines
              </a>
              */}
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <NotesOverviewContent />
      </Container>
    </Fragment>
  );
};

export default NotesOverview;
