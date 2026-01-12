import { Fragment, useState } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
// import { AddEditPromptContent } from './AddEditPromptContent';
import AddEditPromptContent from './AddEditPromptContent';

import { useRef } from 'react';

const AddEditPrompt = () => {
  const { currentLayout } = useLayout();
  const contentRef = useRef<{
    submit: () => void;
    cancel: () => void;
  }>(null);

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Create or edit AI prompt templates for biblical content generation.
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Cancel
              </a> */}
              <button className="btn btn-sm btn-light" onClick={() => contentRef.current?.cancel()}>
                Cancel
              </button>

              {/* <a href="#" className="btn btn-sm btn-primary">
                Save Prompt
              </a> */}
              <button
                className="btn btn-sm btn-primary"
                onClick={() => contentRef.current?.submit()}
              >
                Save Prompt
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        {/* <AddEditPromptContent /> */}
        <AddEditPromptContent ref={contentRef} />
      </Container>
    </Fragment>
  );
};

export default AddEditPrompt;
