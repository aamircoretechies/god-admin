import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader } from '@/components/data-grid';
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
  XCircle,
  AlertCircle
} from 'lucide-react';
import { fetchPrompts, fetchPromptDetail, createPrompt, updatePromptStatus, type PromptResponse, type CreatePromptRequest } from '@/services/promptsApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Types
interface AIPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  targetRole: string;
  language: string;
  status: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  usageCount?: number;
  tags?: string[];
  isPublic?: boolean;
}

// Transform API response to component format
const transformPrompt = (apiData: PromptResponse): AIPrompt => {
  // Format target_role: "AllUsers" -> "All Users"
  const formatTargetRole = (role: string): string => {
    return role.replace(/([A-Z])/g, ' $1').trim();
  };

  // Format category: "VerseExplanation" -> "Verse Explanation"
  const formatCategory = (category: string): string => {
    return category.replace(/([A-Z])/g, ' $1').trim();
  };

  // Extract version number from "v1" format
  const extractVersion = (version: string): string => {
    return version.replace('v', '');
  };

  return {
    id: apiData.template_id,
    title: apiData.title,
    description: apiData.description,
    content: '', // Not in API response
    category: formatCategory(apiData.category),
    targetRole: formatTargetRole(apiData.target_role),
    language: apiData.language,
    status: apiData.status,
    createdAt: apiData.created_at,
    updatedAt: apiData.last_updated,
    version: extractVersion(apiData.version),
    usageCount: apiData.usage_count,
    tags: apiData.tags,
    isPublic: apiData.is_public
  };
};

const PromptListContent: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const pageSize = 10;

  // Convert formatted category back to API format (e.g., "Verse Explanation" -> "VerseExplanation")
  const convertCategoryToApiFormat = (category: string): string => {
    return category.replace(/\s+/g, '');
  };

  // Fetch prompts from API
  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPrompts({
          page: currentPage,
          limit: pageSize,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? convertCategoryToApiFormat(categoryFilter) : undefined,
          search: searchTerm || undefined
        });

        if (response.status === 1 && response.data) {
          const transformed = response.data.map(transformPrompt);
          setPrompts(transformed);
          setTotalCount(transformed.length); // Note: API might return total count separately
        } else {
          throw new Error(response.message || 'Failed to fetch prompts');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load prompts');
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadPrompts();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchTerm]);

  // Handle duplicate prompt
  const handleDuplicate = async (promptId: string) => {
    setDuplicatingId(promptId);
    try {
      // Fetch full prompt detail
      const detailResponse = await fetchPromptDetail(promptId);
      if (detailResponse.status === 1 && detailResponse.data) {
        const promptData = detailResponse.data;

        // Create duplicate with "Copy of " prefix
        const duplicateData: CreatePromptRequest = {
          title: `Copy of ${promptData.title}`,
          description: promptData.description,
          content: promptData.content,
          category: promptData.category,
          targetRole: promptData.target_role,
          language: promptData.language,
          tags: promptData.tags || [],
          isPublic: promptData.is_public
        };

        const createResponse = await createPrompt(duplicateData);
        if (createResponse.status === 1 && createResponse.data) {
          toast.success('Prompt duplicated successfully');
          navigate(`/ai-prompt-management/view/${createResponse.data.template_id}`);
        } else {
          throw new Error(createResponse.message || 'Failed to duplicate prompt');
        }
      } else {
        throw new Error(detailResponse.message || 'Failed to fetch prompt detail');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to duplicate prompt';
      toast.error(errorMessage);
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleToggleStatus = async (promptId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    try {
      const response = await updatePromptStatus(promptId, newStatus as 'Active' | 'Inactive');

      if (response.status === 1) {
        // Update the prompt in the local state
        setPrompts(prevPrompts =>
          prevPrompts.map(prompt =>
            prompt.id === promptId
              ? { ...prompt, status: newStatus }
              : prompt
          )
        );
        toast.success(`Prompt ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update prompt status');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update prompt status';
      toast.error(errorMessage);
    }
  };

  // Filter prompts (client-side filtering as fallback, but API should handle it)
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || prompt.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [prompts, searchTerm, statusFilter, categoryFilter]);

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
    const colors: Record<string, string> = {
      'Verse Explanation': 'bg-amber-100 text-amber-800',
      'Chapter Summary': 'bg-purple-100 text-purple-800',
      'Daily Reflection': 'bg-green-100 text-green-800',
      'Study Guide': 'bg-orange-100 text-orange-800',
      'Prayer Guide': 'bg-pink-100 text-pink-800',
      'Historical Context': 'bg-blue-100 text-blue-800',
      'Chapter Context': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="default" className={colors[category] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'All Users':
        return <Badge variant="outline">All Users</Badge>;
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
              <DropdownMenuItem
                onClick={() => handleDuplicate(row.original.id)}
                disabled={duplicatingId === row.original.id}
              >
                <Copy className="w-4 h-4 mr-2" />
                {duplicatingId === row.original.id ? 'Duplicating...' : 'Duplicate Prompt'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleStatus(row.original.id, row.original.status)}
              >
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
              {/* Delete Prompt option commented out
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Prompt
              </DropdownMenuItem>
              */}
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

  // Get unique categories from prompts
  const uniqueCategories = useMemo(() => {
    const categories = new Set(prompts.map(p => p.category));
    return Array.from(categories).sort();
  }, [prompts]);

  const toolbar = (
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredPrompts.length} of {totalCount || prompts.length} prompts
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prompts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Prompts</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <DataGrid
      columns={columns}
      data={filteredPrompts}
      pagination={{ size: 10 }}
      sorting={[{ id: 'title', desc: false }]}
      toolbar={toolbar}
      layout={{ card: true }}
    />
  );
};

export { PromptListContent };
