import { KeenIcon } from '@/components';

const UserActivityBehavior = () => {
  // Mock data - in real app this would come from props or API
  const activityData = {
    lastLoginDate: 'December 15, 2024 at 2:30 PM',
    totalSessions: 156,
    pagesVersesAccessed: 2847,
    bookmarksFavorites: 89,
    dailyVerseSubscriptionStatus: 'Active',
    offlineAccessUsage: 'Yes'
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="chart-line" className="me-2" />
          User Activity / Behavior
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Activity Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Activity Stats</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Last Login Date</label>
                <p className="text-sm text-gray-900">{activityData.lastLoginDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Sessions</label>
                <p className="text-lg font-semibold text-primary">{activityData.totalSessions.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pages/Verses Accessed</label>
                <p className="text-lg font-semibold text-info">{activityData.pagesVersesAccessed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Content Engagement */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Content Engagement</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Bookmarks / Favorites Count</label>
                <p className="text-lg font-semibold text-warning">{activityData.bookmarksFavorites}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Verse Subscription Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activityData.dailyVerseSubscriptionStatus)}`}>
                  {activityData.dailyVerseSubscriptionStatus}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Offline Access Usage</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                  {activityData.offlineAccessUsage}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserActivityBehavior };
