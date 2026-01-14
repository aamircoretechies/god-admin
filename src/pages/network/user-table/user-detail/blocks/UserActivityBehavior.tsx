import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { fetchUserProfile, type UserProfileResponse } from '@/services/usersApi';

const UserActivityBehavior = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<
    UserProfileResponse['data']['userActivity'] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUserProfile(id);
        if (response.status === 1 && response.data?.userActivity) {
          setActivityData(response.data.userActivity);
        } else {
          setError('Failed to load activity data');
        }
      } catch (err: any) {
        console.error('Error loading activity:', err);
        setError(err?.message || 'Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800';
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
              <p className="text-sm text-gray-600 mt-2">Loading activity data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !activityData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error || 'Failed to load activity data'}</div>
        </div>
      </div>
    );
  }

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
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Basic Activity Stats
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Last Login Date</label>
                <p className="text-sm text-gray-900">
                  {activityData.basicActivityStats.lastLoginDate || 'Never'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Sessions</label>
                <p className="text-lg font-semibold text-primary">
                  {activityData.basicActivityStats.totalSessions.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pages/Verses Accessed</label>
                <p className="text-lg font-semibold text-info">
                  {activityData.basicActivityStats.pagesVersesAccessed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content Engagement */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Content Engagement
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Bookmarks / Favorites Count
                </label>
                <p className="text-lg font-semibold text-warning">
                  {activityData.contentEngagement.bookmarksFavoritesCount}
                </p>
              </div>
              {/* Removed unsupported fields: Daily Verse Subscription Status, Offline Access Usage */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserActivityBehavior };
