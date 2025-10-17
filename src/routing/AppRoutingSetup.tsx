import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import { ReadingPlanDashboardPage } from '@/pages/reading-plan/ReadingPlanDashboardPage';
import { ReadingPlanManagePage } from '@/pages/reading-plan/ReadingPlanManagePage';
import { ReadingPlanAssignPage } from '@/pages/reading-plan/ReadingPlanAssignPage';
import { ReadingPlanProgressPage } from '@/pages/reading-plan/ReadingPlanProgressPage';
import { ReadingPlanContentPage } from '@/pages/reading-plan/ReadingPlanContentPage';
import { ReadingPlanAnalyticsPage } from '@/pages/reading-plan/ReadingPlanAnalyticsPage';
import { ReadingPlanNotificationsPage } from '@/pages/reading-plan/ReadingPlanNotificationsPage';
import { BibleContentDashboardPage } from '@/pages/bible-content/dashboard';
import { BibleTranslationsPage } from '@/pages/bible-content/translations';
import { BibleBooksChaptersPage } from '@/pages/bible-content/books-chapters';
import { AIExplanationManagementPage } from '@/pages/bible-content/ai-explanations/AIExplanationManagementPage';
import { TheologicalInsightsPage } from '@/pages/bible-content/theological-insights/TheologicalInsightsPage';
import { ContentModerationPage } from '@/pages/bible-content/moderation';
import { ContentSearchAnalyticsPage } from '@/pages/bible-content/search-analytics';
import { 
  NotesOverview, 
  NoteDetail, 
  ModerationQueue, 
  NotesAnalytics, 
  AdminSettings 
} from '@/pages/notes-journals';
import { 
  MonetizationDashboard, 
  SubscriptionManagement, 
  SubscriptionAnalytics 
} from '@/pages/monetization';
import { 
  PromptList, 
  AddEditPrompt, 
  ViewPrompt, 
  PromptHistory 
} from '@/pages/ai-prompt-management';
import { FeedbackInboxPage } from '@/pages/feedback/FeedbackInboxPage';
import { AIFlagReviewPage } from '@/pages/feedback/AIFlagReviewPage';
import { 
  ActivityLogList, 
  UserActivityDetail, 
  ActivityAnalytics, 
  SystemAlerts 
} from '@/pages/system-log';
import {
  ProfileActivityPage,
  ProfileBloggerPage,
  CampaignsCardPage,
  CampaignsListPage,
  ProjectColumn2Page,
  ProjectColumn3Page,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage
} from '@/pages/public-profile';
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage
} from '@/pages/account';
import {
  NetworkAppRosterPage,
  NetworkMarketAuthorsPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSocialPage,
  NetworkUserCardsTeamCrewPage,
  NetworkSaasUsersPage,
  NetworkStoreClientsPage,
  NetworkUserTableTeamCrewPage,
  NetworkUserDetailPage,
  NetworkVisitorsPage
} from '@/pages/network';

import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { SettingsSidebarPage } from '@/pages/settings/SettingsSidebarPage';
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage
} from '@/pages/authentication';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          
          {/* Reading Plan Routes */}
          <Route path="/reading-plan" element={<ReadingPlanDashboardPage />} />
          <Route path="/reading-plan/manage" element={<ReadingPlanManagePage />} />
          <Route path="/reading-plan/assign" element={<ReadingPlanAssignPage />} />
          <Route path="/reading-plan/progress" element={<ReadingPlanProgressPage />} />
          <Route path="/reading-plan/content" element={<ReadingPlanContentPage />} />
          <Route path="/reading-plan/analytics" element={<ReadingPlanAnalyticsPage />} />
          <Route path="/reading-plan/notifications" element={<ReadingPlanNotificationsPage />} />
          
          {/* Bible Content Routes */}
          <Route path="/bible-content" element={<BibleContentDashboardPage />} />
          <Route path="/bible-content/translations" element={<BibleTranslationsPage />} />
          <Route path="/bible-content/books-chapters" element={<BibleBooksChaptersPage />} />
          <Route path="/bible-content/ai-explanations" element={<AIExplanationManagementPage />} />
          <Route path="/bible-content/theological-insights" element={<TheologicalInsightsPage />} />
          <Route path="/bible-content/moderation" element={<ContentModerationPage />} />
          <Route path="/bible-content/search-analytics" element={<ContentSearchAnalyticsPage />} />
          
          {/* Notes & Journals Routes */}
          <Route path="/notes-journals" element={<NotesOverview />} />
          <Route path="/notes-journals/detail/:id" element={<NoteDetail />} />
          <Route path="/notes-journals/moderation" element={<ModerationQueue />} />
          <Route path="/notes-journals/analytics" element={<NotesAnalytics />} />
          <Route path="/notes-journals/settings" element={<AdminSettings />} />
          
          {/* Monetization Routes */}
          <Route path="/monetization" element={<MonetizationDashboard />} />
          <Route path="/monetization/subscription-plan" element={<SubscriptionManagement />} />
          <Route path="/monetization/subscription-reports" element={<SubscriptionAnalytics />} />
          
          {/* AI Prompt Management Routes */}
          <Route path="/ai-prompt-management" element={<PromptList />} />
          <Route path="/ai-prompt-management/add" element={<AddEditPrompt />} />
          <Route path="/ai-prompt-management/edit/:id" element={<AddEditPrompt />} />
          <Route path="/ai-prompt-management/view/:id" element={<ViewPrompt />} />
          <Route path="/ai-prompt-management/history/:id" element={<PromptHistory />} />
          
          {/* Feedback & Moderation Routes */}
          <Route path="/feedback/inbox" element={<FeedbackInboxPage />} />
          <Route path="/feedback/ai-flags" element={<AIFlagReviewPage />} />
          
          {/* System Log Routes */}
          <Route path="/system-log" element={<ActivityLogList />} />
          <Route path="/system-log/user/:id" element={<UserActivityDetail />} />
          <Route path="/system-log/analytics" element={<ActivityAnalytics />} />
          <Route path="/system-log/alerts" element={<SystemAlerts />} />

          <Route path="/settings" element={<SettingsSidebarPage />} />

          <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
          <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
          <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
          <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
          <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
          <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
          <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
          <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
          <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
          <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
          <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
          <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
          <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
          <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
          <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
          <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
          <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
          <Route
            path="/account/home/settings-enterprise"
            element={<AccountSettingsEnterprisePage />}
          />
          <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
          <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route path="/account/billing/history" element={<AccountHistoryPage />} />
          <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
          <Route path="/account/security/overview" element={<AccountOverviewPage />} />
          <Route
            path="/account/security/allowed-ip-addresses"
            element={<AccountAllowedIPAddressesPage />}
          />
          <Route
            path="/account/security/privacy-settings"
            element={<AccountPrivacySettingsPage />}
          />
          <Route
            path="/account/security/device-management"
            element={<AccountDeviceManagementPage />}
          />
          <Route
            path="/account/security/backup-and-recovery"
            element={<AccountBackupAndRecoveryPage />}
          />
          <Route
            path="/account/security/current-sessions"
            element={<AccountCurrentSessionsPage />}
          />
          <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
          <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
          <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
          <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
          <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route
            path="/account/members/permissions-toggle"
            element={<AccountPermissionsTogglePage />}
          />
          <Route
            path="/account/members/permissions-check"
            element={<AccountPermissionsCheckPage />}
          />
          <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
          <Route path="/account/notifications" element={<AccountNotificationsPage />} />
          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route path="/account/appearance" element={<AccountAppearancePage />} />
          <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
          <Route path="/account/activity" element={<AccountActivityPage />} />
          <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
          <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
          <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
          <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
          <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
          <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
          <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
          <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
          <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
          <Route path="/network/user-table/user-detail" element={<NetworkUserDetailPage />} />
          <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
          <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
          <Route
            path="/auth/account-deactivated"
            element={<AuthenticationAccountDeactivatedPage />}
          />
          <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
