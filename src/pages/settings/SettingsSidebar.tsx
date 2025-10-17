import { IScrollspyMenuItems, ScrollspyMenu } from '@/partials/menu';

const SettingsSidebar = () => {
  const items: IScrollspyMenuItems = [
    {
      title: 'General Settings',
      target: 'general_settings',
      active: true
    },
    {
      title: 'API Configuration',
      children: [
        {
          title: 'API Keys Management',
          target: 'system_api_config',
          active: false
        }
      ]
    },
    {
      title: 'Cache & Offline',
      children: [
        {
          title: 'Cache Control',
          target: 'cache_offline_control'
        }
      ]
    },
    {
      title: 'Notifications',
      children: [
        {
          title: 'Email Notifications',
          target: 'notifications_email'
        }
      ]
    }
  ];

  return <ScrollspyMenu items={items} />;
};

export { SettingsSidebar };
