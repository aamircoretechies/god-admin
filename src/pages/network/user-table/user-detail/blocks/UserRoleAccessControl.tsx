import { KeenIcon } from '@/components';

const UserRoleAccessControl = () => {
  // Mock data - in real app this would come from props or API
  const roleData = {
    currentRole: 'Premium User',
    permissions: [
      'Read Bible Content',
      'Create Reading Plans',
      'Access Premium Features',
      'Export Data',
      'Share Content',
      'Access Analytics'
    ],
    restrictions: [
      'Cannot modify admin settings',
      'Cannot access user management',
      'Cannot view system logs'
    ],
    lastAccessReview: 'March 10, 2024',
    nextReviewDate: 'June 10, 2024'
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="shield-tick" className="me-2" />
          Role & Access Control
        </h3>
      </div>
      <div className="card-body">
        <div className="grid gap-6">
          {/* Current Role */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Role</h4>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {roleData.currentRole}
              </span>
              <span className="text-xs text-gray-500">
                Last reviewed: {roleData.lastAccessReview}
              </span>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roleData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2">
                  <KeenIcon icon="check" className="size-4 text-success" />
                  <span className="text-sm text-gray-900">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Restrictions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roleData.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center gap-2">
                  <KeenIcon icon="cross" className="size-4 text-danger" />
                  <span className="text-sm text-gray-600">{restriction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Access Review Schedule */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Next Access Review</h4>
                <p className="text-sm text-gray-900">{roleData.nextReviewDate}</p>
              </div>
              <button className="btn btn-sm btn-outline btn-primary">
                <KeenIcon icon="setting-4" className="me-1" />
                Manage Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserRoleAccessControl };


