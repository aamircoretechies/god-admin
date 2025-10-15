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

const NotesOverview = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage and moderate user notes and journal entries.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Data
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                View Guidelines
              </a>
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
