import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { toAbsoluteUrl } from '@/utils';
import { getUploadedFileUrl } from '@/utils/Api';
import { ImageInput } from '@/components/image-input';
import type { IImageInputFile } from '@/components/image-input';
import { getAdminProfile, updateAdminProfile, updateAdminProfilePicture } from '@/services/adminApi';
import { toast } from 'sonner';

// Helper to get full URL for profile picture
const getProfilePictureUrl = (path: string | null | undefined): string => {
  if (!path) return ''; // toAbsoluteUrl('/media/avatars/300-2.png');
  // If path starts with /uploads, it's from the backend
  if (path.startsWith('/uploads')) {
    return getUploadedFileUrl(path);
  }
  // Otherwise, treat as local asset
  return toAbsoluteUrl(path);
};

const PersonalInfo = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');
  const [originalFirstName, setOriginalFirstName] = useState('');
  const [originalLastName, setOriginalLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  const [avatar, setAvatar] = useState<IImageInputFile[]>(() => {
    const initialPath = currentUser?.profile_picture || currentUser?.pic;
    return [{ dataURL: getProfilePictureUrl(initialPath) }];
  });
  const [originalAvatar, setOriginalAvatar] = useState<IImageInputFile[]>(() => {
    const initialPath = currentUser?.profile_picture || currentUser?.pic;
    return [{ dataURL: getProfilePictureUrl(initialPath) }];
  });

  const handleFirstNameChange = (value: string) => {
    // Limit to 20 characters
    if (value.length > 20) {
      setFirstNameError('First name must be 20 characters or less');
      return;
    }

    // Allow only one special character
    const specialChars = value.match(/[^a-zA-Z0-9\s]/g) || [];
    if (specialChars.length > 1) {
      toast.error('Only one special character is allowed');
      return;
    }

    setFirstNameValue(value);
    setFirstNameError(null);
    checkForChanges(value, lastNameValue, avatar, isAvatarRemoved);
  };

  const handleLastNameChange = (value: string) => {
    // Limit to 20 characters
    if (value.length > 20) {
      setLastNameError('Last name must be 20 characters or less');
      return;
    }

    // Allow only one special character
    const specialChars = value.match(/[^a-zA-Z0-9\s]/g) || [];
    if (specialChars.length > 1) {
      toast.error('Only one special character is allowed');
      return;
    }

    setLastNameValue(value);
    setLastNameError(null);
    checkForChanges(firstNameValue, value, avatar, isAvatarRemoved);
  };

  const checkForChanges = (firstName: string, lastName: string, currentAvatar: IImageInputFile[], isRemoved: boolean = isAvatarRemoved) => {
    const firstNameChanged = firstName !== originalFirstName;
    const lastNameChanged = lastName !== originalLastName;
    const avatarChanged = JSON.stringify(currentAvatar) !== JSON.stringify(originalAvatar) || isRemoved;
    setHasChanges(firstNameChanged || lastNameChanged || avatarChanged);
  };

  const handleStartEdit = () => {
    setOriginalFirstName(firstNameValue);
    setOriginalLastName(lastNameValue);
    setOriginalAvatar(avatar);
    setIsEditing(true);
    setHasChanges(false);
    setFirstNameError(null);
    setLastNameError(null);
  };

  const handleCancelEdit = () => {
    setFirstNameValue(originalFirstName);
    setLastNameValue(originalLastName);
    setAvatar(originalAvatar);
    setIsAvatarRemoved(false);
    setFirstNameError(null);
    setLastNameError(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleAvatarChange = (selectedAvatar: IImageInputFile[]) => {
    // Only allow changes when in edit mode
    if (!isEditing) return;

    // Check if a file was selected and validate its type and size
    if (selectedAvatar.length > 0 && selectedAvatar[0].file) {
      const file = selectedAvatar[0].file;
      const fileType = file.type;

      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        toast.error('Only JPEG or PNG images are allowed');
        return;
      }

      // 1 MB limit check
      if (file.size > 1024 * 1024) {
        toast.error('Image size must be 1 MB or less to upload.');
        return;
      }
    }

    // Just update the local state - don't upload yet
    setIsAvatarRemoved(false);
    setAvatar(selectedAvatar);
    checkForChanges(firstNameValue, lastNameValue, selectedAvatar, false);
  };

  const loadProfile = async () => {
    try {
      const response = await getAdminProfile();
      if (response.status === 1 && response.data) {
        // Update name values
        const firstName = response.data.first_name || '';
        const lastName = response.data.last_name || '';

        setFirstNameValue(firstName);
        setOriginalFirstName(firstName);
        setLastNameValue(lastName);
        setOriginalLastName(lastName);

        // Update avatar with latest profile picture
        const userAvatar = response.data.profile_picture;
        const avatarUrl = getProfilePictureUrl(userAvatar);
        setAvatar([{ dataURL: avatarUrl }]);
        setOriginalAvatar([{ dataURL: avatarUrl }]);
        setIsAvatarRemoved(false);

        // Update auth context with new profile data
        if (setCurrentUser) {
          const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || response.data.email || 'User';
          setCurrentUser({
            ...currentUser,
            ...response.data,
            fullname: fullName
          } as any);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminProfile();
        if (response.status === 1 && response.data) {
          const firstName = response.data.first_name || '';
          const lastName = response.data.last_name || '';

          setFirstNameValue(firstName);
          setOriginalFirstName(firstName);
          setLastNameValue(lastName);
          setOriginalLastName(lastName);

          // Update avatar with latest profile picture
          const userAvatar = response.data.profile_picture;
          const avatarUrl = getProfilePictureUrl(userAvatar);
          setAvatar([{ dataURL: avatarUrl }]);
          setOriginalAvatar([{ dataURL: avatarUrl }]);
          setIsAvatarRemoved(false);

          // Update auth context with new profile data
          if (setCurrentUser) {
            const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || response.data.email || 'User';
            setCurrentUser({
              ...currentUser,
              ...response.data,
              profile_picture: response.data.profile_picture,
              fullname: fullName
            } as any);
          }
        } else {
          // If API fails, use currentUser as fallback
          const firstName = currentUser?.first_name || '';
          const lastName = currentUser?.last_name || '';

          setFirstNameValue(firstName);
          setOriginalFirstName(firstName);
          setLastNameValue(lastName);
          setOriginalLastName(lastName);

          const userAvatar = currentUser?.profile_picture || currentUser?.pic;
          const avatarUrl = getProfilePictureUrl(userAvatar);
          setAvatar([{ dataURL: avatarUrl }]);
          setOriginalAvatar([{ dataURL: avatarUrl }]);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to currentUser if API fails
        const firstName = currentUser?.first_name || '';
        const lastName = currentUser?.last_name || '';

        setFirstNameValue(firstName);
        setOriginalFirstName(firstName);
        setLastNameValue(lastName);
        setOriginalLastName(lastName);

        const userAvatar = currentUser?.profile_picture || currentUser?.pic;
        const avatarUrl = getProfilePictureUrl(userAvatar);
        setAvatar([{ dataURL: avatarUrl }]);
        setOriginalAvatar([{ dataURL: avatarUrl }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    // Validate before saving
    if (firstNameValue.length > 20) {
      setFirstNameError('First name must be 20 characters or less');
      toast.error('Please fix validation errors before saving');
      return;
    }

    if (lastNameValue.length > 20) {
      setLastNameError('Last name must be 20 characters or less');
      toast.error('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare update data
      const updateData: {
        first_name?: string;
        last_name?: string;
      } = {
        first_name: firstNameValue,
        last_name: lastNameValue
      };

      // Update profile picture if changed or explicitly removed
      let profilePictureUpdated = false;
      let pictureUpdateMessage = '';
      if ((avatar.length > 0 && avatar[0].file) || isAvatarRemoved) {
        try {
          const pictureResponse = await updateAdminProfilePicture(avatar[0]?.file || null);
          if (pictureResponse.status === 1 && pictureResponse.data) {
            profilePictureUpdated = true;
            pictureUpdateMessage = pictureResponse.message;
            setIsAvatarRemoved(false);
            // Update avatar URL with server response
            if (pictureResponse.data.user.profile_picture) {
              const newAvatarUrl = getProfilePictureUrl(pictureResponse.data.user.profile_picture);
              setAvatar([{ dataURL: newAvatarUrl }]);
              // Update auth context immediately so navbar updates
              if (setCurrentUser) {
                setCurrentUser({
                  ...currentUser,
                  profile_picture: pictureResponse.data.user.profile_picture
                } as any);
              }
            } else {
              // Image was removed, result is null
              setAvatar([]);
              if (setCurrentUser) {
                setCurrentUser({
                  ...currentUser,
                  profile_picture: null
                } as any);
              }
            }
          } else {
            throw new Error(pictureResponse.message || 'Failed to update profile picture');
          }
        } catch (error: any) {
          console.error('Error updating profile picture:', error);
          if (error?.response?.status === 413) {
            toast.error('Image size must be 1 MB or less to upload.');
          } else {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to update profile picture');
          }
          setIsSaving(false);
          return;
        }
      }

      // Update profile data (name, etc.) if there are changes
      if (firstNameValue !== originalFirstName || lastNameValue !== originalLastName) {
        const response = await updateAdminProfile(updateData);

        if (response.status === 1) {
          // Success - update local state
          setOriginalFirstName(firstNameValue);
          setOriginalLastName(lastNameValue);
          setOriginalAvatar(avatar);
          setHasChanges(false);
          setIsEditing(false);
          setFirstNameError(null);
          setLastNameError(null);

          // Show success message
          if (profilePictureUpdated) {
            toast.success(pictureUpdateMessage || response.message || 'Profile and picture updated successfully');
          } else {
            toast.success(response.message || 'Profile updated successfully');
          }

          // Refresh profile data
          await loadProfile();
        } else {
          toast.error(response.message || 'Failed to update profile');
          setIsSaving(false);
          return;
        }
      } else if (profilePictureUpdated) {
        // Only picture was updated
        setOriginalAvatar(avatar);
        setHasChanges(false);
        toast.success(pictureUpdateMessage || 'Profile picture updated successfully');
        await loadProfile();
      }

      setIsSaving(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update profile');
      setIsSaving(false);
    }
  };

  const userName = firstNameValue
    ? (lastNameValue ? `${firstNameValue} ${lastNameValue}` : firstNameValue)
    : (currentUser?.fullname || 'User');
  const userRole = currentUser?.role || 'USER';
  const userStatus = 'ACTIVE'; // This would come from user data or be derived

  if (isLoading) {
    return (
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">Personal Info</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="card-title">Personal Info</h3>
          {!isEditing && (
            <button
              className="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={handleStartEdit}
              disabled={isSaving}
              title="Edit profile"
            >
              <KeenIcon icon="notepad-edit" />
            </button>
          )}
        </div>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray-700 font-normal min-w-32 text-2sm">
                100x100px JPEG, PNG Image
              </td>
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <ImageInput value={avatar} onChange={handleAvatarChange}>
                    {({ onImageUpload }) => (
                      <div
                        className={`image-input size-[60px] ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={isEditing ? onImageUpload : undefined}
                      >
                        {isEditing && (
                          <div
                            className="btn btn-icon btn-icon-xs btn-light shadow-default absolute z-1 size-5 -top-0.5 -end-0.5 rounded-full"
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Remove avatar - set to empty
                              setAvatar([]);
                              setIsAvatarRemoved(true);
                              checkForChanges(firstNameValue, lastNameValue, [], true);
                            }}
                          >
                            <KeenIcon icon="cross" />
                          </div>
                        )}
                        <span className="tooltip" id="image_input_tooltip">
                          Click to remove or revert
                        </span>
                        <div
                          className="image-input-placeholder rounded-full border-2 border-success image-input-empty:border-gray-300"
                          style={{ backgroundImage: (avatar.length === 0 || !avatar[0].dataURL) ? 'none' : `url(${toAbsoluteUrl('/media/avatars/blank.png')})` }}
                        >
                          {avatar.length > 0 && <img src={avatar[0].dataURL} alt="avatar" className="w-full h-full rounded-full object-cover" />}
                          <div className="flex items-center justify-center cursor-pointer h-5 left-0 right-0 bottom-0 bg-dark-clarity absolute">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="12"
                              viewBox="0 0 14 12"
                              className="fill-light opacity-80"
                            >
                              <path
                                d="M11.6665 2.64585H11.2232C11.0873 2.64749 10.9538 2.61053 10.8382 2.53928C10.7225 2.46803 10.6295 2.36541 10.5698 2.24335L10.0448 1.19918C9.91266 0.931853 9.70808 0.707007 9.45438 0.550249C9.20068 0.393491 8.90806 0.311121 8.60984 0.312517H5.38984C5.09162 0.311121 4.799 0.393491 4.5453 0.550249C4.2916 0.707007 4.08701 0.931853 3.95484 1.19918L3.42984 2.24335C3.37021 2.36541 3.27716 2.46803 3.1615 2.53928C3.04584 2.61053 2.91234 2.64749 2.7765 2.64585H2.33317C1.90772 2.64585 1.49969 2.81486 1.19885 3.1157C0.898014 3.41654 0.729004 3.82457 0.729004 4.25002V10.0834C0.729004 10.5088 0.898014 10.9168 1.19885 11.2177C1.49969 11.5185 1.90772 11.6875 2.33317 11.6875H11.6665C12.092 11.6875 12.5 11.5185 12.8008 11.2177C13.1017 10.9168 13.2707 10.5088 13.2707 10.0834V4.25002C13.2707 3.82457 13.1017 3.41654 12.8008 3.1157C12.5 2.81486 12.092 2.64585 11.6665 2.64585ZM6.99984 9.64585C6.39413 9.64585 5.80203 9.46624 5.2984 9.12973C4.79478 8.79321 4.40225 8.31492 4.17046 7.75532C3.93866 7.19572 3.87802 6.57995 3.99618 5.98589C4.11435 5.39182 4.40602 4.84613 4.83432 4.41784C5.26262 3.98954 5.80831 3.69786 6.40237 3.5797C6.99644 3.46153 7.61221 3.52218 8.1718 3.75397C8.7314 3.98576 9.2097 4.37829 9.54621 4.88192C9.88272 5.38554 10.0623 5.97765 10.0623 6.58335C10.0608 7.3951 9.73765 8.17317 9.16365 8.74716C8.58965 9.32116 7.81159 9.64431 6.99984 9.64585Z"
                                fill=""
                              />
                              <path
                                d="M7 8.77087C8.20812 8.77087 9.1875 7.7915 9.1875 6.58337C9.1875 5.37525 8.20812 4.39587 7 4.39587C5.79188 4.39587 4.8125 5.37525 4.8125 6.58337C4.8125 7.7915 5.79188 8.77087 7 8.77087Z"
                                fill=""
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </ImageInput>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">First Name</td>
              <td className="py-2 text-gray-800 font-normal text-sm">
                {isEditing ? (
                  <div className="w-full max-w-xs">
                    <input
                      type="text"
                      value={firstNameValue}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      className={`input input-sm w-full ${firstNameError ? 'border-red-500' : ''}`}
                      autoFocus
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                    />
                    {firstNameError && (
                      <p className="text-xs text-red-500 mt-1">{firstNameError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{firstNameValue.length}/20 characters</p>
                  </div>
                ) : (
                  (() => {
                    const isOnlySpecial = !/[a-zA-Z0-9]/.test(firstNameValue);
                    const limit = isOnlySpecial ? 12 : 15;
                    return [...firstNameValue].length > limit
                      ? `${[...firstNameValue].slice(0, limit).join('')}...`
                      : firstNameValue || '-';
                  })()
                )}
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Last Name</td>
              <td className="py-2 text-gray-800 font-normal text-sm">
                {isEditing ? (
                  <div className="w-full max-w-xs">
                    <input
                      type="text"
                      value={lastNameValue}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                      className={`input input-sm w-full ${lastNameError ? 'border-red-500' : ''}`}
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                    />
                    {lastNameError && (
                      <p className="text-xs text-red-500 mt-1">{lastNameError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{lastNameValue.length}/20 characters</p>
                  </div>
                ) : (
                  (() => {
                    const isOnlySpecial = !/[a-zA-Z0-9]/.test(lastNameValue);
                    const limit = isOnlySpecial ? 12 : 15;
                    return [...lastNameValue].length > limit
                      ? `${[...lastNameValue].slice(0, limit).join('')}...`
                      : lastNameValue || '-';
                  })()
                )}
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Role</td>
              <td className="py-2 text-gray-800 font-normal">
                <span className="badge badge-sm badge-outline badge-primary">{userRole}</span>
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Status</td>
              <td className="py-2 text-gray-800 font-normal">
                <span className="badge badge-sm badge-outline badge-success">{userStatus}</span>
              </td>
              <td className="py-2 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="card-footer flex justify-end gap-2">
          <button
            className="btn btn-sm btn-light"
            onClick={handleCancelEdit}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            disabled={isSaving || (!hasChanges && JSON.stringify(avatar) === JSON.stringify(originalAvatar) && !isAvatarRemoved)}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export { PersonalInfo };
