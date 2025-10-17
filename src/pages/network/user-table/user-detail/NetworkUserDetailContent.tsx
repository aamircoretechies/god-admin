import { UserBasicInfo } from './blocks/UserBasicInfo';
import { UserOnboardingPreferences } from './blocks/UserOnboardingPreferences';
import { UserActivityBehavior } from './blocks/UserActivityBehavior';
import { UserRoleAccessControl } from './blocks/UserRoleAccessControl';
import { UserTechnicalDeviceInfo } from './blocks/UserTechnicalDeviceInfo';

const NetworkUserDetailContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <UserBasicInfo />
      <UserOnboardingPreferences />
      <UserActivityBehavior />
      <UserRoleAccessControl />
      <UserTechnicalDeviceInfo />
    </div>
  );
};

export { NetworkUserDetailContent };

