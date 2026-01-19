import { ChangeEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { getUploadedFileUrl } from '@/utils/Api';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { DefaultTooltip, KeenIcon } from '@/components';
import {
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuSeparator,
  MenuArrow,
  MenuIcon
} from '@/components/menu';
import { useEffect } from 'react';

interface IDropdownUserProps {
  menuItemRef: any;
}

const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
  const { settings, storeSettings } = useSettings();
  const { logout, currentUser } = useAuthContext();
  const { isRTL } = useLanguage();

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      themeMode: newThemeMode
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (menuItemRef.current && menuItemRef.current.isOpen()) {
        menuItemRef.current.hide();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuItemRef]);

  const buildHeader = () => {
    const userName =
      currentUser?.fullname ||
      (currentUser?.first_name && currentUser?.last_name
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : currentUser?.first_name || 'User');
    const userEmail = currentUser?.email || '';
    const userRole = currentUser?.role || 'USER';
    const userAvatarPath =
      currentUser?.profile_picture || currentUser?.pic || '';

    const userAvatar = userAvatarPath
      ? (userAvatarPath.startsWith('/uploads')
        ? getUploadedFileUrl(userAvatarPath)
        : toAbsoluteUrl(userAvatarPath))
      : '';

    const isOnlySpecialCharsName = !/[a-zA-Z0-9]/.test(userName);
    const nameLimit = isOnlySpecialCharsName ? 12 : 15;
    const displayName =
      [...userName].length > nameLimit ? `${[...userName].slice(0, nameLimit).join('')}...` : userName;

    const displayEmail =
      [...userEmail].length > 25 ? `${[...userEmail].slice(0, 25).join('')}...` : userEmail;

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <img
              className="size-9 rounded-full border-2 border-success"
              src={userAvatar}
              alt={userName}
            />
          ) : (
            <div className="size-9 rounded-full border-2 border-success bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Link
              to="/account/home/user-profile"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {displayName}
            </Link>
            {userEmail && (
              // <a
              //   href={`mailto:${userEmail}`}
              //   className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
              // >
              //   {displayEmail}
              // </a>
              <span className="text-xs text-gray-600 font-medium leading-none cursor-default">
                {displayEmail}
              </span>
            )}
          </div>
        </div>
        {/*  <span className="badge badge-xs badge-primary badge-outline">
          {userRole}
        </span> */}
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>My Profile</MenuTitle>
              {/*  <MenuLink>
              <MenuIcon>
                <KeenIcon icon="setting-2" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_ACCOUNT" />
              </MenuTitle>
              <MenuArrow>
                <KeenIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
              </MenuArrow>
            </MenuLink>
            <MenuSub className="menu-default light:border-gray-300 w-[200px]] md:w-[220px]">
             
              <MenuItem>
                <MenuLink path="/account">
                  <MenuIcon>
                    <KeenIcon icon="some-files" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MY_PROFILE" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
             
              <MenuItem>
                <MenuLink path="/account">
                  <MenuIcon>
                    <KeenIcon icon="medal-star" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.SECURITY" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
            
             
              <MenuSeparator />
              <MenuItem>
                <MenuLink path="/security">
                  <MenuIcon>
                    <KeenIcon icon="shield-tick" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.NOTIFICATIONS" />
                  </MenuTitle>
                  <label className="switch switch-sm">
                    <input name="check" type="checkbox" checked onChange={() => {}} value="1" />
                  </label>
                </MenuLink>
              </MenuItem>
            </MenuSub> */}
            </MenuLink>
          </MenuItem>

          <DropdownUserLanguages menuItemRef={menuItemRef} />
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a onClick={logout} className="btn btn-sm btn-light justify-center">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
