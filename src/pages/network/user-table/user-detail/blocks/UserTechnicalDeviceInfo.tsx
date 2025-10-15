import { KeenIcon } from '@/components';

const UserTechnicalDeviceInfo = () => {
  // Mock data - in real app this would come from props or API
  const technicalData = {
    platform: 'iOS',
    deviceLanguage: 'English (US)',
    voiceModeEnabled: 'Yes',
    notificationsEnabled: 'Yes',
    appVersion: '2.1.4',
    deviceModel: 'iPhone 15 Pro',
    osVersion: 'iOS 17.2',
    lastDeviceSync: 'December 15, 2024 at 2:30 PM',
    deviceId: 'DEV-2024-001-156',
    networkType: 'WiFi',
    timezone: 'America/New_York',
    screenResolution: '2556 x 1179',
    storageUsed: '2.4 GB',
    storageAvailable: '45.6 GB'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Platform & Device */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Platform & Device</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(technicalData.platform)}`}>
                  {technicalData.platform}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Device Model</label>
                <p className="text-sm text-gray-900">{technicalData.deviceModel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">OS Version</label>
                <p className="text-sm text-gray-900">{technicalData.osVersion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">App Version</label>
                <p className="text-sm text-gray-900">{technicalData.appVersion}</p>
              </div>
            </div>
          </div>

          {/* Settings & Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Settings & Preferences</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Device Language</label>
                <p className="text-sm text-gray-900">{technicalData.deviceLanguage}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Voice Mode</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(technicalData.voiceModeEnabled)}`}>
                  {technicalData.voiceModeEnabled}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notifications</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(technicalData.notificationsEnabled)}`}>
                  {technicalData.notificationsEnabled}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <p className="text-sm text-gray-900">{technicalData.timezone}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">System Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Device ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {technicalData.deviceId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Network Type</label>
                <p className="text-sm text-gray-900">{technicalData.networkType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Screen Resolution</label>
                <p className="text-sm text-gray-900">{technicalData.screenResolution}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Sync</label>
                <p className="text-sm text-gray-900">{technicalData.lastDeviceSync}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Storage Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">App Storage Used</span>
                <span className="text-sm font-semibold text-primary">{technicalData.storageUsed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Device Storage Available</span>
                <span className="text-sm font-semibold text-success">{technicalData.storageAvailable}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserTechnicalDeviceInfo };




