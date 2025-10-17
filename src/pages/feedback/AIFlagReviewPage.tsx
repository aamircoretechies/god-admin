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
import { AIFlagReviewContent } from './AIFlagReviewContent';

const AIFlagReviewPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Review and moderate flagged AI responses.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Flags
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Bulk Actions
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AIFlagReviewContent />
      </Container>
    </Fragment>
  );
};

export { AIFlagReviewPage };


