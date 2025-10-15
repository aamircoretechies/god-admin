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
import { SubscriptionManagementContent } from './SubscriptionManagementContent';

const SubscriptionManagement = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage user subscriptions, roles, and billing information.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Data
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add Subscription
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <SubscriptionManagementContent />
      </Container>
    </Fragment>
  );
};

export default SubscriptionManagement;
