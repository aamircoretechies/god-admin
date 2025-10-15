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
import { PromptListContent } from './PromptListContent';

const PromptList = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Manage AI prompt templates for verse explanations, summaries, and reflections.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Prompts
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add New Prompt
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PromptListContent />
      </Container>
    </Fragment>
  );
};

export default PromptList;
