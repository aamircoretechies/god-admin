import { UserBasicInfo } from './blocks/UserBasicInfo';
import { UserOnboardingPreferences } from './blocks/UserOnboardingPreferences';
import { UserActivityBehavior } from './blocks/UserActivityBehavior';
import { UserRoleAccessControl } from './blocks/UserRoleAccessControl';
import { UserSubscriptionMonetization } from './blocks/UserSubscriptionMonetization';
import { UserTechnicalDeviceInfo } from './blocks/UserTechnicalDeviceInfo';
import { UserAnalyticsInsights } from './blocks/UserAnalyticsInsights';

const NetworkUserDetailContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <UserBasicInfo />
      <UserOnboardingPreferences />
      <UserActivityBehavior />
      <UserRoleAccessControl />
      <UserSubscriptionMonetization />
      <UserTechnicalDeviceInfo />
      <UserAnalyticsInsights />
    </div>
  );
};

export { NetworkUserDetailContent };

