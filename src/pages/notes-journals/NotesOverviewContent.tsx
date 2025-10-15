import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Flag, 
  User, 
  Calendar,
  Tag,
  BookOpen,
  Volume2,
  Paperclip
} from 'lucide-react';

// Types
interface Note {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  title: string;
  content: string;
  linkedVerses: string[];
  tags: string[];
  status: 'active' | 'flagged' | 'deleted';
  createdAt: string;
  updatedAt: string;
  hasAudio: boolean;
  hasAttachments: boolean;
  isFavorite: boolean;
  language: string;
}

// Mock data
const mockNotes: Note[] = [
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
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    hasAudio: true,
    hasAttachments: false,
    isFavorite: true,
    language: 'English'
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
    hasAudio: false,
    hasAttachments: true,
    isFavorite: false,
    language: 'English'
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
    status: 'active',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
    hasAudio: true,
    hasAttachments: true,
    isFavorite: true,
    language: 'English'
  }
];

const NotesOverviewContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Filter notes
  const filteredNotes = useMemo(() => {
    return mockNotes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.linkedVerses.some(verse => verse.toLowerCase().includes(searchTerm.toLowerCase())) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
      const matchesUser = userFilter === 'all' || note.userId === userFilter;
      const matchesLanguage = languageFilter === 'all' || note.language === languageFilter;

      return matchesSearch && matchesStatus && matchesUser && matchesLanguage;
    });
  }, [searchTerm, statusFilter, userFilter, languageFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'deleted':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const columns = useMemo<ColumnDef<Note>[]>(
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
        accessorFn: (row: Note) => row,
        id: 'user',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="User"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
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
              <Link 
                to={`/notes-journals/detail/${row.original.id}`}
                className="text-xs text-primary hover:text-primary-active mt-1"
              >
                View Details →
              </Link>
            </div>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: Note) => row,
        id: 'content',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Title / Content"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
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
        accessorFn: (row: Note) => row.linkedVerses,
        id: 'linkedVerses',
        header: ({ column }) => <DataGridColumnHeader title="Linked Verses" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.linkedVerses.map((verse, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {verse}
              </Badge>
            ))}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: Note) => row.tags,
        id: 'tags',
        header: ({ column }) => <DataGridColumnHeader title="Tags" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: Note) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: ({ row }) => getStatusBadge(row.original.status),
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: Note) => row.createdAt,
        id: 'createdAt',
        header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm">
            <p>{formatDate(row.original.createdAt)}</p>
            <p className="text-xs text-gray-500">Updated: {formatDate(row.original.updatedAt)}</p>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[180px]',
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
                <Link to={`/notes-journals/detail/${row.original.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="w-4 h-4 mr-2" />
                {row.original.status === 'flagged' ? 'Unflag' : 'Flag'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
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
    console.log(`Selected ${selectedRowIds.length} notes:`, selectedRowIds);
  };

  const Toolbar = () => (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, keyword, verse, tag..."
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
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
            <option value="deleted">Deleted</option>
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Users</option>
            <option value="user1">John Doe</option>
            <option value="user2">Jane Smith</option>
            <option value="user3">Mike Johnson</option>
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredNotes.length} of {mockNotes.length} notes
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
      sorting={[{ id: 'createdAt', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { NotesOverviewContent };

