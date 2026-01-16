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
import { KeenIcon } from '@/components';
import { Alert } from '@/components/alert';
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
    setSearchQuery(user.email);
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
    <Button variant="outline" size="sm" className="gap-2">
      <KeenIcon icon="user-tick" />
      Add Existing User
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
              <KeenIcon icon="user-tick" className="text-2xl" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Add Existing User to Team</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1 font-medium">
                Search and assign roles to existing members.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-8 py-8 space-y-7">
            <div className="space-y-2.5">
              <Label htmlFor="user-search" className="text-sm font-semibold text-gray-800">Search User *</Label>
              <div className="relative" ref={searchRef}>
                <div className="relative group">
                  <KeenIcon
                    icon="magnifier"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-primary"
                  />
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
                    className="w-full pl-11 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg"
                  />
                  {searching && (
                    <KeenIcon
                      icon="spinner"
                      className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-primary text-lg animate-spin"
                    />
                  )}
                </div>

                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-h-60 overflow-auto p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className="w-full text-left px-3 py-2.5 hover:bg-primary-light rounded-lg group transition-all flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary-clarity group-hover:text-primary transition-all shadow-sm">
                          <KeenIcon icon="user" className="text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate font-medium">{user.email}</div>
                        </div>
                        <KeenIcon icon="right" className="text-gray-300 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-sm" />
                      </button>
                    ))}
                  </div>
                )}

                {showResults && searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-5 text-sm text-gray-500 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="font-medium">No users found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5 px-0.5">
                <KeenIcon icon="information" className="text-xs" />
                Search for an existing user by name or email address
              </p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="existing-user-role" className="text-sm font-semibold text-gray-800">Role *</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={rolesLoading}
              >
                <SelectTrigger id="existing-user-role" className="w-full h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {/* <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="FREE">Free (Basic Access)</SelectItem> */}
                  {availableRoles.length > 0 && (
                    <>
                      <div className="px-2 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-t mt-1.5 pt-3">Custom Roles</div>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                          {role.description && <span className="text-gray-400 font-normal"> - {role.description}</span>}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {rolesLoading && (
                <p className="text-[11px] text-primary mt-1 animate-pulse px-0.5">Loading roles...</p>
              )}
            </div>

            <Alert variant="primary" icon="information-2" className="mt-2 border-0 bg-primary/5 rounded-xl px-4 py-4">
              <div className="flex flex-col gap-1.5">
                <p className="font-bold text-primary text-xs uppercase tracking-wider">Note:</p>
                <p className="leading-relaxed text-[13px] text-gray-600 font-medium">
                  If the user doesn't exist, you'll need to create a new team member.
                  The user will be assigned the selected role and permissions.
                </p>
              </div>
            </Alert>
          </div>

          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="min-w-[100px] h-11 font-semibold rounded-lg hover:bg-white transition-all shadow-sm active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 min-w-[140px] h-11 font-bold rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <KeenIcon icon="spinner" className="animate-spin text-lg" />
                  <span>Adding...</span>
                </div>
              ) : (
                'Add to Team'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddExistingUserModal };
