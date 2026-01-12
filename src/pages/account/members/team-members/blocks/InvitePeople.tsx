import { useState, useRef } from 'react';
import { KeenIcon } from '@/components';
import { toast } from 'sonner';
import { importTeamMembers, type ImportTeamMember } from '@/services/usersApi';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const InvitePeople = () => {
  const [emailInput, setEmailInput] = useState('jason@studio.io');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportMembers = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Parse CSV file
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        return;
      }

      // Parse CSV (simple parser - assumes comma-separated)
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const members: ImportTeamMember[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const member: ImportTeamMember = {
          email: '',
          role: 'FREE'
        };

        headers.forEach((header, index) => {
          const value = values[index] || '';
          switch (header) {
            case 'email':
              member.email = value;
              break;
            case 'password':
              member.password = value;
              break;
            case 'first_name':
            case 'firstname':
              member.first_name = value;
              break;
            case 'last_name':
            case 'lastname':
              member.last_name = value;
              break;
            case 'role':
              member.role = (value.toUpperCase() as 'FREE' | 'PREMIUM' | 'ADMIN') || 'FREE';
              break;
          }
        });

        if (member.email) {
          members.push(member);
        }
      }

      if (members.length === 0) {
        toast.error('No valid members found in the file');
        return;
      }

      // Call import API
      const response = await importTeamMembers({ members });

      if (response.status === 1 && response.data) {
        const { success, failed, skipped } = response.data;
        const successCount = success.length;
        const failedCount = failed.length;
        const skippedCount = skipped.length;

        let message = `Import completed: ${successCount} success`;
        if (failedCount > 0) message += `, ${failedCount} failed`;
        if (skippedCount > 0) message += `, ${skippedCount} skipped`;

        toast.success(message);

        // Show details if there are failures or skipped items
        if (failedCount > 0 || skippedCount > 0) {
          console.log('Import details:', { success, failed, skipped });
        }
      } else {
        toast.error(response.message || 'Failed to import team members');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to import file';
      toast.error(errorMessage);
    }
  };

  return (
    <form className="card">
      <div className="card-header">
        <h3 className="card-title">Invite People</h3>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
      />
      <div className="card-body grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-32">Email</label>
          <input
            className="input"
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>

        <div className="flex items-baseline flex-wrap gap-2.5">
          <label className="form-label max-w-32">Role</label>
          <div className="flex flex-col items-start grow gap-5">
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Member</SelectItem>
                <SelectItem value="2">Editor</SelectItem>
                <SelectItem value="3">Designer</SelectItem>
                <SelectItem value="4">Admin</SelectItem>
              </SelectContent>
            </Select>

            <a href="#" className="btn btn-sm btn-light btn-outline">
              <KeenIcon icon="plus-squared" />
              Add more
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={handleImportMembers}
            className="btn btn-sm btn-light btn-outline"
          >
            <KeenIcon icon="file-up" />
            Import Members
          </button>
        </div>
      </div>
      <div className="card-footer justify-center">
        <a href="#" className="btn btn-sm btn-primary">
          Invite People
        </a>
      </div>
    </form>
  );
};

export { InvitePeople };
