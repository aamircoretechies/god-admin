import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertTriangle, 
  MoreVertical, 
  Eye, 
  Check, 
  X, 
  Trash2, 
  Download, 
  Flag,
  Clock,
  User,
  Calendar,
  Tag,
  BookOpen,
  Volume2,
  Paperclip,
  AlertCircle
} from 'lucide-react';

// Types
interface FlaggedNote {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  title: string;
  content: string;
  linkedVerses: string[];
  tags: string[];
  status: 'flagged';
  createdAt: string;
  updatedAt: string;
  flaggedAt: string;
  flagReason: string;
  flaggedBy: string;
  hasAudio: boolean;
  hasAttachments: boolean;
  isFavorite: boolean;
  language: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock data
const mockFlaggedNotes: FlaggedNote[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userAvatar: '/media/avatars/300-1.png',
    title: 'Reflection on Psalm 23',
    content: 'The Lord is my shepherd, I shall not want...',
    linkedVerses: ['Psalm 23:1-6'],
    tags: ['Faith', 'Trust', 'Comfort'],
    status: 'flagged',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    flaggedAt: '2024-01-15T14:20:00Z',
    flagReason: 'Inappropriate content',
    flaggedBy: 'Auto-moderation',
    hasAudio: true,
    hasAttachments: false,
    isFavorite: true,
    language: 'English',
    priority: 'high'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userAvatar: '/media/avatars/300-2.png',
    title: 'Daily Prayer Journal',
    content: 'Today I am grateful for...',
    linkedVerses: ['1 Thessalonians 5:18'],
    tags: ['Gratitude', 'Prayer'],
    status: 'flagged',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
    flaggedAt: '2024-01-14T12:30:00Z',
    flagReason: 'Reported by user',
    flaggedBy: 'user@example.com',
    hasAudio: false,
    hasAttachments: true,
    isFavorite: false,
    language: 'English',
    priority: 'medium'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    userAvatar: '/media/avatars/300-3.png',
    title: 'Study Notes on Romans',
    content: 'Romans 8:28 - All things work together for good...',
    linkedVerses: ['Romans 8:28', 'Romans 8:29'],
    tags: ['Study', 'Romans', 'God\'s Plan'],
    status: 'flagged',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
    flaggedAt: '2024-01-13T16:45:00Z',
    flagReason: 'Spam detection',
    flaggedBy: 'Auto-moderation',
    hasAudio: true,
    hasAttachments: true,
    isFavorite: true,
    language: 'English',
    priority: 'low'
  }
];

const ModerationQueueContent: React.FC = () => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter notes by priority
  const filteredNotes = useMemo(() => {
    if (priorityFilter === 'all') return mockFlaggedNotes;
    return mockFlaggedNotes.filter(note => note.priority === priorityFilter);
  }, [priorityFilter]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
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

  const getTimeSinceFlagged = (flaggedAt: string) => {
    const now = new Date();
    const flagged = new Date(flaggedAt);
    const diffInHours = Math.floor((now.getTime() - flagged.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just flagged';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleApproveNote = (noteId: string) => {
    console.log(`Approving note: ${noteId}`);
    // Implement approve functionality
  };

  const handleRejectNote = (noteId: string) => {
    console.log(`Rejecting note: ${noteId}`);
    // Implement reject functionality
  };

  const handleDeleteNote = (noteId: string) => {
    console.log(`Deleting note: ${noteId}`);
    // Implement delete functionality
  };

  const columns = useMemo<ColumnDef<FlaggedNote>[]>(
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
        accessorFn: (row: FlaggedNote) => row.priority,
        id: 'priority',
        header: ({ column }) => <DataGridColumnHeader title="Priority" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getPriorityBadge(row.original.priority),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: FlaggedNote) => row,
        id: 'user',
        header: ({ column }) => <DataGridColumnHeader title="User" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8">
              <AvatarImage src={row.original.userAvatar} />
              <AvatarFallback>{row.original.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link 
                to={`/notes-journals/detail/${row.original.id}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
              >
                {row.original.userName}
              </Link>
              <span className="text-2sm text-gray-700 font-normal">
                {row.original.userEmail}
              </span>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: FlaggedNote) => row,
        id: 'content',
        header: ({ column }) => <DataGridColumnHeader title="Title / Content" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="font-medium text-sm truncate">{row.original.title}</p>
            <p className="text-xs text-gray-600 truncate">{row.original.content}</p>
            <div className="flex gap-1 mt-1">
              {row.original.hasAudio && <Volume2 className="w-3 h-3 text-blue-500" />}
              {row.original.hasAttachments && <Paperclip className="w-3 h-3 text-green-500" />}
              {row.original.isFavorite && <span className="text-yellow-500">★</span>}
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: FlaggedNote) => row.flagReason,
        id: 'flagReason',
        header: ({ column }) => <DataGridColumnHeader title="Flag Reason" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="text-sm font-medium text-red-600">{row.original.flagReason}</p>
            <p className="text-xs text-gray-500">{formatDate(row.original.flaggedAt)}</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: FlaggedNote) => row.flaggedBy,
        id: 'flaggedBy',
        header: ({ column }) => <DataGridColumnHeader title="Flagged By" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium">{row.original.flaggedBy}</p>
            <p className="text-xs text-gray-500">
              {row.original.flaggedBy === 'Auto-moderation' ? 'System' : 'User Report'}
            </p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: FlaggedNote) => row.flaggedAt,
        id: 'timeSinceFlagged',
        header: ({ column }) => <DataGridColumnHeader title="Time Since Flagged" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            {getTimeSinceFlagged(row.original.flaggedAt)}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Link to={`/notes-journals/detail/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApproveNote(row.original.id)}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRejectNote(row.original.id)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDeleteNote(row.original.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
    console.log(`Selected ${selectedRowIds.length} flagged notes:`, selectedRowIds);
  };

  const Toolbar = () => (
    <div className="flex flex-col gap-4 p-5">
      {/* Alert Banner */}
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <div>
          <p className="font-medium text-red-900">
            ⚠️ {filteredNotes.length} notes flagged for review
          </p>
          <p className="text-sm text-red-700">
            {filteredNotes.filter(note => note.priority === 'high').length} high priority items require immediate attention
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredNotes.length} flagged notes
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <DataGrid
      columns={columns}
      data={filteredNotes}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'priority', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ModerationQueueContent };

