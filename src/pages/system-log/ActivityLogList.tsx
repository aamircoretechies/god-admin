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

const ActivityLogList = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Monitor and track user activities across the platform.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export CSV
              </a>
              <a href="#" className="btn btn-sm btn-light">
                Export Excel
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Export PDF
              </a>
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
