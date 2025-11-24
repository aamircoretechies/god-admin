// All imports commented out since menu is hidden
// import { MenuSub } from '@/components';

interface DropdownCard1Props {
  teamMemberId?: string;
}

const DropdownCard1 = (_props: DropdownCard1Props = {}) => {
  // Return null to completely hide the menu - all options are commented out
  return null;

  /* All menu options are commented out - not visible in UI
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem disabled>
        <MenuLink path="#">
          <MenuIcon>
            <KeenIcon icon="cloud-change" />
          </MenuIcon>
          <MenuTitle>Activity</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem disabled>
        <MenuLink path="#">
          <MenuIcon>
            <KeenIcon icon="share" />
          </MenuIcon>
          <MenuTitle>Share</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem
        disabled
        toggle="dropdown"
        trigger="hover"
        dropdownProps={{
          placement: isRTL() ? 'left-start' : 'right-start',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: isRTL() ? [15, 0] : [-15, 0] // [skid, distance]
              }
            }
          ]
        }}
      >
        <MenuLink>
          <MenuIcon>
            <KeenIcon icon="notification-status" />
          </MenuIcon>
          <MenuTitle>Notifications</MenuTitle>
          <MenuArrow>
            <KeenIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
          </MenuArrow>
        </MenuLink>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
          <MenuItem disabled>
            <MenuLink path="#">
              <MenuIcon>
                <KeenIcon icon="sms" />
              </MenuIcon>
              <MenuTitle>Email</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem disabled>
            <MenuLink path="#">
              <MenuIcon>
                <KeenIcon icon="message-notify" />
              </MenuIcon>
              <MenuTitle>SMS</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem disabled>
            <MenuLink path="#">
              <MenuIcon>
                <KeenIcon icon="pencil" />
              </MenuIcon>
              <MenuTitle>Push</MenuTitle>
            </MenuLink>
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem disabled>
        <MenuLink path="#">
          <MenuIcon>
            <KeenIcon icon="dislike" />
          </MenuIcon>
          <MenuTitle>Report</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuSeparator />
      <MenuItem disabled>
        <MenuLink path="#">
          <MenuIcon>
            <KeenIcon icon="setting-3" />
          </MenuIcon>
          <MenuTitle>Settings</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
  */
};

export { DropdownCard1 };
