import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';

const UserBasicInfo = () => {
  // Mock data - in real app this would come from props or API
  const userData = {
    id: 'USR-2024-001',
    fullName: 'Tyler Hero',
    email: 'tyler.hero@gmail.com',
    memberSince: 'March 15, 2024',
    accountType: 'Premium',
    status: 'Active',
    avatar: '300-3.png'
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="user" className="me-2" />
          Basic User Information
        </h3>
      </div>
      <div className="card-body">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="relative">
              <img
                src={toAbsoluteUrl(`/media/avatars/${userData.avatar}`)}
                className="size-20 rounded-full"
                alt={userData.fullName}
              />
              <div className="absolute -bottom-1 -right-1 size-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                <KeenIcon icon="check" className="size-3 text-white" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-gray-900">{userData.fullName}</h4>
              <p className="text-sm text-gray-600">Member since {userData.memberSince}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {userData.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900">{userData.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email / Login ID</label>
                <p className="text-sm text-gray-900">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-sm text-gray-900">{userData.memberSince}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {userData.accountType}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                  {userData.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserBasicInfo };

