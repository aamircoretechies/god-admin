import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { BibleTranslationsContent } from './BibleTranslationsContent';
import { useLayout } from '@/providers';

const BibleTranslationsPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage Bible translations and versions.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Import Translation
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add New Translation
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BibleTranslationsContent />
      </Container>
    </Fragment>
  );
};

export { BibleTranslationsPage }; 