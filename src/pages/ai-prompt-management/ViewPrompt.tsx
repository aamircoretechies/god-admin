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
import { ViewPromptContent } from './ViewPromptContent';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ViewPrompt = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View AI prompt template details and metadata.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/ai-prompt-management')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
              {/* View History - Commented out
              <Button variant="outline" size="sm">
                View History
              </Button>
              */}
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ViewPromptContent />
      </Container>
    </Fragment>
  );
};

export default ViewPrompt;
