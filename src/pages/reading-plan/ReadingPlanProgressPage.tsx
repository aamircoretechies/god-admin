import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toAbsoluteUrl } from '@/utils';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  Edit,
  Mail
} from 'lucide-react';

interface UserProgress {
  id: string;
  name: string;
  email: string;
  avatar: string;
  planId: string;
  planTitle: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'lagging';
  chaptersCompleted: number;
  totalChapters: number;
  lastReadDate: string;
  daysBehind: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  achieved: boolean;
  date: string;
}

const mockUserProgress: UserProgress[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/media/avatars/300-1.png',
    planId: '1',
    planTitle: '30-Day New Testament',
    progress: 78,
    status: 'in_progress',
    chaptersCompleted: 203,
    totalChapters: 260,
    lastReadDate: '2024-01-20',
    daysBehind: 0,
    milestones: [
      { id: '1', title: 'First Chapter Completed', achieved: true, date: '2024-01-15' },
      { id: '2', title: 'Week 1 Completed', achieved: true, date: '2024-01-22' },
      { id: '3', title: 'Week 2 Completed', achieved: false, date: '2024-01-29' }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/media/avatars/300-2.png',
    planId: '2',
    planTitle: 'Psalms in 7 Days',
    progress: 92,
    status: 'in_progress',
    chaptersCompleted: 138,
    totalChapters: 150,
    lastReadDate: '2024-01-21',
    daysBehind: 0,
    milestones: [
      { id: '1', title: 'First 25 Psalms', achieved: true, date: '2024-01-20' },
      { id: '2', title: 'Halfway Point', achieved: true, date: '2024-01-21' },
      { id: '3', title: 'Complete', achieved: false, date: '2024-01-27' }
    ]
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: '/media/avatars/300-3.png',
    planId: '1',
    planTitle: '30-Day New Testament',
    progress: 45,
    status: 'lagging',
    chaptersCompleted: 117,
    totalChapters: 260,
    lastReadDate: '2024-01-18',
    daysBehind: 3,
    milestones: [
      { id: '1', title: 'First Chapter Completed', achieved: true, date: '2024-01-15' },
      { id: '2', title: 'Week 1 Completed', achieved: false, date: '2024-01-22' },
      { id: '3', title: 'Week 2 Completed', achieved: false, date: '2024-01-29' }
    ]
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: '/media/avatars/300-4.png',
    planId: '3',
    planTitle: 'Gospel of John Study',
    progress: 100,
    status: 'completed',
    chaptersCompleted: 21,
    totalChapters: 21,
    lastReadDate: '2024-01-25',
    daysBehind: 0,
    milestones: [
      { id: '1', title: 'First Chapter Completed', achieved: true, date: '2024-01-10' },
      { id: '2', title: 'Halfway Point', achieved: true, date: '2024-01-20' },
      { id: '3', title: 'Complete', achieved: true, date: '2024-01-25' }
    ]
  }
];

const ReadingPlanProgressPage = () => {
  const [userProgress, setUserProgress] = useState<UserProgress[]>(mockUserProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);

  const filteredProgress = userProgress.filter(progress => {
    const matchesSearch = progress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         progress.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || progress.status === statusFilter;
    const matchesPlan = planFilter === 'all' || progress.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'lagging':
        return 'bg-red-100 text-red-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'progress-success';
    if (progress >= 60) return 'progress-warning';
    return 'progress-danger';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'lagging':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'not_started':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleManualUpdate = (userId: string, newProgress: number) => {
    setUserProgress(userProgress.map(progress => {
      if (progress.id === userId) {
        return {
          ...progress,
          progress: newProgress,
          chaptersCompleted: Math.round((newProgress / 100) * progress.totalChapters)
        };
      }
      return progress;
    }));
  };

  const uniquePlans = Array.from(new Set(userProgress.map(p => ({ id: p.planId, title: p.planTitle }))));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Progress Tracking</h1>
          <p className="text-gray-600 mt-2">Monitor and manage user progress on reading plans</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <TrendingUp className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lagging Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.filter(p => p.status === 'lagging').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="lagging">Lagging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {uniquePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredProgress.length} results
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Progress List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            User Progress ({filteredProgress.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProgress.map((progress) => (
              <div key={progress.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img src={toAbsoluteUrl(progress.avatar)} alt={progress.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{progress.name}</h3>
                      <p className="text-sm text-gray-600">{progress.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(progress.status)}>
                      {progress.status.replace('_', ' ').charAt(0).toUpperCase() + progress.status.slice(1).replace('_', ' ')}
                    </Badge>
                    {progress.daysBehind > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        {progress.daysBehind} days behind
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reading Plan</p>
                    <p className="text-sm text-gray-600">{progress.planTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chapters</p>
                    <p className="text-sm text-gray-600">
                      {progress.chaptersCompleted} / {progress.totalChapters}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Read</p>
                    <p className="text-sm text-gray-600">{progress.lastReadDate}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress.progress}%</span>
                  </div>
                  <div className={`progress h-2 ${getProgressColor(progress.progress)}`}>
                    <div className="progress-bar" style={{ width: `${progress.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(progress.status)}
                    <span className="text-sm text-gray-600">
                      {progress.milestones.filter(m => m.achieved).length} / {progress.milestones.length} milestones
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedUser(progress)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Remind
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {selectedUser.name} - Progress Details
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Plan Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span>{selectedUser.planTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span>{selectedUser.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chapters:</span>
                      <span>{selectedUser.chaptersCompleted} / {selectedUser.totalChapters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Read:</span>
                      <span>{selectedUser.lastReadDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {selectedUser.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-2">
                        {milestone.achieved ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${milestone.achieved ? 'text-gray-900' : 'text-gray-500'}`}>
                          {milestone.title}
                        </span>
                        {milestone.achieved && (
                          <span className="text-xs text-gray-500">({milestone.date})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { ReadingPlanProgressPage }; 