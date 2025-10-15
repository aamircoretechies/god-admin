import { KeenIcon } from '@/components';

import { CardAddNew, CardRole } from '@/partials/cards';
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
      title: 'Administrator',
      subTitle: 'Default role',
      description: 'Manages system settings and user access, ensures system stability.',
      team: '1 person',
      path: '/public-profile/profiles/creator'
    },
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="eye" className="text-1.5xl text-brand" />,
        fill: 'fill-brand-light',
        stroke: 'stroke-brand-clarity'
      },
      title: 'Viewer',
      subTitle: 'Default role',
      description: "Can view data but doesn't have editing privileges.",
      team: '32 people',
      path: '/public-profile/profiles/company'
    },
   
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="delivery-24" className="text-1.5xl text-danger" />,
        fill: 'fill-danger-light',
        stroke: 'stroke-danger-clarity'
      },
      title: 'Customer Support',
      subTitle: 'Default role',
      description: 'Provides assistance and resolves customer inquiries and issues.',
      team: '32 people',
      path: '/public-profile/profiles/blogger'
    },
 
    
    {
      badge: {
        size: 'size-[44px]',
        badge: <KeenIcon icon="people" className="text-1.5xl text-success" />,
        fill: 'fill-success-light',
        stroke: 'stroke-success-clarity'
      },
      title: 'Sales Manager',
      subTitle: 'Default role',
      description: 'Manages sales team and drives revenue growth.',
      team: '1 person',
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

      <CardAddNew
        path="/public-profile/works"
        size="size-[60px]"
        iconSize="text-2xl"
        title="Add New Role"
        subTitle="Ignite Professional Adventures"
      />
    </div>
  );
};

export { Roles, type IRolesItem, type IRolesItems };
