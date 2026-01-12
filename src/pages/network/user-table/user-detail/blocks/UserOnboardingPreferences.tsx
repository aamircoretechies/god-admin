import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';

const UserOnboardingPreferences = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<
    UserProfileResponse['data']['onboardingPreferences'] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUserProfile(id);
        if (response.status === 1 && response.data) {
          // Check if onboardingPreferences exists, if not, show empty state message
          if (response.data.onboardingPreferences) {
            setPreferences(response.data.onboardingPreferences);
          } else {
            // Set preferences to an empty object structure to show "No data" message
            setPreferences(null);
            setError('No onboarding preferences found for this user');
          }
        } else {
          setError(response.message || 'Failed to load preferences');
        }
      } catch (err: any) {
        console.error('Error loading preferences:', err);
        setError(err?.message || 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [id]);

  const getBadgeColor = (value: string | undefined) => {
    if (!value) return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      Regular: 'bg-primary/10 text-primary',
      NEW_TO_BIBLE: 'bg-primary/10 text-primary',
      'Faith learning': 'bg-success/10 text-success',
      Reading: 'bg-info/10 text-info',
      READING: 'bg-info/10 text-info',
      Mixed: 'bg-warning/10 text-warning',
      Balanced: 'bg-warning/10 text-warning',
      KJV: 'bg-secondary/10 text-secondary',
      SV: 'bg-secondary/10 text-secondary',
      English: 'bg-primary/10 text-primary',
      nl: 'bg-primary/10 text-primary',
      'Yes-daily': 'bg-success/10 text-success',
      Medium: 'bg-info/10 text-info'
    };
    return colors[value] || 'bg-gray-100 text-gray-800';
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
              <p className="text-sm text-gray-600 mt-2">Loading preferences...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !preferences) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <KeenIcon icon="setting-4" className="me-2" />
            Onboarding Preferences
          </h3>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">
              {error || 'No onboarding preferences available'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <KeenIcon icon="setting-4" className="me-2" />
            Onboarding Preferences
          </h3>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">
              No onboarding preferences available for this user
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {preferences.experienceAndPurpose && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                Experience & Purpose
              </h4>
              <div className="space-y-3">
                {preferences.experienceAndPurpose.bibleExperienceLevel && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Bible Experience Level
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.experienceAndPurpose.bibleExperienceLevel)}`}
                    >
                      {preferences.experienceAndPurpose.bibleExperienceLevel}
                    </span>
                  </div>
                )}
                {preferences.experienceAndPurpose.reasonForUsingApp && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Reason for Using App
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.experienceAndPurpose.reasonForUsingApp)}`}
                    >
                      {preferences.experienceAndPurpose.reasonForUsingApp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Engagement & Style */}
          {preferences.engagementAndStyle && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                Engagement & Style
              </h4>
              <div className="space-y-3">
                {preferences.engagementAndStyle.engagementMode && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Engagement Mode</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.engagementAndStyle.engagementMode)}`}
                    >
                      {preferences.engagementAndStyle.engagementMode}
                    </span>
                  </div>
                )}
                {preferences.engagementAndStyle.explanationStyle && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Explanation Style</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.engagementAndStyle.explanationStyle)}`}
                    >
                      {preferences.engagementAndStyle.explanationStyle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preferences */}
          {preferences.preferences && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Preferences</h4>
              <div className="space-y-3">
                {preferences.preferences.bibleTranslation && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bible Translation</label>
                    <span
                      className={`text-sand dark:text-white inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}
                    >
                      {preferences.preferences.bibleTranslation}
                    </span>
                  </div>
                )}
                {preferences.preferences.language && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.preferences.language)}`}
                    >
                      {preferences.preferences.language}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Daily Habits */}
          {preferences.dailyHabits && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Daily Habits</h4>
              <div className="space-y-3">
                {preferences.dailyHabits.dailyVerse && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Daily Verse</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.dailyHabits.dailyVerse)}`}
                    >
                      {preferences.dailyHabits.dailyVerse}
                    </span>
                  </div>
                )}
                {preferences.dailyHabits.reflectionLength && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reflection Length</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(preferences.dailyHabits.reflectionLength)}`}
                    >
                      {preferences.dailyHabits.reflectionLength}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Note */}
          {preferences.customNote && (
            <div className="md:col-span-2 lg:col-span-3 space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Custom Note</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 italic">"{preferences.customNote}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { UserOnboardingPreferences };
