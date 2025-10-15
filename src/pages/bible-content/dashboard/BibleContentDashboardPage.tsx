import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { BibleContentDashboardContent } from './BibleContentDashboardContent';
import { useLayout } from '@/providers';

const BibleContentDashboardPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage Bible translations, content, and AI explanations.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Data
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Upload Translation
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BibleContentDashboardContent />
      </Container>
    </Fragment>
  );
};

export { BibleContentDashboardPage }; 