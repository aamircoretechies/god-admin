import { Fragment } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { ViewChapterContent } from './ViewChapterContent';
import { useLayout } from '@/providers';
import { useNavigate } from "react-router-dom";


const ViewChapterPage = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();


  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View chapter details and verses.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Back to List
              </a> */}

              <button
                className="btn btn-sm btn-light"
                onClick={() => navigate('/bible-content/books-chapters')}
              >
                Back to List
              </button>

            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ViewChapterContent />
      </Container>
    </Fragment>
  );
};

export { ViewChapterPage };

