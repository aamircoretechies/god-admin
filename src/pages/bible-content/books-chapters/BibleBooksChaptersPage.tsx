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
            {/* <ToolbarActions> */}
            <ToolbarActions>
              <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-center sm:text-right">
                <span className="text-sm text-gray-500">Content management not available in Phase 1</span>
              </div>
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