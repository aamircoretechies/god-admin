import { KeenIcon } from '@/components';

const UserActivityBehavior = () => {
  // Mock data - in real app this would come from props or API
  const activityData = {
    lastLoginDate: 'December 15, 2024 at 2:30 PM',
    totalSessions: 156,
    pagesVersesAccessed: 2847,
    bookmarksFavorites: 89,
    dailyVerseSubscriptionStatus: 'Active',
    interactionMode: {
      text: 1247,
      voice: 234,
      tts: 567
    },
    aiQaUsageCount: 89,
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
          {/* Session Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Session Information</h4>
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
                <label className="text-sm font-medium text-gray-700">Bookmarks / Favorites</label>
                <p className="text-lg font-semibold text-warning">{activityData.bookmarksFavorites}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Verse Subscription</label>
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

          {/* Interaction Modes */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Interaction Modes</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Text</span>
                <span className="text-sm font-semibold text-primary">{activityData.interactionMode.text.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Voice</span>
                <span className="text-sm font-semibold text-success">{activityData.interactionMode.voice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">TTS</span>
                <span className="text-sm font-semibold text-info">{activityData.interactionMode.tts.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">AI Q&A Usage</span>
                  <span className="text-sm font-semibold text-warning">{activityData.aiQaUsageCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Chart Visualization */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Interaction Mode Distribution</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full" 
                style={{ width: `${(activityData.interactionMode.text / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100}%` }}
              ></div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-success h-3 rounded-full" 
                style={{ width: `${(activityData.interactionMode.voice / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100}%` }}
              ></div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-info h-3 rounded-full" 
                style={{ width: `${(activityData.interactionMode.tts / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Text: {Math.round((activityData.interactionMode.text / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100)}%</span>
            <span>Voice: {Math.round((activityData.interactionMode.voice / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100)}%</span>
            <span>TTS: {Math.round((activityData.interactionMode.tts / (activityData.interactionMode.text + activityData.interactionMode.voice + activityData.interactionMode.tts)) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserActivityBehavior };
