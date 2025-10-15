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
import { MonetizationDashboardContent } from './MonetizationDashboardContent';

const MonetizationDashboard = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Monitor and manage subscription revenue and user monetization.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Report
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                View Analytics
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <MonetizationDashboardContent />
      </Container>
    </Fragment>
  );
};

export default MonetizationDashboard;
