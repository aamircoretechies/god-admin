import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  History,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Types
interface AIPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'Verse Explanation' | 'Chapter Summary' | 'Daily Reflection' | 'Study Guide' | 'Prayer Guide';
  targetRole: 'All Users' | 'Premium Only' | 'Admin Only';
  language: 'English' | 'Dutch';
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// Mock data
const mockPrompts: AIPrompt[] = [
  {
    id: '1',
    title: 'Verse Explanation Template',
    description: 'AI prompt for explaining biblical verses in simple terms',
    content: 'Please explain the following Bible verse in simple, easy-to-understand language. Include the historical context, key themes, and practical application for daily life.',
    category: 'Verse Explanation',
    targetRole: 'All Users',
    language: 'English',
    status: 'Active',
    createdBy: 'Admin User',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    version: 3
  },
  {
    id: '2',
    title: 'Chapter Summary Generator',
    description: 'Generate comprehensive summaries of Bible chapters',
    content: 'Create a detailed summary of the following Bible chapter. Include the main events, key characters, important themes, and spiritual lessons that can be applied today.',
    category: 'Chapter Summary',
    targetRole: 'Premium Only',
    language: 'English',
    status: 'Active',
    createdBy: 'Admin User',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    version: 2
  },
  {
    id: '3',
    title: 'Daily Reflection Prompt',
    description: 'Guide users in daily spiritual reflection',
    content: 'Help me reflect on this Bible passage for my daily spiritual growth. What does this teach me about God, myself, and how I should live?',
    category: 'Daily Reflection',
    targetRole: 'All Users',
    language: 'English',
    status: 'Active',
    createdBy: 'Admin User',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
    version: 1
  },
  {
    id: '4',
    title: 'Study Guide Template',
    description: 'Create structured study guides for Bible study groups',
    content: 'Develop a comprehensive study guide for this Bible passage. Include discussion questions, background information, and application points for group study.',
    category: 'Study Guide',
    targetRole: 'Premium Only',
    language: 'English',
    status: 'Inactive',
    createdBy: 'Admin User',
    createdAt: '2024-01-08T15:40:00Z',
    updatedAt: '2024-01-16T10:15:00Z',
    version: 1
  },
  {
    id: '5',
    title: 'Prayer Guide Generator',
    description: 'Generate prayer prompts based on Bible passages',
    content: 'Based on this Bible passage, help me create a prayer that reflects the themes and lessons found in this text.',
    category: 'Prayer Guide',
    targetRole: 'All Users',
    language: 'Dutch',
    status: 'Active',
    createdBy: 'Admin User',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-21T09:30:00Z',
    version: 2
  }
];

const PromptListContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return mockPrompts.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || prompt.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Verse Explanation': 'bg-blue-100 text-blue-800',
      'Chapter Summary': 'bg-purple-100 text-purple-800',
      'Daily Reflection': 'bg-green-100 text-green-800',
      'Study Guide': 'bg-orange-100 text-orange-800',
      'Prayer Guide': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge variant="default" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'All Users':
        return <Badge variant="secondary">All Users</Badge>;
      case 'Premium Only':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium Only</Badge>;
      case 'Admin Only':
        return <Badge variant="destructive">Admin Only</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
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

  const ColumnInputFilter = <TData, TValue>({ column }: any) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<AIPrompt>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-12'
        }
      },
      {
        accessorFn: (row: AIPrompt) => row,
        id: 'title',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Prompt Name"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Link 
              to={`/ai-prompt-management/view/${row.original.id}`}
              className="text-sm font-medium text-gray-900 hover:text-primary-active mb-1"
            >
              {row.original.title}
            </Link>
            <span className="text-xs text-gray-500 line-clamp-2">
              {row.original.description}
            </span>
            <div className="flex items-center gap-2 mt-1">
              {getCategoryBadge(row.original.category)}
              {getRoleBadge(row.original.targetRole)}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[300px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: AIPrompt) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getStatusBadge(row.original.status),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: AIPrompt) => row.language,
        id: 'language',
        header: ({ column }) => <DataGridColumnHeader title="Language" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.original.language}
          </Badge>
        ),
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: AIPrompt) => row.updatedAt,
        id: 'updatedAt',
        header: ({ column }) => <DataGridColumnHeader title="Last Updated" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{formatDate(row.original.updatedAt)}</p>
            <p className="text-xs text-gray-500">v{row.original.version}</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[140px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/ai-prompt-management/view/${row.original.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Prompt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/ai-prompt-management/edit/${row.original.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Prompt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/ai-prompt-management/history/${row.original.id}`}>
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Prompt
              </DropdownMenuItem>
              <DropdownMenuItem>
                {row.original.status === 'Active' ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Prompt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        meta: {
          headerClassName: 'w-40',
          cellClassName: 'text-gray-800 font-medium'
        }
      }
    ],
    []
  );

  const handleRowSelection = (state: any) => {
    const selectedRowIds = Object.keys(state);
    console.log(`Selected ${selectedRowIds.length} prompts:`, selectedRowIds);
  };

  const Toolbar = () => (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by prompt name, description, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Verse Explanation">Verse Explanation</option>
            <option value="Chapter Summary">Chapter Summary</option>
            <option value="Daily Reflection">Daily Reflection</option>
            <option value="Study Guide">Study Guide</option>
            <option value="Prayer Guide">Prayer Guide</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredPrompts.length} of {mockPrompts.length} prompts
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <DataGrid
      columns={columns}
      data={filteredPrompts}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'title', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { PromptListContent };
