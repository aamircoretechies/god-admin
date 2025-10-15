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
import { SystemAlertsContent } from './SystemAlertsContent';

const SystemAlerts = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Monitor system alerts and unusual activity patterns.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Mark All Read
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Configure Alerts
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <SystemAlertsContent />
      </Container>
    </Fragment>
  );
};

export default SystemAlerts;
