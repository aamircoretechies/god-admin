import { KeenIcon } from '@/components';

const UserSubscriptionMonetization = () => {
  // Mock data - in real app this would come from props or API
  const subscriptionData = {
    subscriptionType: 'Premium Annual',
    subscriptionStartDate: 'March 15, 2024',
    subscriptionExpiry: 'March 15, 2025',
    paymentReference: 'TXN-2024-001-156',
    transactionId: 'ch_3OqK8v2eZvKYlo2C1gQ12345',
    amount: '$99.99',
    billingCycle: 'Annual',
    autoRenewal: 'Enabled',
    paymentMethod: 'Visa ending in 4242',
    paymentStatus: 'Active',
    nextBillingDate: 'March 15, 2025'
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionTypeColor = (type: string) => {
    return type.includes('Premium') ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-800';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Subscription Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Subscription Type</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionTypeColor(subscriptionData.subscriptionType)}`}>
                  {subscriptionData.subscriptionType}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
                <p className="text-sm text-gray-900">{subscriptionData.billingCycle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <p className="text-lg font-semibold text-primary">{subscriptionData.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Auto Renewal</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionData.autoRenewal === 'Enabled' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800'}`}>
                  {subscriptionData.autoRenewal}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Important Dates</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <p className="text-sm text-gray-900">{subscriptionData.subscriptionStartDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <p className="text-sm text-gray-900">{subscriptionData.subscriptionExpiry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Next Billing</label>
                <p className="text-sm text-gray-900">{subscriptionData.nextBillingDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscriptionData.paymentStatus)}`}>
                  {subscriptionData.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Payment Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900">{subscriptionData.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Reference</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {subscriptionData.paymentReference}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                  {subscriptionData.transactionId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Timeline */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Subscription Timeline</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 bg-success rounded-full"></div>
              <span className="text-xs text-gray-600">Started</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-primary rounded-full"></div>
              <span className="text-xs font-medium text-primary">Current</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-600">Expires</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>{subscriptionData.subscriptionStartDate}</span>
            <span>Today</span>
            <span>{subscriptionData.subscriptionExpiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserSubscriptionMonetization };




