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
import { ViewPromptContent } from './ViewPromptContent';

const ViewPrompt = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View AI prompt template details and metadata.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Back to List
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Edit Prompt
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ViewPromptContent />
      </Container>
    </Fragment>
  );
};

export default ViewPrompt;
