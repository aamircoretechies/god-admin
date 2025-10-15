import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { SettingsSidebarContent } from './SettingsSidebarContent';
import { useLayout } from '@/providers';

const SettingsSidebarPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>System Configuration and Administration Settings</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Settings
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Save Changes
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <SettingsSidebarContent />
      </Container>
    </Fragment>
  );
};

export { SettingsSidebarPage };
