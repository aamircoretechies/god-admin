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
import { UserActivityDetailContent } from './UserActivityDetailContent';
import { useNavigate } from "react-router-dom";


const UserActivityDetail = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();


  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View complete activity history for a specific user.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Back to Logs
              </a> */}
              <button
                onClick={() => navigate('/system-log')}
                className="btn btn-sm btn-light"
              >
                Back to Logs
              </button>

              <a href="#" className="btn btn-sm btn-warning">
                Suspend User
              </a>
              <a href="#" className="btn btn-sm btn-danger">
                Block User
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <UserActivityDetailContent />
      </Container>
    </Fragment>
  );
};

export default UserActivityDetail;
