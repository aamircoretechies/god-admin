import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
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
  TrendingDown,
  Bell,
  Settings,
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

const SystemAlertsContent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock alerts data
  const alerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      severity: 'high',
      title: 'Unusual AI Query Pattern Detected',
      description: 'User john.doe@example.com has submitted 45 AI queries in the last 10 minutes, which is 3x above normal rate.',
      timestamp: '2024-01-21T14:30:00Z',
      status: 'new',
      category: 'rate_limit',
      affectedUsers: 1,
      location: 'New York, US',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)',
      actionRequired: true
    },
    {
      id: '2',
      type: 'error',
      severity: 'critical',
      title: 'Multiple Failed Login Attempts',
      description: 'IP address 203.45.67.89 has attempted 12 failed logins in the last 5 minutes.',
      timestamp: '2024-01-21T14:25:00Z',
      status: 'acknowledged',
      category: 'security',
      affectedUsers: 0,
      location: 'Unknown',
      ipAddress: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      actionRequired: true
    },
    {
      id: '3',
      type: 'info',
      severity: 'medium',
      title: 'High Traffic Volume',
      description: 'Traffic volume has increased by 150% in the last hour, primarily from mobile devices.',
      timestamp: '2024-01-21T14:20:00Z',
      status: 'new',
      category: 'performance',
      affectedUsers: 0,
      actionRequired: false
    },
    {
      id: '4',
      type: 'warning',
      severity: 'medium',
      title: 'Suspicious Content Sharing',
      description: 'User jane.smith@example.com has shared the same verse 8 times in 2 hours.',
      timestamp: '2024-01-21T14:15:00Z',
      status: 'new',
      category: 'user_behavior',
      affectedUsers: 1,
      location: 'Los Angeles, US',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      actionRequired: true
    },
    {
      id: '5',
      type: 'success',
      severity: 'low',
      title: 'Rate Limit Reset',
      description: 'Rate limit for user mike.johnson@example.com has been automatically reset after 1 hour.',
      timestamp: '2024-01-21T14:10:00Z',
      status: 'resolved',
      category: 'rate_limit',
      affectedUsers: 1,
      actionRequired: false
    },
    {
      id: '6',
      type: 'error',
      severity: 'high',
      title: 'Geographic Anomaly',
      description: 'User account accessed from 3 different countries within 30 minutes.',
      timestamp: '2024-01-21T14:05:00Z',
      status: 'new',
      category: 'security',
      affectedUsers: 1,
      location: 'Multiple',
      ipAddress: 'Multiple',
      userAgent: 'Multiple',
      actionRequired: true
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Low</Badge>;
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
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">New</Badge>;
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
      'performance': 'bg-blue-100 text-blue-800',
      'user_behavior': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge variant="default" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category.replace('_', ' ')}
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

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'new') return alert.status === 'new';
    if (selectedFilter === 'critical') return alert.severity === 'critical';
    if (selectedFilter === 'action_required') return alert.actionRequired;
    return true;
  });

  const stats = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    actionRequired: alerts.filter(a => a.actionRequired).length
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
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
            'border-l-blue-500'
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
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
                        <Button size="sm" variant="outline">
                          <Shield className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline">
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
