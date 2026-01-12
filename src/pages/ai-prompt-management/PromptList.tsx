import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { PromptListContent } from './PromptListContent';
import { fetchPrompts } from '@/services/promptsApi';
import { toast } from 'sonner';

const PromptList = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  const handleAddNewPrompt = () => {
    navigate('/ai-prompt-management/add');
  };

  const handleExportPrompts = async () => {
    try {
      // Fetch all prompts for export (using a large limit to get all)
      const response = await fetchPrompts({
        page: 1,
        limit: 10000 // Large limit to get all prompts
      });

      if (response.status === 1 && response.data && response.data.length > 0) {
        // Convert prompts to CSV format
        const headers = [
          'ID',
          'Title',
          'Description',
          'Category',
          'Target Role',
          'Language',
          'Status',
          'Version',
          'Usage Count',
          'Tags',
          'Is Public',
          'Created At',
          'Last Updated'
        ];
        const rows = response.data.map((prompt) => [
          prompt.template_id,
          prompt.title,
          prompt.description || '',
          prompt.category,
          prompt.target_role,
          prompt.language,
          prompt.status,
          prompt.version,
          prompt.usage_count || 0,
          (prompt.tags || []).join('; '),
          prompt.is_public ? 'Yes' : 'No',
          new Date(prompt.created_at).toLocaleDateString(),
          new Date(prompt.last_updated).toLocaleDateString()
        ]);

        // Create CSV content
        const csvContent = [
          headers.join(','),
          ...rows.map((row) =>
            row
              .map((cell) => {
                // Escape commas and quotes in cell values
                const cellStr = String(cell || '');
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                  return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
              })
              .join(',')
          )
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `prompts_export_${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Successfully exported ${response.data.length} prompt(s)`);
      } else {
        toast.warning('No prompts available to export');
      }
    } catch (error: any) {
      console.error('Error exporting prompts:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to export prompts');
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
                Manage AI prompt templates for verse explanations, summaries, and reflections.
              </ToolbarDescription>
            </ToolbarHeading>
            {/* <ToolbarActions> */}
            <ToolbarActions>
              <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                <button onClick={handleExportPrompts} className="btn btn-sm btn-light">
                  Export Prompts
                </button>
                <button onClick={handleAddNewPrompt} className="btn btn-sm btn-primary">
                  Add New Prompt
                </button>
              </div>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PromptListContent />
      </Container>
    </Fragment>
  );
};

export default PromptList;
