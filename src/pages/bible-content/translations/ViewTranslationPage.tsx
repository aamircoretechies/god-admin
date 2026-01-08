import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { ViewTranslationContent } from './ViewTranslationContent';
import { useLayout } from '@/providers';

const ViewTranslationPage = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View translation details and information.</ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ViewTranslationContent />
      </Container>
    </Fragment>
  );
};

export { ViewTranslationPage };

