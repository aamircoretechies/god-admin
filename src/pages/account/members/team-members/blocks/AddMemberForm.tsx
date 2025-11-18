import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  UserPlus, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { createTeamMember } from '@/services/usersApi';
import { toast } from 'sonner';

interface AddMemberFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  custom_role_id?: string;
}

const AddMemberForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'FREE',
    custom_role_id: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AddMemberFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare request data
      const requestData: AddMemberFormData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role
      };

      // Only include custom_role_id if it's provided
      if (formData.custom_role_id && formData.custom_role_id.trim() !== '') {
        requestData.custom_role_id = formData.custom_role_id.trim();
      }

      const response = await createTeamMember(requestData);
      
      if (response.status === 1) {
        toast.success(response.message || 'Member added successfully!');
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          role: 'FREE',
          custom_role_id: undefined
        });
        
        setIsOpen(false);
        
        // Reload the page to refresh the team members list
        // You could also use a callback prop or context to refresh the list
        window.location.reload();
      } else {
        throw new Error(response.message || 'Failed to create team member');
      }
      
    } catch (error: any) {
      console.error('Error adding member:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error adding member. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'FREE',
      custom_role_id: undefined
    });
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          type="button" 
          className="btn btn-sm btn-primary"
          onClick={handleOpenDialog}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogDescription>
            Create a new team member account with admin or moderator role.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pt-4 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: string) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_role_id">Custom Role (Optional)</Label>
            <Select 
              value={formData.custom_role_id || 'none'} 
              onValueChange={(value: string) => {
                const roleId = value === 'none' ? '' : value;
                handleInputChange('custom_role_id', roleId);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select custom role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="40f9bc3d-5636-47e5-8196-54095d49e237">Moderator</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Select a custom role or leave as None</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddMemberForm };
