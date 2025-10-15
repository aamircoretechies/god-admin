import { KeenIcon } from '@/components';

const UserAnalyticsInsights = () => {
  // Mock data - in real app this would come from props or API
  const analyticsData = {
    mostReadBooks: [
      { name: 'Psalms', count: 156, percentage: 25 },
      { name: 'John', count: 89, percentage: 14 },
      { name: 'Romans', count: 67, percentage: 11 },
      { name: 'Matthew', count: 54, percentage: 9 },
      { name: 'Genesis', count: 43, percentage: 7 }
    ],
    averageSessionTime: '24 minutes',
    voiceVsReadingRatio: {
      voice: 35,
      reading: 65
    },
    engagementTag: 'Grower',
    weeklyActivity: {
      monday: 85,
      tuesday: 92,
      wednesday: 78,
      thursday: 88,
      friday: 95,
      saturday: 67,
      sunday: 73
    },
    readingStreak: 28,
    totalReadingTime: '156 hours',
    favoriteTopics: ['Faith', 'Love', 'Forgiveness', 'Hope', 'Wisdom']
  };

  const getEngagementTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Seeker': 'bg-blue-100 text-blue-800',
      'Learner': 'bg-green-100 text-green-800',
      'Grower': 'bg-purple-100 text-purple-800',
      'Teacher': 'bg-orange-100 text-orange-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="chart-pie" className="me-2" />
          Analytics / Insights
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reading Patterns */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Reading Patterns</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Most Read Books</label>
                <div className="space-y-2 mt-2">
                  {analyticsData.mostReadBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{book.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${book.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{book.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Average Session Time</label>
                <p className="text-lg font-semibold text-primary">{analyticsData.averageSessionTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Reading Time</label>
                <p className="text-lg font-semibold text-info">{analyticsData.totalReadingTime}</p>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Engagement Metrics</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Engagement Tag</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEngagementTagColor(analyticsData.engagementTag)}`}>
                  {analyticsData.engagementTag}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reading Streak</label>
                <p className="text-lg font-semibold text-success">{analyticsData.readingStreak} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Voice vs Reading Ratio</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Voice</span>
                      <span>{analyticsData.voiceVsReadingRatio.voice}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full" 
                        style={{ width: `${analyticsData.voiceVsReadingRatio.voice}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Reading</span>
                      <span>{analyticsData.voiceVsReadingRatio.reading}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${analyticsData.voiceVsReadingRatio.reading}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Weekly Activity Pattern</h4>
          <div className="flex items-end justify-between gap-2 h-32">
            {Object.entries(analyticsData.weeklyActivity).map(([day, value]) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div 
                  className="w-8 bg-primary rounded-t"
                  style={{ height: `${(value / 100) * 80}px` }}
                ></div>
                <span className="text-xs text-gray-600 capitalize">{day.slice(0, 3)}</span>
                <span className="text-xs font-medium text-gray-800">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Topics */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Favorite Topics</h4>
          <div className="flex flex-wrap gap-2">
            {analyticsData.favoriteTopics.map((topic, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserAnalyticsInsights };




