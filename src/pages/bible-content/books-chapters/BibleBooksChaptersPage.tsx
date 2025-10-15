import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { BibleBooksChaptersContent } from './BibleBooksChaptersContent';
import { useLayout } from '@/providers';

const BibleBooksChaptersPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage Bible books, chapters, and verses.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Import Structure
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add New Book
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BibleBooksChaptersContent />
      </Container>
    </Fragment>
  );
};

export { BibleBooksChaptersPage }; 