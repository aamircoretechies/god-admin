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
import { BibleAnalyticsContent } from './BibleAnalyticsContent';

const BibleAnalyticsPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Bible-specific analytics and insights for content performance.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Data
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Generate Report
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BibleAnalyticsContent />
      </Container>
    </Fragment>
  );
};

export { BibleAnalyticsPage };


