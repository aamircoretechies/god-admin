import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { TheologicalInsightsContent } from './TheologicalInsightsContent';
import { useLayout } from '@/providers';

const TheologicalInsightsPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage theological insights, reflections, and devotional content.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                View Guidelines
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Create Insight
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <TheologicalInsightsContent />
      </Container>
    </Fragment>
  );
};

export { TheologicalInsightsPage }; 