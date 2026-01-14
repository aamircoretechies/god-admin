import React, { useState, useEffect } from 'react';
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
import { UserPlus, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchRoles, type Role } from '@/services/rolesApi';
import { getAvailableRoles, createTeamMember } from '@/services/usersApi';

interface AddExistingUserModalProps {
  trigger?: React.ReactNode;
  onMemberAdded?: () => void;
}

const AddExistingUserModal: React.FC<AddExistingUserModalProps> = ({ trigger, onMemberAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('FREE');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // For existing users, we just need to assign a role
      // The backend should handle finding the user and assigning the role
      const response = await createTeamMember({
        email: email.trim(),
        role: selectedRole as 'FREE' | 'PREMIUM' | 'ADMIN',
        custom_role_id: selectedRole !== 'ADMIN' && selectedRole !== 'FREE' && selectedRole !== 'PREMIUM' 
          ? selectedRole 
          : undefined
      });

      if (response.status === 1) {
        toast.success('User added to team successfully');
        setEmail('');
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
    setEmail('');
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
            <Label htmlFor="user-email" className="text-sm font-medium">User Email *</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the email address of an existing user account
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
