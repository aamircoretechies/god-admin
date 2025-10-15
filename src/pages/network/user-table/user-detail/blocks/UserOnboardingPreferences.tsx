import { KeenIcon } from '@/components';

const UserOnboardingPreferences = () => {
  // Mock data - in real app this would come from props or API
  const preferences = {
    bibleExperienceLevel: 'Regular',
    reasonForUsingApp: 'Faith learning',
    engagementMode: 'Reading',
    explanationStylePreference: 'Mixed',
    preferredBibleTranslation: 'KJV',
    preferredLanguage: 'English',
    dailyVersePreference: 'Yes-daily',
    reflectionLengthPreference: 'Medium',
    customNote: 'I\'m passionate about deepening my faith through daily study and reflection.'
  };

  const getBadgeColor = (value: string) => {
    const colors: { [key: string]: string } = {
      'Regular': 'bg-primary/10 text-primary',
      'Faith learning': 'bg-success/10 text-success',
      'Reading': 'bg-info/10 text-info',
      'Mixed': 'bg-warning/10 text-warning',
      'KJV': 'bg-secondary/10 text-secondary',
      'English': 'bg-primary/10 text-primary',
      'Yes-daily': 'bg-success/10 text-success',
      'Medium': 'bg-info/10 text-info'
    };
    return colors[value] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="setting-4" className="me-2" />
          Onboarding Preferences
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Experience & Purpose */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Experience & Purpose</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Bible Experience Level</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.bibleExperienceLevel)}`}>
                  {preferences.bibleExperienceLevel}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reason for Using App</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.reasonForUsingApp)}`}>
                  {preferences.reasonForUsingApp}
                </span>
              </div>
            </div>
          </div>

          {/* Engagement & Style */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Engagement & Style</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Engagement Mode</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.engagementMode)}`}>
                  {preferences.engagementMode}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Explanation Style</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.explanationStylePreference)}`}>
                  {preferences.explanationStylePreference}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Preferences</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Bible Translation</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.preferredBibleTranslation)}`}>
                  {preferences.preferredBibleTranslation}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Language</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.preferredLanguage)}`}>
                  {preferences.preferredLanguage}
                </span>
              </div>
            </div>
          </div>

          {/* Daily Habits */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Daily Habits</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Verse</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.dailyVersePreference)}`}>
                  {preferences.dailyVersePreference}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reflection Length</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.reflectionLengthPreference)}`}>
                  {preferences.reflectionLengthPreference}
                </span>
              </div>
            </div>
          </div>

          {/* Custom Note */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Custom Note</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 italic">
                "{preferences.customNote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserOnboardingPreferences };

