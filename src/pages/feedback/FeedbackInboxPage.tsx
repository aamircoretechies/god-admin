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
import { FeedbackInboxContent } from './FeedbackInboxContent';

const FeedbackInboxPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage user feedback and AI response flags.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Feedback
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Mark All Read
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <FeedbackInboxContent />
      </Container>
    </Fragment>
  );
};

export { FeedbackInboxPage };


