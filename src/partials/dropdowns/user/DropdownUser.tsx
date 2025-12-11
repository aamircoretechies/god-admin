import { ChangeEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
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
    if (!menuItemRef?.current) return;

    // Remove "show" class from the dropdown root
    menuItemRef.current.classList.remove("show");

    // Submenu open ho to wo bhi close hona chahiye
    const submenus = menuItemRef.current.querySelectorAll(".show");
    submenus.forEach((el: any) => el.classList.remove("show"));
  };

  // window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true, capture: true });


  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [menuItemRef]);



  const buildHeader = () => {
    const userName = currentUser?.fullname || 
                     (currentUser?.first_name && currentUser?.last_name 
                       ? `${currentUser.first_name} ${currentUser.last_name}` 
                       : currentUser?.first_name || 'User');
    const userEmail = currentUser?.email || '';
    const userRole = currentUser?.role || 'USER';
    const userAvatar = currentUser?.profile_picture || currentUser?.pic || '/media/avatars/300-2.png';

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          <img
            className="size-9 rounded-full border-2 border-success"
            src={toAbsoluteUrl(userAvatar)}
            alt={userName}
          />
          <div className="flex flex-col gap-1.5">
            <Link
              // to="/account"
              to="#"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {userName}
            </Link>
            {userEmail && (
              <a
                href={`mailto:${userEmail}`}
                className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
              >
                {userEmail}
              </a>
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
         
          <MenuItem
            toggle="dropdown"
            trigger="hover"
            dropdownProps={{
              placement: isRTL() ? 'left-start' : 'right-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
                  }
                }
              ]
            }}
          >
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
