import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuthContext } from '@/auth';
import { API_URL } from '@/utils/Api';

const ChangePassword = () => {
  const { auth } = useAuthContext();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    // Validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      setSaving(false);
      return;
    }

    if (!formData.newPassword) {
      setError('New password is required');
      setSaving(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setSaving(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      setSaving(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      setSaving(false);
      return;
    }

    try {
      // Use the API_URL utility to construct the correct endpoint
      const apiUrl = `${API_URL}/admin/auth/change-password`;

      const response = await axios.put(
        apiUrl,
        {
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status === 1) {
        toast.success(response.data.message || 'Password changed successfully');
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response.data?.message || 'Failed to change password');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      
      // Check if it's a password-related error (404/401/403 with "Route not found" or similar)
      const statusCode = err?.response?.status;
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error || '';
      const isPasswordError = 
        (statusCode === 404 || statusCode === 401 || statusCode === 403) &&
        (backendMessage.toLowerCase().includes('route not found') ||
         backendMessage.toLowerCase().includes('not found') ||
         backendMessage.toLowerCase().includes('unauthorized') ||
         backendMessage.toLowerCase().includes('forbidden'));
      
      const errorMessage = isPasswordError
        ? 'Current password is incorrect'
        : err?.response?.data?.message ||
          err?.message ||
          'Failed to change password. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="change_password">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                required
                className="h-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                required
                minLength={8}
                className="h-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                minLength={8}
                className="h-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-200">
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[140px] h-10 bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { ChangePassword };
