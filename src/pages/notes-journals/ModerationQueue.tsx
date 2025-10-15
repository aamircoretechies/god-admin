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
import { ModerationQueueContent } from './ModerationQueueContent';

const ModerationQueue = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Review flagged notes and journal entries requiring moderation.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Queue
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Bulk Approve
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ModerationQueueContent />
      </Container>
    </Fragment>
  );
};

export default ModerationQueue;
