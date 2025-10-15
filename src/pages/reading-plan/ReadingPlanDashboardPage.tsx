import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  activeUsers: number;
  completionRate: number;
  status: 'active' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  totalChapters: number;
  completedChapters: number;
}

const mockReadingPlans: ReadingPlan[] = [
  {
    id: '1',
    title: '30-Day New Testament',
    description: 'Complete journey through the New Testament in 30 days',
    duration: '30 days',
    activeUsers: 1250,
    completionRate: 78,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    totalChapters: 260,
    completedChapters: 203
  },
  {
    id: '2',
    title: 'Psalms in 7 Days',
    description: 'Deep dive into the book of Psalms',
    duration: '7 days',
    activeUsers: 890,
    completionRate: 92,
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-01-27',
    totalChapters: 150,
    completedChapters: 138
  },
  {
    id: '3',
    title: 'Gospel of John Study',
    description: 'In-depth study of the Gospel of John',
    duration: '21 days',
    activeUsers: 650,
    completionRate: 65,
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-01-31',
    totalChapters: 21,
    completedChapters: 14
  }
];

const ReadingPlanDashboardPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'progress-success';
    if (rate >= 60) return 'progress-warning';
    return 'progress-danger';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reading Plan Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage all reading plans</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <BookOpen className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">{mockReadingPlans.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockReadingPlans.reduce((sum, plan) => sum + plan.activeUsers, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mockReadingPlans.reduce((sum, plan) => sum + plan.completionRate, 0) / mockReadingPlans.length)}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Milestones</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Reading Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Active Reading Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReadingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{plan.activeUsers} users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{plan.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {plan.completedChapters}/{plan.totalChapters} chapters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{plan.completionRate}% complete</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{plan.completionRate}%</span>
                  </div>
                  <div className={`progress h-2 ${getProgressColor(plan.completionRate)}`}>
                    <div className="progress-bar" style={{ width: `${plan.completionRate}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {plan.startDate} - {plan.endDate}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-1" />
                      Manage Users
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'Chapter 5 completion', plan: '30-Day New Testament', date: '2024-01-25', users: 45 },
              { title: 'Week 2 milestone', plan: 'Psalms in 7 Days', date: '2024-01-22', users: 23 },
              { title: 'Gospel study completion', plan: 'Gospel of John Study', date: '2024-01-28', users: 67 }
            ].map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    <p className="text-sm text-gray-600">{milestone.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{milestone.date}</p>
                  <p className="text-sm text-gray-600">{milestone.users} users</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ReadingPlanDashboardPage }; 