import { KeenIcon } from '@/components';

import { CardRole } from '@/partials/cards';
import { ReactNode } from 'react';

interface Badge {
  size: string;
  badge: ReactNode;
  fill: string;
  stroke: string;
}

interface IRolesItem {
  badge: Badge;
  title: string;
  subTitle: string;
  description: string;
  team: string;
  path: string;
}
interface IRolesItems extends Array<IRolesItem> {}

const Roles = () => {
  const items: IRolesItems = [
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="setting" className="text-1.5xl text-primary" />,
        fill: 'fill-primary-light',
        stroke: 'stroke-primary-clarity'
      },
      title: 'Admin',
      subTitle: 'Full access',
      description: 'Full system access including user management, content moderation, and system settings.',
      team: '2 people',
      path: '/public-profile/profiles/creator'
    },
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="eye" className="text-1.5xl text-brand" />,
        fill: 'fill-brand-light',
        stroke: 'stroke-brand-clarity'
      },
      title: 'Moderator',
      subTitle: 'Content moderation',
      description: 'Can moderate content, review AI responses, and manage user feedback.',
      team: '5 people',
      path: '/public-profile/profiles/company'
    },
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="people" className="text-1.5xl text-success" />,
        fill: 'fill-success-light',
        stroke: 'stroke-success-clarity'
      },
      title: 'User',
      subTitle: 'Standard access',
      description: 'Basic user access to view content and submit feedback.',
      team: '12,840 people',
      path: '/public-profile/profiles/feeds'
    }
  ];

  const renderItem = (item: IRolesItem, index: number) => {
    return (
      <CardRole
        key={index}
        title={item.title}
        subTitle={item.subTitle}
        description={item.description}
        team={item.team}
        path={item.path}
        badge={item.badge}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </div>
  );
};

export { Roles, type IRolesItem, type IRolesItems };
