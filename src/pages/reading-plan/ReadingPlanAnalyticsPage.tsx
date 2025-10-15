import { ReactElement } from 'react';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/container';

const ReadingPlanAnalyticsPage = (): ReactElement => {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reading Plan Analytics</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
            <div className="text-3xl font-bold text-green-600">85%</div>
            <p className="text-sm text-gray-600 mt-2">Average completion rate across all plans</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Users</h3>
            <div className="text-3xl font-bold text-blue-600">1,247</div>
            <p className="text-sm text-gray-600 mt-2">Users currently following reading plans</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Total Plans</h3>
            <div className="text-3xl font-bold text-purple-600">24</div>
            <p className="text-sm text-gray-600 mt-2">Active reading plans available</p>
          </Card>
        </div>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
          <p className="text-gray-600">
            This page will contain detailed analytics for reading plans including user engagement, 
            completion rates, popular content, and performance metrics.
          </p>
        </Card>
      </div>
    </Container>
  );
};

export { ReadingPlanAnalyticsPage }; 