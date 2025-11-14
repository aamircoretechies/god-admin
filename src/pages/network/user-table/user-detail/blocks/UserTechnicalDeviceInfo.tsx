import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';

const UserTechnicalDeviceInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [technicalData, setTechnicalData] = useState<UserProfileResponse['data']['technicalInfo'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadTechnicalData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUserProfile(id);
        if (response.status === 1 && response.data?.technicalInfo) {
          setTechnicalData(response.data.technicalInfo);
        } else {
          setError('Failed to load technical data');
        }
      } catch (err: any) {
        console.error('Error loading technical data:', err);
        setError(err?.message || 'Failed to load technical data');
      } finally {
        setLoading(false);
      }
    };

    loadTechnicalData();
  }, [id]);

  const getPlatformColor = (platform: string | undefined) => {
    if (!platform) return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      'iOS': 'bg-blue-100 text-blue-800',
      'Android': 'bg-green-100 text-green-800',
      'Web': 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Loading technical data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !technicalData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error || 'Failed to load technical data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="smartphone" className="me-2" />
          Technical / Device Info
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Platform */}
          {technicalData.platform && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(technicalData.platform)}`}>
                  {technicalData.platform}
                </span>
              </div>
            </div>
          )}

          {/* App Version */}
          {technicalData.appVersion && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">App Version</label>
                <p className="text-sm text-gray-900">{technicalData.appVersion}</p>
              </div>
            </div>
          )}

          {/* Last Sync Timestamp */}
          {technicalData.lastSyncTimestamp && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Last Sync Timestamp</label>
                <p className="text-sm text-gray-900">{technicalData.lastSyncTimestamp}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { UserTechnicalDeviceInfo };
