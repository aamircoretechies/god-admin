import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { NetworkUserDetailContent } from '.';
import { useLayout } from '@/providers';
import { exportUserData, deleteUser } from '@/services/usersApi';
import { useNavigate } from 'react-router-dom';

const NetworkUserDetailPage = () => {
  const { currentLayout } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleExportData = async () => {
    if (!id) {
      toast.error('User ID is required');
      return;
    }

    try {
      const response = await exportUserData(id, 'json');
      if (response.status === 1 && response.data) {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-${id}-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('User data exported successfully');
      } else {
        toast.error(response.message || 'Failed to export user data');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to export user data';
      toast.error(errorMessage);
    }
  };

  const handleEditProfile = () => {
    // Edit Profile functionality is disabled
    toast.info('Edit Profile functionality is currently disabled');
  };

  const handleDeleteUser = async () => {
    if (!id) {
      toast.error('User ID is required');
      return;
    }

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone and will delete all user data including activities, bookmarks, and preferences.')) {
      return;
    }

    try {
      const response = await deleteUser(id);
      if (response.status === 1) {
        toast.success('User deleted successfully');
        // Navigate back to user list
        navigate('/network/user-table/saas-users');
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
      
      // Handle authorization errors
      if (error?.response?.status === 403 || errorMessage.toLowerCase().includes('forbidden') || errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('You are not authorized to delete users. Please contact a super admin.');
      } else {
        toast.error(errorMessage);
      }
    }
  };


  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>User Profile & Analytics Dashboard</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button
                onClick={handleDeleteUser}
                className="btn btn-sm btn-light text-danger"
              >
                Delete User
              </button>

              <button onClick={handleExportData} className="btn btn-sm btn-light">
                Export Data
              </button>
              <button
                onClick={handleEditProfile}
                className="btn btn-sm btn-primary"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Edit Profile
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <NetworkUserDetailContent />
      </Container>
    </Fragment>
  );
};

export { NetworkUserDetailPage };
