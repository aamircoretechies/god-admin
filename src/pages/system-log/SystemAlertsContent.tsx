import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAlerts, resolveAlert, dismissAlert, acknowledgeAlert, type AlertResponse } from '@/services/alertsApi';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Shield,
  UserX,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  Bell,
  Eye,
  Ban
} from 'lucide-react';

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  category: 'spam' | 'rate_limit' | 'security' | 'performance' | 'user_behavior';
  affectedUsers?: number;
  location?: string;
  ipAddress?: string;
  userAgent?: string;
  actionRequired: boolean;
}

// Transform API response to component format
const transformAlert = (apiData: AlertResponse): SystemAlert => {
  // Map severity
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high',
    'CRITICAL': 'critical'
  };

  // Map status
  const statusMap: Record<string, 'new' | 'acknowledged' | 'resolved'> = {
    'NEW': 'new',
    'ACKNOWLEDGED': 'acknowledged',
    'RESOLVED': 'resolved'
  };

  // Map category
  const categoryMap: Record<string, 'spam' | 'rate_limit' | 'security' | 'performance' | 'user_behavior'> = {
    'SPAM': 'spam',
    'RATE_LIMIT': 'rate_limit',
    'SECURITY': 'security',
    'PERFORMANCE': 'performance',
    'USER_BEHAVIOR': 'user_behavior'
  };

  // Derive type from severity and category
  let type: 'warning' | 'error' | 'info' | 'success' = 'info';
  if (apiData.severity === 'CRITICAL' || apiData.severity === 'HIGH') {
    type = 'error';
  } else if (apiData.severity === 'MEDIUM') {
    type = 'warning';
  } else if (apiData.status === 'RESOLVED') {
    type = 'success';
  }

  return {
    id: apiData.alertId,
    type: type,
    severity: severityMap[apiData.severity] || 'medium',
    title: apiData.title,
    description: apiData.message,
    timestamp: apiData.timestamp,
    status: statusMap[apiData.status] || 'new',
    category: categoryMap[apiData.category] || 'performance',
    affectedUsers: apiData.usersAffected,
    location: apiData.location || undefined,
    ipAddress: apiData.ipAddress || undefined,
    actionRequired: apiData.actionRequired
  };
};

const SystemAlertsContent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [processingAlert, setProcessingAlert] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAlerts({
        page: currentPage,
        limit: 20
      });

      if (response.status === 1 && response.data) {
        const transformedAlerts = response.data.map(transformAlert);
        setAlerts(transformedAlerts);
        // Note: API response doesn't include pagination metadata in the example
        // Adjust if your API provides it
      } else {
        setError(response.message || 'Failed to load alerts');
      }
    } catch (err: any) {
      console.error('Error loading alerts:', err);
      setError(err?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleResolve = async (alertId: string) => {
    try {
      setProcessingAlert(alertId);
      setSuccessMessage(null);
      const response = await resolveAlert(alertId);
      console.log('Resolve alert response:', response);
      
      if (response.status === 1) {
        setSuccessMessage(response.message || 'Alert resolved successfully');
        // Reload alerts to reflect the updated status
        await loadAlerts();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || 'Failed to resolve alert');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error('Error resolving alert:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to resolve alert';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingAlert(null);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      setProcessingAlert(alertId);
      setSuccessMessage(null);
      const response = await dismissAlert(alertId);
      console.log('Dismiss alert response:', response);
      
      if (response.status === 1) {
        setSuccessMessage(response.message || 'Alert dismissed successfully');
        // Reload alerts to reflect the updated status
        await loadAlerts();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || 'Failed to dismiss alert');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error('Error dismissing alert:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to dismiss alert';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingAlert(null);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      setProcessingAlert(alertId);
      setSuccessMessage(null);
      const response = await acknowledgeAlert(alertId);
      console.log('Acknowledge alert response:', response);
      
      if (response.status === 1) {
        setSuccessMessage(response.message || 'Alert acknowledged successfully');
        // Reload alerts to reflect the updated status
        await loadAlerts();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || 'Failed to acknowledge alert');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error('Error acknowledging alert:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to acknowledge alert';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingAlert(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">New</Badge>;
      case 'acknowledged':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Acknowledged</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'spam': 'bg-red-100 text-red-800',
      'rate_limit': 'bg-orange-100 text-orange-800',
      'security': 'bg-purple-100 text-purple-800',
      'performance': 'bg-amber-100 text-amber-800',
      'user_behavior': 'bg-pink-100 text-pink-800'
    };
    
    const displayName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <Badge variant="default" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {displayName}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'new') return alert.status === 'new';
    if (selectedFilter === 'critical') return alert.severity === 'critical';
    if (selectedFilter === 'action_required') return alert.actionRequired;
    return true;
  });
  }, [alerts, selectedFilter]);

  const stats = useMemo(() => {
    return {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    actionRequired: alerts.filter(a => a.actionRequired).length
  };
  }, [alerts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Alerts</p>
                <p className="text-xl font-bold">{stats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-xl font-bold">{stats.actionRequired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Alerts</option>
              <option value="new">New Alerts</option>
              <option value="critical">Critical Only</option>
              <option value="action_required">Action Required</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${
            alert.severity === 'critical' ? 'border-l-red-500' :
            alert.severity === 'high' ? 'border-l-orange-500' :
            alert.severity === 'medium' ? 'border-l-yellow-500' :
            'border-l-amber-500'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                      {getCategoryBadge(alert.category)}
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.actionRequired && (
                        <Badge variant="default" className="bg-red-100 text-red-800">
                          Action Required
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={processingAlert === alert.id || alert.status === 'acknowledged' || alert.status === 'resolved'}
                        title="Acknowledge"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        disabled={processingAlert === alert.id || alert.status === 'resolved'}
                        title="Dismiss"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{alert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatDate(alert.timestamp)}</span>
                    </div>
                    {alert.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{alert.location}</span>
                      </div>
                    )}
                    {alert.ipAddress && alert.ipAddress !== 'Multiple' && (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">IP: {alert.ipAddress}</span>
                      </div>
                    )}
                    {alert.affectedUsers && alert.affectedUsers > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{alert.affectedUsers} users affected</span>
                      </div>
                    )}
                  </div>
                  
                  {alert.actionRequired && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Action Required</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className="text-red-600">
                          <UserX className="w-4 h-4 mr-2" />
                          Block User
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          disabled={processingAlert === alert.id || alert.status === 'acknowledged' || alert.status === 'resolved'}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Acknowledge
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolve(alert.id)}
                          disabled={processingAlert === alert.id || alert.status === 'resolved'}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Alerts State */}
      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts Found</h3>
            <p className="text-gray-600">All systems are running smoothly with no alerts to display.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { SystemAlertsContent };
