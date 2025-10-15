import { Fragment } from 'react';
import { Users, Eye, UserPlus, Mic } from 'lucide-react';
import { toAbsoluteUrl } from '@/utils/Assets';

interface IChannelStatsItem {
  icon: JSX.Element;
  value: string;
  label: string;
  path?: string;
}
interface IChannelStatsItems extends Array<IChannelStatsItem> {}

const ChannelStats = () => {
  const items: IChannelStatsItems = [
      { icon: <Users className="w-6 h-6 text-olive-500" />, value: '9.3k', label: 'Total Users' },
    { icon: <Eye className="w-6 h-6 text-clay-500" />, value: '24k', label: 'Lessons Views' },
    { icon: <UserPlus className="w-6 h-6 text-forest-500" />, value: '608', label: 'New Subscribers' },
    { icon: <Mic className="w-6 h-6 text-forest-500" />, value: '2.5k', label: 'Stream Audience' }
  ];


  const renderItem = (item: IChannelStatsItem, index: number) => {
    return (
      <div
        key={index}
        className="card flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
          {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-transparent">
          {item.icon}
        </div>

        <div className="flex flex-col gap-1 pb-4 px-5">
          <span className="text-3xl font-semibold text-gray-900">{item.value}</span>
          <span className="text-2sm font-normal text-gray-700">{item.label}</span>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
