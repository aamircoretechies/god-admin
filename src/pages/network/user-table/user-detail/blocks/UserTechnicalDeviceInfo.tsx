import { KeenIcon } from '@/components';

const UserTechnicalDeviceInfo = () => {
  // Mock data - in real app this would come from props or API
  const technicalData = {
    platform: 'iOS',
    appVersion: '2.1.4',
    lastSyncTimestamp: 'December 15, 2024 at 2:30 PM'
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'iOS': 'bg-blue-100 text-blue-800',
      'Android': 'bg-green-100 text-green-800',
      'Web': 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'Yes' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800';
  };

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
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Platform</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(technicalData.platform)}`}>
                {technicalData.platform}
              </span>
            </div>
          </div>

          {/* App Version */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">App Version</label>
              <p className="text-sm text-gray-900">{technicalData.appVersion}</p>
            </div>
          </div>

          {/* Last Sync Timestamp */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Last Sync Timestamp</label>
              <p className="text-sm text-gray-900">{technicalData.lastSyncTimestamp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserTechnicalDeviceInfo };




