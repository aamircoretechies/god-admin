import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  // ToolbarActions, // Commented out - not used
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { NoteDetailContent } from './NoteDetailContent';

const NoteDetail = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Review and moderate individual notes and journal entries.
              </ToolbarDescription>
            </ToolbarHeading>
            {/* ToolbarActions - Commented out (Export PDF and Approve Note buttons removed)
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export PDF
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Approve Note
              </a>
            </ToolbarActions>
            */}
          </Toolbar>
        </Container>
      )}

      <Container>
        <NoteDetailContent />
      </Container>
    </Fragment>
  );
};

export default NoteDetail;
