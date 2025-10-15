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
import { PromptHistoryContent } from './PromptHistoryContent';

const PromptHistory = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View version history and changes for AI prompt templates.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Back to Prompt
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Restore Version
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PromptHistoryContent />
      </Container>
    </Fragment>
  );
};

export default PromptHistory;
