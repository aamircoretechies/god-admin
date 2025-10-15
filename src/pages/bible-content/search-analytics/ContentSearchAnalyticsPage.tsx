import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { ContentSearchAnalyticsContent } from './ContentSearchAnalyticsContent';
import { useLayout } from '@/providers';

const ContentSearchAnalyticsPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Search Bible content and view engagement analytics.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                View Reports
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Export Analytics
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ContentSearchAnalyticsContent />
      </Container>
    </Fragment>
  );
};

export { ContentSearchAnalyticsPage }; 