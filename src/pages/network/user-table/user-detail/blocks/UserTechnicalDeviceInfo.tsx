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
        if (response.status === 1 && response.data) {
          if (response.data.technicalInfo) {
            setTechnicalData(response.data.technicalInfo);
          } else {
            setTechnicalData(null);
            setError('No technical information available for this user');
          }
        } else {
          setError(response.message || 'Failed to load technical data');
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

  if (error && !technicalData) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <KeenIcon icon="smartphone" className="me-2" />
            Technical / Device Info
          </h3>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">{error || 'No technical information available'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!technicalData) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <KeenIcon icon="smartphone" className="me-2" />
            Technical / Device Info
          </h3>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">No technical information available for this user</p>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Device Model */}
          {technicalData.deviceModel && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Device Model</label>
                <p className="text-sm text-gray-900">{technicalData.deviceModel}</p>
              </div>
            </div>
          )}

          {/* OS Version */}
          {technicalData.osVersion && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">OS Version</label>
                <p className="text-sm text-gray-900">{technicalData.osVersion}</p>
              </div>
            </div>
          )}

          {/* Platform */}
          {(technicalData.platform || technicalData.deviceModel) && (
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-2">Platform</label>
                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(technicalData.platform || technicalData.deviceModel)}`}>
                  {technicalData.platform || technicalData.deviceModel}
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

          {/* IP Address */}
          {technicalData.ipAddress && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">IP Address</label>
                <p className="text-sm text-gray-900">{technicalData.ipAddress}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {technicalData.location && (
            <div className="space-y-3 ml-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{technicalData.location}</p>
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

          {/* Devices Used */}
          {technicalData.devicesUsed && technicalData.devicesUsed.length > 0 && (
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Devices Used</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {technicalData.devicesUsed.map((device, index) => (
                    <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs -ml-2 font-medium ${getPlatformColor(device)}`}>
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { UserTechnicalDeviceInfo };
