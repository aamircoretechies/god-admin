import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';

const UserBasicInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfileResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile(id);
        if (response.status === 1 && response.data) {
          // Validate that basicUserInfo exists in the response
          if (!response.data.basicUserInfo) {
            console.error('API response missing basicUserInfo:', response);
            setError('Invalid user data structure received from API');
            return;
          }
          setUserData(response.data);
        } else {
          setError(response.message || 'Failed to load user data');
        }
      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
              <p className="text-sm text-gray-600 mt-2">Loading user data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error || 'User not found'}</div>
        </div>
      </div>
    );
  }

  // Check if basicUserInfo exists
  if (!userData.basicUserInfo) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">User data structure is invalid. Missing basicUserInfo.</div>
        </div>
      </div>
    );
  }

  // Generate avatar from user ID
  const avatarNumber = (parseInt(userData.basicUserInfo.userId.replace(/-/g, ''), 16) % 34) + 1;

  // memberSince is already formatted in the API response
  const memberSince = userData.basicUserInfo.memberSince || 'N/A';

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="user" className="me-2" />
          Basic User Information
        </h3>
      </div>
      <div className="card-body overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 overflow-hidden w-full">
          {/* User Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start gap-4 flex-shrink-0 lg:max-w-[280px] w-full lg:w-auto overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src={toAbsoluteUrl(`/media/avatars/300-${avatarNumber}.png`)}
                className="size-20 rounded-full"
                alt={userData.basicUserInfo.fullName}
              />
            </div>
            <div className="text-center lg:text-left w-full overflow-hidden" style={{ maxWidth: '100%' }}>
              {/* <h4 className="text-lg font-semibold text-gray-900 break-words overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', width: '100%' }}>{userData.basicUserInfo.fullName}</h4> */}
              {/* <p className="text-sm text-gray-600 break-words overflow-hidden">{memberSince}</p> */}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0 overflow-hidden" style={{ width: '100%', maxWidth: '100%' }}>
            <div className="space-y-3 min-w-0 overflow-hidden" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1">User ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 dark:bg-card dark:text-white px-2 py-1 rounded break-all overflow-hidden" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', maxWidth: '100%' }}>
                  {userData.basicUserInfo.userId}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <p className="text-sm text-gray-900 break-words overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>{userData.basicUserInfo.fullName}</p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1">Email / Login ID</label>
                <p className="text-sm text-gray-900 break-all overflow-hidden" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', maxWidth: '100%' }}>{userData.basicUserInfo.email}</p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1">Member Since</label>
                <p className="text-sm text-gray-900 break-words overflow-hidden">{memberSince}</p>
              </div>
            </div>
            <div className="space-y-3 min-w-0 overflow-hidden" style={{ width: '100%', maxWidth: '100%' }}>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1 ml-2">Account Type</label>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary break-words max-w-full">
                    {userData.basicUserInfo.accountType}
                  </span>
                </div>
              </div>
              <div className="min-w-0 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 block mb-1 ml-2">Status</label>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium break-words max-w-full ${
                    userData.basicUserInfo.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userData.basicUserInfo.status}
                  </span>
                </div>
              </div>
              {userData.basicUserInfo.phoneNumber && (
                <div className="min-w-0 overflow-hidden">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                  <p className="text-sm text-gray-900 break-words overflow-hidden">{userData.basicUserInfo.phoneNumber}</p>
                </div>
              )}
              {userData.basicUserInfo.address && (
                <div className="min-w-0 overflow-hidden">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                  <p className="text-sm text-gray-900 break-words overflow-hidden">{userData.basicUserInfo.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserBasicInfo };

