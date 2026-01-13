// import { RecentUploads } from '@/pages/public-profile/profiles/default';
import {
  PersonalInfo,
  BasicSettings,
  // CalendarAccounts,
  // CommunityBadges,
  // Connections,
  // StartNow,
  // Work
} from './blocks';

const AccountUserProfileContent = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        <PersonalInfo />


        {/*
        <div className="grid gap-5 lg:gap-7.5">
          <BasicSettings title="Basic Settings" />
          <Work />
          <CommunityBadges />
        </div>
        */}
      </div>
      <div className="col-span-1">
        <BasicSettings title="Basic Settings" />

        {/*
        <div className="grid gap-5 lg:gap-7.5">
          <StartNow />
          <CalendarAccounts />
          <Connections url="#" />
          <RecentUploads title="My Files" />
        </div>
        */}
      </div>
    </div>
  );
};

export { AccountUserProfileContent };
