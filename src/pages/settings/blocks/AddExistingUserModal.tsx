import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { UserPlus, Search, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchRoles, type Role } from '@/services/rolesApi';
import { getAvailableRoles, createTeamMember, fetchUsers } from '@/services/usersApi';

interface AddExistingUserModalProps {
  trigger?: React.ReactNode;
  onMemberAdded?: () => void;
}

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

const AddExistingUserModal: React.FC<AddExistingUserModalProps> = ({ trigger, onMemberAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('FREE');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await fetchRoles();
        if (response.status === 1 && response.data) {
          setAvailableRoles(response.data);
        }
      } catch (error: any) {
        console.error('Error loading roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  // Search users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);
      try {
        const response = await fetchUsers({
          page: 1,
          limit: 10,
          search: searchQuery.trim()
        });

        if (response.status === 1 && response.data?.users) {
          const users = response.data.users.map((user: any) => ({
            id: user.id || user.user_id,
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name',
            email: user.email
          }));
          setSearchResults(users);
          setShowResults(users.length > 0);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error: any) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: UserSearchResult) => {
    setSelectedUser(user);
    setSearchQuery(`${user.name} (${user.email})`);
    setShowResults(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser && !searchQuery.trim()) {
      toast.error('Please search and select a user');
      return;
    }

    const userEmail = selectedUser?.email || searchQuery.trim();
    if (!userEmail) {
      toast.error('Please select a user or enter an email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // For existing users, we just need to assign a role (no password)
      // The backend should handle finding the user and assigning the role
      const isCustomRole = selectedRole !== 'ADMIN' && selectedRole !== 'FREE' && selectedRole !== 'PREMIUM';
      const response = await createTeamMember({
        email: userEmail,
        // /* role: selectedRole as 'FREE' | 'PREMIUM' | 'ADMIN', */
        // /* custom_role_id: selectedRole !== 'ADMIN' && selectedRole !== 'FREE' && selectedRole !== 'PREMIUM' 
        //   ? selectedRole 
        //   : undefined */
        role: 'FREE', // Enforced as per requirement
        custom_role_id: isCustomRole ? selectedRole : undefined
      });

      if (response.status === 1) {
        toast.success('User added to team successfully');
        setSearchQuery('');
        setSelectedUser(null);
        setSearchResults([]);
        setSelectedRole('FREE');
        setIsOpen(false);

        if (onMemberAdded) {
          onMemberAdded();
        }
      } else {
        throw new Error(response.message || 'Failed to add user to team');
      }
    } catch (error: any) {
      console.error('Error adding existing user:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add user to team';

      if (error?.response?.status === 403 || errorMessage.toLowerCase().includes('forbidden') || errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('You are not authorized to add team members. Please contact a super admin.');
      } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('does not exist')) {
        toast.error('User with this email does not exist. Please create a new member instead.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedUser(null);
    setSearchResults([]);
    setSelectedRole('FREE');
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <UserPlus className="w-4 h-4 mr-2" />
      Add Existing User
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl font-semibold">Add Existing User to Team</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Add an existing user to your team by entering their email address and assigning a role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="user-search" className="text-sm font-medium">Search User *</Label>
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="user-search"
                  type="text"
                  placeholder="Search by name or email (e.g., rajat)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser(null);
                    if (e.target.value.length >= 2) {
                      setShowResults(true);
                    }
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowResults(true);
                    }
                  }}
                  required
                  className="w-full pl-10 pr-10"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                )}
              </div>

              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                    >
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}

              {showResults && searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-sm text-gray-500">
                  No users found matching "{searchQuery}"
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Search for an existing user by name or email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="existing-user-role" className="text-sm font-medium">Role *</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={rolesLoading}
            >
              <SelectTrigger id="existing-user-role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="FREE">Free (Basic Access)</SelectItem>
                {availableRoles.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-t mt-1 pt-2">Custom Roles</div>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                        {role.description && ` - ${role.description}`}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {rolesLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading roles...</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1.5">Note:</p>
                <p className="leading-relaxed">
                  If the user doesn't exist, you'll need to create a new team member instead.
                  The user will be assigned the selected role and gain access based on that role's permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isSubmitting ? 'Adding...' : 'Add to Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddExistingUserModal };
