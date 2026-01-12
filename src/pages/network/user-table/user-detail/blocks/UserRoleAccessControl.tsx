import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';

const UserRoleAccessControl = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<UserProfileResponse['data']['roleAndAccess'] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadRoleData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUserProfile(id);
        if (response.status === 1 && response.data?.roleAndAccess) {
          setRoleData(response.data.roleAndAccess);
        } else {
          setError('Failed to load role data');
        }
      } catch (err: any) {
        console.error('Error loading role data:', err);
        setError(err?.message || 'Failed to load role data');
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [id]);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Loading role data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roleData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error || 'Failed to load role data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="shield-tick" className="me-2" />
          Role & Access Control
        </h3>
      </div>
      <div className="card-body">
        <div className="space-y-6">
          {/* Current Role */}
          <div className="pb-4 border-b">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Role</h4>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {roleData.currentRole}
              </span>
            </div>
          </div>

          {/* Basic Permissions List */}
          <div className="pb-4 border-b">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Permissions List</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleData.basicPermissionsList && roleData.basicPermissionsList.length > 0 ? (
                roleData.basicPermissionsList.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <KeenIcon icon="check" className="size-4 text-success flex-shrink-0" />
                    <span className="text-sm text-gray-900">{permission}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No permissions listed</p>
              )}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Restrictions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleData.restrictions && roleData.restrictions.length > 0 ? (
                roleData.restrictions.map((restriction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <KeenIcon icon="cross" className="size-4 text-danger flex-shrink-0" />
                    <span className="text-sm text-gray-600">{restriction}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No restrictions listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserRoleAccessControl };
