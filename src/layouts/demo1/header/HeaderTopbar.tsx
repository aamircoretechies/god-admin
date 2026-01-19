import { useRef, useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { getUploadedFileUrl } from '@/utils/Api';
import { useAuthContext } from '@/auth';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { useLanguage } from '@/i18n';

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();
  const itemChatRef = useRef<any>(null);
  const itemAppsRef = useRef<any>(null);
  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);

  // Get user avatar URL
  const userAvatarPath = currentUser?.profile_picture || currentUser?.pic || '';
  const userAvatar = userAvatarPath
    ? (userAvatarPath.startsWith('/uploads')
      ? getUploadedFileUrl(userAvatarPath)
      : toAbsoluteUrl(userAvatarPath))
    : '';

  const userName = currentUser?.fullname ||
    (currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : currentUser?.first_name || 'User');

  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3.5  ml-auto">
      {/* <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button> */}
      {/* <ModalSearch open={searchModalOpen} onOpenChange={handleClose} /> */}

      {/* <Menu>
        <MenuItem
          ref={itemChatRef}
          onShow={handleShow}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-170, 10] : [170, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({ menuTtemRef: itemChatRef })}
        </MenuItem>
      </Menu> */}

      {/* <Menu>
        <MenuItem
          ref={itemAppsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-10, 10] : [10, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu> */}

      {/* Notification Tab - Commented out
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
        </MenuItem>
      </Menu>
      */}

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            {userAvatar ? (
              <img
                className="size-9 rounded-full border-2 border-success shrink-0"
                src={userAvatar}
                alt={userName}
              />
            ) : (
              <div className="size-9 rounded-full border-2 border-success bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
