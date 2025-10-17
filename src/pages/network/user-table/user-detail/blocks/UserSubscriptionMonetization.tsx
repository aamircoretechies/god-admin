import { KeenIcon } from '@/components';

const UserSubscriptionMonetization = () => {
  // Mock data - in real app this would come from props or API
  const subscriptionData = {
    subscriptionType: 'Premium',
    startDate: 'March 15, 2024',
    expiryDate: 'March 15, 2025',
    paymentStatus: 'Active',
    autoRenewal: 'Yes'
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionTypeColor = (type: string) => {
    return type === 'Premium' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <KeenIcon icon="dollar" className="me-2" />
          Subscription / Monetization
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Subscription Type */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Subscription Type</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionTypeColor(subscriptionData.subscriptionType)}`}>
                {subscriptionData.subscriptionType}
              </span>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <p className="text-sm text-gray-900">{subscriptionData.startDate}</p>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <p className="text-sm text-gray-900">{subscriptionData.expiryDate}</p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Payment Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscriptionData.paymentStatus)}`}>
                {subscriptionData.paymentStatus}
              </span>
            </div>
          </div>

          {/* Auto Renewal */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Renewal</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionData.autoRenewal === 'Yes' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800'}`}>
                {subscriptionData.autoRenewal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserSubscriptionMonetization };




