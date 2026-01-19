import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
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
import { DeleteUserModal } from './blocks/DeleteUserModal';
import { useState } from 'react';

const NetworkUserDetailPage = () => {
  const { currentLayout } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteUser = () => {
    if (!id) {
      toast.error('User ID is required');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(id);
      if (response.status === 1) {
        toast.success('User deleted successfully');
        setIsDeleteModalOpen(false);
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
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-sm btn-light flex items-center gap-1"
                >
                  <KeenIcon icon="black-left" />
                  Back
                </button>
                <ToolbarPageTitle />
              </div>
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
              {/* <button
                onClick={handleEditProfile}
                className="btn btn-sm btn-primary"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Edit Profile
              </button> */}
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <NetworkUserDetailContent />
      </Container>

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={onConfirmDelete}
        isDeleting={isDeleting}
      />
    </Fragment>
  );
};

export { NetworkUserDetailPage };
