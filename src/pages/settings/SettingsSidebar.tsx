import { IScrollspyMenuItems, ScrollspyMenu } from '@/partials/menu';

const SettingsSidebar = () => {
  const items: IScrollspyMenuItems = [
    {
      title: 'General Settings',
      target: 'general_settings',
      active: true
    },
    {
      title: 'System Configuration',
      children: [
        {
          title: 'Application Settings',
          target: 'system_app_settings',
          active: false
        },
        {
          title: 'Database Configuration',
          target: 'system_database_config'
        },
        {
          title: 'API Configuration',
          target: 'system_api_config'
        },
        {
          title: 'Security Settings',
          target: 'system_security_settings'
        },
        {
          title: 'Performance Tuning',
          target: 'system_performance'
        }
      ]
    },
    {
      title: 'User Management',
      children: [
        {
          title: 'User Roles',
          target: 'user_management_roles'
        },
        {
          title: 'Permissions',
          target: 'user_management_permissions'
        },
        {
          title: 'Access Control',
          target: 'user_management_access_control'
        },
        {
          title: 'User Groups',
          target: 'user_management_groups'
        }
      ]
    },
    {
      title: 'Content Management',
      children: [
        {
          title: 'Content Settings',
          target: 'content_management_settings'
        },
        {
          title: 'Moderation Rules',
          target: 'content_moderation_rules'
        },
        {
          title: 'AI Configuration',
          target: 'content_ai_config'
        }
      ]
    },
    {
      title: 'Notifications & Alerts',
      children: [
        {
          title: 'Email Notifications',
          target: 'notifications_email'
        },
        {
          title: 'System Alerts',
          target: 'notifications_system_alerts'
        },
        {
          title: 'Alert Rules',
          target: 'notifications_alert_rules'
        }
      ]
    },
    {
      title: 'Backup & Maintenance',
      children: [
        {
          title: 'Backup Settings',
          target: 'backup_settings'
        },
        {
          title: 'System Maintenance',
          target: 'maintenance_settings'
        },
        {
          title: 'Log Management',
          target: 'log_management'
        }
      ]
    },
    {
      title: 'Advanced',
      children: [
        {
          title: 'Developer Tools',
          target: 'advanced_developer_tools'
        },
        {
          title: 'System Information',
          target: 'advanced_system_info'
        },
        {
          title: 'Diagnostics',
          target: 'advanced_diagnostics'
        }
      ]
    }
  ];

  return <ScrollspyMenu items={items} />;
};

export { SettingsSidebar };
