import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { AIExplanationManagementContent } from './AIExplanationManagementContent';
import { useLayout } from '@/providers';

const AIExplanationManagementPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Review and manage AI-generated Bible explanations.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Review Guidelines
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Create Explanation
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AIExplanationManagementContent />
      </Container>
    </Fragment>
  );
};

export { AIExplanationManagementPage }; 