import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid, DataGridColumnHeader } from '@/components/data-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toAbsoluteUrl } from '@/utils';
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
  Download,
  Flag,
  Volume2,
  Paperclip,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  deleteNote,
  exportNotes,
  fetchNotes,
  flagNote,
  type NoteResponse
} from '@/services/notesApi';
import { toast } from 'sonner';

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

// Transform API response to component format
const transformNote = (apiData: NoteResponse): Note => {
  // Parse verse_id to extract verse reference
  const parseVerseId = (verseId: string | null): string[] => {
    if (!verseId) return [];

    // Handle different verse_id formats:
    // "Genesis_1_3_SV" -> "Genesis 1:3 (SV)"
    // "Gen_1_1_SV" -> "Gen 1:1 (SV)"
    // "Jude_1_1_SV" -> "Jude 1:1 (SV)"
    // "Jude_23_1_SV" -> "Jude 23:1 (SV)"
    // "Jude_1_SV" -> "Jude 1 (SV)"
    // "Gen_1_2" -> "Gen 1:2"

    try {
      const parts = verseId.split('_');
      if (parts.length >= 2) {
        const book = parts[0];
        const chapter = parts[1];

        // Check if last part is a version (2-3 letter code like SV, KJV)
        const lastPart = parts[parts.length - 1];
        const isVersion = lastPart.length <= 3 && /^[A-Z]+$/.test(lastPart);

        if (parts.length >= 4 && isVersion) {
          // Format: Book_Chapter_Verse_Version
          const verse = parts[2];
          return [`${book} ${chapter}:${verse} (${lastPart})`];
        } else if (parts.length === 3 && isVersion) {
          // Format: Book_Chapter_Version
          return [`${book} ${chapter} (${lastPart})`];
        } else if (parts.length >= 3) {
          // Format: Book_Chapter_Verse (no version)
          const verse = parts[2];
          return [`${book} ${chapter}:${verse}`];
        } else {
          // Format: Book_Chapter (no version)
          return [`${book} ${chapter}`];
        }
      }
    } catch {
      // If parsing fails, return the original verse_id
      return [verseId];
    }

    return [verseId];
  };

  // Clean emotion_tags - some might be JSON strings
  const cleanTags = (tags: string[]): string[] => {
    return tags
      .filter((tag) => {
        // Skip JSON strings and CONTINUE_READING entries
        if (tag.startsWith('{') || tag.startsWith('CONTINUE_READING')) {
          return false;
        }
        return true;
      })
      .map((tag) => {
        // Capitalize first letter
        return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
      });
  };

  // Extract title from content (first line or first 50 chars)
  const extractTitle = (content: string): string => {
    if (content.startsWith('CONTINUE_READING')) {
      return 'Reading Progress';
    }
    const firstLine = content.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  };

  const verseId = apiData.verse_id;
  const linkedVerses = parseVerseId(verseId);
  const tags = cleanTags(apiData.emotion_tags);
  const title = extractTitle(apiData.content);

  // Generate avatar from user ID (same logic as UserBasicInfo)
  const avatarNumber = (parseInt(apiData.user_id.replace(/-/g, ''), 16) % 34) + 1;
  const userAvatar = toAbsoluteUrl(`/media/avatars/300-${avatarNumber}.png`);

  return {
    id: apiData.note_id,
    userId: apiData.user_id,
    userName: apiData.username || `User ${apiData.user_id.slice(0, 8)}`, // Use username from API
    userEmail: `user-${apiData.user_id.slice(0, 8)}@example.com`, // Fallback
    userAvatar: userAvatar,
    title: title,
    content: apiData.content,
    linkedVerses: linkedVerses,
    tags: tags,
    status: 'active', // Default status, API doesn't provide this
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    hasAudio: false, // API doesn't provide this
    hasAttachments: false, // API doesn't provide this
    isFavorite: false, // API doesn't provide this
    language: 'English' // Default, API doesn't provide this
  };
};

const NotesOverviewContent: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch notes from API
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch a large enough dataset for client-side filtering since API current structure is limited
        const response = await fetchNotes({
          page: 1,
          limit: 1000, // Fetch top 1000 notes to enable reliable client-side filtering
          search: undefined,
          user_id: undefined
        });

        if (response.status === 1 && response.data) {
          const transformed = response.data.map(transformNote);
          setNotes(transformed);
          setTotalCount(response.data.length);
        } else {
          throw new Error(response.message || 'Failed to fetch notes');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load notes');
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []); // Only fetch once on mount

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, userFilter, languageFilter, searchTerm]);

  // Get unique user IDs for filter from ALL notes
  const uniqueUserIds = useMemo(() => {
    const userIds = new Set(notes.map((n) => n.userId));
    return Array.from(userIds);
  }, [notes]);

  // Filter notes (client-side filtering)
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((note) => note.status === statusFilter);
    }

    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter((note) => note.language === languageFilter);
    }

    // Apply user filter
    if (userFilter !== 'all') {
      filtered = filtered.filter((note) => note.userId === userFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerSearch) ||
          note.content.toLowerCase().includes(lowerSearch) ||
          note.userName.toLowerCase().includes(lowerSearch) ||
          note.userEmail.toLowerCase().includes(lowerSearch) ||
          note.linkedVerses.some((verse) => verse.toLowerCase().includes(lowerSearch)) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  }, [notes, searchTerm, statusFilter, userFilter, languageFilter]);

  // Update total pages based on filtered results
  useEffect(() => {
    setTotalPages(Math.ceil(filteredNotes.length / pageSize));
  }, [filteredNotes]);

  // Get current paginated notes
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotes.slice(start, start + pageSize);
  }, [filteredNotes, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'deleted':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Deleted
          </Badge>
        );
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

  // const ColumnInputFilter = <TData, TValue>({ column }: any) => {
  //   return (
  //     <Input
  //       placeholder="Filter..."
  //       value={(column.getFilterValue() as string) ?? ''}
  //       onChange={(event) => column.setFilterValue(event.target.value)}
  //       className="h-9 w-full max-w-40"
  //     />
  //   );
  // };

  const columns = useMemo<ColumnDef<Note>[]>(
    () => [
      {
        accessorFn: (row: Note) => row,
        id: 'user',
        // header: ({ column }) => (
        //   <DataGridColumnHeader
        //     title="User"
        //     filter={<ColumnInputFilter column={column} />}
        //     column={column}
        //   />
        // ),
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">
            User
          </span>
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
              <span className="text-2sm text-gray-700 font-normal">{row.original.userEmail}</span>
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
        // header: ({ column }) => (
        //   <DataGridColumnHeader
        //     title="Title / Content"
        //     filter={<ColumnInputFilter column={column} />}
        //     column={column}
        //   />
        // ),
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">
            Title / Content
          </span>
        ),

        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="font-medium text-sm truncate">{row.original.title}</p>
            <p className="text-xs text-gray-600 truncate">{row.original.content}</p>
            <div className="flex gap-1 mt-1">
              {row.original.hasAudio && <Volume2 className="w-3 h-3 text-amber-500" />}
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
        // header: ({ column }) => <DataGridColumnHeader title="Linked Verses" column={column} />,
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
        // header: ({ column }) => <DataGridColumnHeader title="Tags" column={column} />,
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-800 border border-gray-300"
              >
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
        // header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
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
        // header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
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
        // header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        header: () => (
          <span className="text-sm font-medium select-none cursor-default">Actions</span>
        ),
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
              {/* <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link to={`/notes-journals/detail/${row.original.id}?edit=true`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleExport(row.original)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleFlag(row.original.id)}>
                <Flag className="w-4 h-4 mr-2" />
                {row.original.status === 'flagged' ? 'Unflag' : 'Flag'}
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(row.original.id)}
              >
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

  const handleFlag = async (id: string) => {
    // console.log("FLAG REQUEST TRIGGERED");
    // console.log("Note ID to flag:", id);
    // console.log("Sending reason:", "Inappropriate content");

    try {
      const res = await flagNote(id, 'Inappropriate content');

      // Log full backend response
      // console.log("FLAG API SUCCESS RESPONSE:", res);

      if (res.status === 1) {
        // console.log("Flagging successful. Updating UI...");

        // Update UI instantly
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'flagged' } : n)));

        // console.log(" Updated notes state:", notes);

        toast.success('Note flagged successfully!');
      } else {
        // console.warn(" FLAG API returned status 0:", res);
        toast.error(res.message || 'Failed to flag note');
      }
    } catch (error: any) {
      // console.error(" FLAG API ERROR:", error);

      console.error('FLAG API ERROR RESPONSE:', error?.response?.data || 'No backend response');

      toast.error(error?.response?.data?.message || 'Error flagging note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      //  Direct delete on click (no confirm)
      const res = await deleteNote(id);

      if (res.status === 1) {
        // Backend success message toast
        toast.success(res.message || 'Note deleted successfully!');

        // Refresh the page immediately after successful deletion
        window.location.reload();
      } else {
        //  Backend error message toast
        toast.error(res.message || 'Failed to delete note');
      }
    } catch (error: any) {
      //  API error toast
      toast.error(error?.response?.data?.message || 'Error deleting note');
    }
  };

  const handleExport = async (note: Note) => {
    try {
      const res = await exportNotes(
        'json', // format: json OR csv
        note.status || 'Active', // status filter
        note.userEmail // export only this user's notes
      );

      // Create file URL
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));

      // Create temp link to download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `notes-export.${'json'}`; // or csv based on format
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Notes exported successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to export notes');
    }
  };

  const toolbar = (
    // <div className="flex flex-col gap-4 p-5">
    <div className="flex flex-col gap-4 p-3 md:p-5">
      {/* <div className="flex items-center justify-between"> */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* <div className="flex items-center gap-4"> */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          {/* <div className="flex-1 relative"> */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by user, keyword, verse, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // className="pl-10 max-w-md"
              className="pl-10 w-full"
            />
          </div>
          {/* <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white"
          > */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
            {/* <option value="deleted">Deleted</option> */}
          </select>
          {/* <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white"
          > */}
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white w-full md:w-auto"
          >
            <option value="all">All Users</option>
            {uniqueUserIds.map((userId) => {
              const note = notes.find((n) => n.userId === userId);
              return (
                <option key={userId} value={userId}>
                  {note?.userName || `User ${userId.slice(0, 8)}`}
                </option>
              );
            })}
          </select>
          {/* <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white"
          > */}
          {/* <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-card dark:text-white w-full md:w-auto"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select> */}
        </div>
        {/* <div className="flex items-center gap-2"> */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm text-gray-600">
            {filteredNotes.length !== notes.length ? (
              <>
                Showing <b>{filteredNotes.length}</b> matching notes (from {totalCount} total)
              </>
            ) : (
              <>
                Showing <b>{totalCount}</b> total notes
              </>
            )}
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
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Notes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataGrid
        columns={columns}
        data={paginatedNotes}
        pagination={{ size: 10 }}
        sorting={[{ id: 'createdAt', desc: true }]}
        toolbar={toolbar}
        layout={{ card: true }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({filteredNotes.length} matching results)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { NotesOverviewContent };
