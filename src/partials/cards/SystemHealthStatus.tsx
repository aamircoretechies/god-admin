import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  Server,
  Brain,
  Volume2,
  Database
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime?: number;
  lastChecked: string;
  description: string;
}

const SystemHealthStatus = () => {
  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      name: 'Bible API',
      status: 'healthy',
      responseTime: 120,
      lastChecked: new Date().toISOString(),
      description: 'Bible content and translations API'
    },
    {
      name: 'AI Engine',
      status: 'healthy',
      responseTime: 850,
      lastChecked: new Date().toISOString(),
      description: 'AI explanation and response generation'
    },
    {
      name: 'TTS Service',
      status: 'warning',
      responseTime: 2100,
      lastChecked: new Date().toISOString(),
      description: 'Text-to-speech conversion service'
    },
    {
      name: 'Database',
      status: 'healthy',
      responseTime: 45,
      lastChecked: new Date().toISOString(),
      description: 'Main application database'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Slow</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Down</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Bible API':
        return <Database className="w-4 h-4" />;
      case 'AI Engine':
        return <Brain className="w-4 h-4" />;
      case 'TTS Service':
        return <Volume2 className="w-4 h-4" />;
      case 'Database':
        return <Server className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update systems with new data
    setSystems(prev => prev.map(system => ({
      ...system,
      lastChecked: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 2000) + 50
    })));
    
    setIsRefreshing(false);
  };

  const overallStatus = systems.every(s => s.status === 'healthy') ? 'healthy' : 
                       systems.some(s => s.status === 'error') ? 'error' : 'warning';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Health Status
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            {getStatusBadge(overallStatus)}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getServiceIcon(system.name)}
                <div>
                  <div className="font-medium text-sm">{system.name}</div>
                  <div className="text-xs text-gray-500">{system.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {system.responseTime}ms
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(system.lastChecked).toLocaleTimeString()}
                  </div>
                </div>
                {getStatusIcon(system.status)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Overall Status:</strong> {systems.filter(s => s.status === 'healthy').length} of {systems.length} services healthy
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { SystemHealthStatus };


