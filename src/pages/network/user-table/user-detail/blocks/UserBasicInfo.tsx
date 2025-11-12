import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';
import { DummyDataIndicator } from '@/components/dummy-data-indicator/DummyDataIndicator';

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
        if (response.status === 1) {
          setUserData(response.data);
        } else {
          setError(response.message || 'Failed to load user data');
        }
      } catch (err: any) {
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

  // Generate avatar from user ID
  const avatarNumber = (parseInt(userData.basicInfo.id.replace(/-/g, ''), 16) % 34) + 1;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const memberSince = userData.basicInfo.memberSince 
    ? formatDate(userData.basicInfo.memberSince)
    : 'N/A';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="user" className="me-2" />
          Basic User Information
        </h3>
      </div>
      <div className="card-body">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="relative">
              <img
                src={toAbsoluteUrl(`/media/avatars/300-${avatarNumber}.png`)}
                className="size-20 rounded-full"
                alt={userData.basicInfo.name}
              />
              <div className="absolute -bottom-1 -right-1 size-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                <KeenIcon icon="check" className="size-3 text-white" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-gray-900">{userData.basicInfo.name}</h4>
              <p className="text-sm text-gray-600">Member since {memberSince}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {userData.basicInfo.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900">{userData.basicInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email / Login ID</label>
                <p className="text-sm text-gray-900">{userData.basicInfo.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-sm text-gray-900">{memberSince}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {userData.basicInfo.accountType}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userData.basicInfo.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userData.basicInfo.status}
                  </span>
                </div>
              </div>
              {/* Dummy fields that are not in API response */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Phone Number
                  <DummyDataIndicator />
                </label>
                <p className="text-sm text-gray-400 italic">N/A (Dummy Data)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Address
                  <DummyDataIndicator />
                </label>
                <p className="text-sm text-gray-400 italic">N/A (Dummy Data)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserBasicInfo };

