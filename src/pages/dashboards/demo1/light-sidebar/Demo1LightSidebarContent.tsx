import {
  ChannelStats,
  EntryCallout,
  TeamMeeting,
  Teams
} from './blocks';
import { NetworkSaasUsersContent } from '@/pages/network/user-table/saas-users';
import { BibleKPICards } from '@/partials/cards/BibleKPICards';

const Demo1LightSidebarContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Bible-specific KPI Cards */}
      <BibleKPICards />

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>

        <div className="lg:col-span-2">
          <NetworkSaasUsersContent />
        </div>
      </div>

      
    </div>
  );
};

export { Demo1LightSidebarContent };
