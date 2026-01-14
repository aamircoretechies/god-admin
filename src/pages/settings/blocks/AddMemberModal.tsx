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
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { createTeamMember, getAvailableRoles, type Role as APIRole } from '@/services/usersApi';
import { fetchRoles, type Role } from '@/services/rolesApi';
import { toast } from 'sonner';

interface AddMemberFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string; // Changed to string to support custom role IDs
  customRoleId?: string;
}

interface AddMemberModalProps {
  trigger?: React.ReactNode;
  onMemberAdded?: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ trigger, onMemberAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'FREE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await fetchRoles();
        if (response.status === 1 && response.data) {
          setAvailableRoles(response.data);
        } else {
          toast.error(response.message || 'Failed to load roles');
        }
      } catch (error: any) {
        console.error('Error loading roles:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load roles');
      } finally {
        setRolesLoading(false);
      }
    };
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof AddMemberFormData, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value
      };
      // If a custom role is selected, set customRoleId
      if (field === 'role' && value !== 'ADMIN' && value !== 'FREE' && value !== 'PREMIUM') {
        updated.customRoleId = value;
        updated.role = 'FREE'; // Base role should be FREE for custom roles
      } else if (field === 'role' && (value === 'ADMIN' || value === 'FREE' || value === 'PREMIUM')) {
        updated.customRoleId = undefined;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createTeamMember({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role as 'FREE' | 'PREMIUM' | 'ADMIN',
        custom_role_id: formData.customRoleId
      });

      if (response.status === 1) {
        toast.success('Team member added successfully');
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'FREE'
        });

        setIsOpen(false);
        
        // Call callback to refresh members list
        if (onMemberAdded) {
          onMemberAdded();
        }
      } else {
        throw new Error(response.message || 'Failed to add team member');
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add team member';
      
      if (error?.response?.status === 403 || errorMessage.toLowerCase().includes('forbidden') || errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('You are not authorized to add team members. Please contact a super admin.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'FREE'
    });
  };

  const defaultTrigger = (
    <Button>
      <UserPlus className="w-4 h-4 mr-2" />
      Add Member
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl font-semibold">Add New Member</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Create a new member account with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
            <Select
              value={formData.customRoleId || formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={rolesLoading}
            >
              <SelectTrigger className="w-full">
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
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddMemberModal };
