import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { PublishPage } from './pages/PublishPage';
import { ActivityPage } from './pages/ActivityPage';
import { TopicsPage } from './pages/TopicsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ShopPage } from './pages/ShopPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { RankingPage } from './pages/RankingPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SearchPage } from './pages/SearchPage';
import { CampSwitchPage } from './pages/CampSwitchPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { RechargePage } from './pages/RechargePage';
import { AdRewardPage } from './pages/AdRewardPage';
import { DailyTaskPage } from './pages/DailyTaskPage';
import { FollowPage } from './pages/FollowPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { TopicManagePage } from './pages/TopicManagePage';
import { CommentDetailPage } from './pages/CommentDetailPage';
import { ImagePreviewPage } from './pages/ImagePreviewPage';
import { SharePage } from './pages/SharePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { FollowerListPage } from './pages/FollowerListPage';
import { FollowingListPage } from './pages/FollowingListPage';
import { TopicCategoryPage } from './pages/TopicCategoryPage';
import { PostEditPage } from './pages/PostEditPage';
import { ReportPage } from './pages/ReportPage';
import { UploadEvidencePage } from './pages/UploadEvidencePage';
import { EvidenceDetailPage } from './pages/EvidenceDetailPage';
import { EvidenceCommentsPage } from './pages/EvidenceCommentsPage';
import { CampEvidenceListPage } from './pages/CampEvidenceListPage';
import { EvidenceRankPage } from './pages/EvidenceRankPage';
import { TopicHotPage } from './pages/TopicHotPage';
import { TopicNewPage } from './pages/TopicNewPage';
import { TopicFollowPage } from './pages/TopicFollowPage';
import { ActivityChallengePage } from './pages/ActivityChallengePage';
import { ActivityHistoryPage } from './pages/ActivityHistoryPage';
import { PublishDraftPage } from './pages/PublishDraftPage';
import { PublishTemplatePage } from './pages/PublishTemplatePage';
import { ProfileWalletPage } from './pages/ProfileWalletPage';
import { ProfileAchievementPage } from './pages/ProfileAchievementPage';
import { PointsHistoryPage } from './pages/PointsHistoryPage';
import { CashHistoryPage } from './pages/CashHistoryPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { AIJudgeSelectPage } from './pages/AIJudgeSelectPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTopicsPage } from './pages/admin/AdminTopicsPage';
import { AdminWithdrawalsPage } from './pages/admin/AdminWithdrawalsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { AdminTopicDetailPage } from './pages/admin/AdminTopicDetailPage';
import { AdminCommentsPage } from './pages/admin/AdminCommentsPage';
import { AdminAiJudgesPage } from './pages/admin/AdminAiJudgesPage';
import { AdminPointsPage } from './pages/admin/AdminPointsPage';
import { AdminCashPage } from './pages/admin/AdminCashPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';
import { AdminShopPage } from './pages/admin/AdminShopPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';
import { AdminVotesPage } from './pages/admin/AdminVotesPage';
import { AdminFollowsPage } from './pages/admin/AdminFollowsPage';
import { AdminCampSwitchPage } from './pages/admin/AdminCampSwitchPage';
import { AdminEvidencePage } from './pages/admin/AdminEvidencePage';
import { AdminRewardsPage } from './pages/admin/AdminRewardsPage';
import { AdminDailyTaskPage } from './pages/admin/AdminDailyTaskPage';
import { AdminAdRewardPage } from './pages/admin/AdminAdRewardPage';
import { AdminRankingPage } from './pages/admin/AdminRankingPage';
import { AdminCampEvidenceListPage } from './pages/admin/AdminCampEvidenceListPage';
import { AdminProfileWalletPage } from './pages/admin/AdminProfileWalletPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { MyFavoritesPage } from './pages/MyFavoritesPage';
import { BrowseHistoryPage } from './pages/BrowseHistoryPage';
import { InvitePage } from './pages/InvitePage';
import { HelpPage } from './pages/HelpPage';
import { AboutPage } from './pages/AboutPage';
import { MyCouponsPage } from './pages/MyCouponsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsAddressPage } from './pages/SettingsAddressPage';
import { SettingsSecurityPage } from './pages/SettingsSecurityPage';
import { SettingsNotificationsPage } from './pages/SettingsNotificationsPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { ContactPage } from './pages/ContactPage';
import { NewOfficialSitePage } from './pages/NewOfficialSitePage';
import { OfficialSitePage } from './pages/OfficialSitePage';
import { LocalPage } from './pages/LocalPage';
import { ToastProvider } from './components/Toast';
import { Capacitor } from '@capacitor/core';

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isOfficial = location.pathname === '/';
  const isAuthPage = ['/register', '/login', '/onboarding'].includes(location.pathname);

  if (isOfficial) {
    // 在 Capacitor 原生环境下，跳过官网页面直接进入 app 首页
    if (Capacitor.isNativePlatform()) {
      return <Navigate to="/home" replace />;
    }
    const hostname = window.location.hostname;
    const isYicai = hostname === 'yicaijingpin.com' || hostname === 'www.yicaijingpin.com';
    return (
      <Routes>
        <Route path="/" element={isYicai ? <NewOfficialSitePage /> : <OfficialSitePage />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/topics" element={<AdminTopicsPage />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/user/:userId" element={<AdminUserDetailPage />} />
          <Route path="/admin/topic/:id" element={<AdminTopicDetailPage />} />
          <Route path="/admin/comments" element={<AdminCommentsPage />} />
          <Route path="/admin/ai-judges" element={<AdminAiJudgesPage />} />
          <Route path="/admin/points" element={<AdminPointsPage />} />
          <Route path="/admin/cash" element={<AdminCashPage />} />
          <Route path="/admin/activity" element={<AdminActivityPage />} />
          <Route path="/admin/shop" element={<AdminShopPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/logs" element={<AdminLogsPage />} />
          <Route path="/admin/votes" element={<AdminVotesPage />} />
          <Route path="/admin/follows" element={<AdminFollowsPage />} />
          <Route path="/admin/camp-switch" element={<AdminCampSwitchPage />} />
          <Route path="/admin/evidence" element={<AdminEvidencePage />} />
          <Route path="/admin/rewards" element={<AdminRewardsPage />} />
          <Route path="/admin/daily-tasks" element={<AdminDailyTaskPage />} />
          <Route path="/admin/ad-rewards" element={<AdminAdRewardPage />} />
          <Route path="/admin/ranking" element={<AdminRankingPage />} />
          <Route path="/admin/camp-evidence/:topicId" element={<AdminCampEvidenceListPage />} />
          <Route path="/admin/user/:userId/wallet" element={<AdminProfileWalletPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <MobileLayout>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topic/:id" element={<TopicDetailPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/camp-switch" element={<CampSwitchPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/ad-reward" element={<AdRewardPage />} />
        <Route path="/daily-task" element={<DailyTaskPage />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/topic-manage" element={<TopicManagePage />} />
        <Route path="/comment/:id" element={<CommentDetailPage />} />
        <Route path="/image-preview/:index" element={<ImagePreviewPage />} />
        <Route path="/share/:id" element={<SharePage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/user/:userId/followers" element={<FollowerListPage />} />
        <Route path="/user/:userId/following" element={<FollowingListPage />} />
        <Route path="/category/:category" element={<TopicCategoryPage />} />
        <Route path="/post/:id/edit" element={<PostEditPage />} />
        <Route path="/report/:type/:id" element={<ReportPage />} />
        <Route path="/upload-evidence/:id" element={<UploadEvidencePage />} />
        <Route path="/upload-evidence/:id/:camp" element={<UploadEvidencePage />} />
        <Route path="/evidence/:id" element={<EvidenceDetailPage />} />
        <Route path="/evidence/:id/comments" element={<EvidenceCommentsPage />} />
        <Route path="/topic/:topicId/camp/:camp" element={<CampEvidenceListPage />} />
        <Route path="/evidence-rank" element={<EvidenceRankPage />} />
        <Route path="/topics/hot" element={<TopicHotPage />} />
        <Route path="/topics/new" element={<TopicNewPage />} />
        <Route path="/topics/follow" element={<TopicFollowPage />} />
        <Route path="/local" element={<LocalPage />} />
        <Route path="/activity/challenge/:id" element={<ActivityChallengePage />} />
        <Route path="/activity/history" element={<ActivityHistoryPage />} />
        <Route path="/publish/drafts" element={<PublishDraftPage />} />
        <Route path="/publish/templates" element={<PublishTemplatePage />} />
        <Route path="/profile/wallet" element={<ProfileWalletPage />} />
        <Route path="/profile/achievements" element={<ProfileAchievementPage />} />
        <Route path="/profile/points" element={<PointsHistoryPage />} />
        <Route path="/profile/cash" element={<CashHistoryPage />} />
        <Route path="/ai-judge-select/:topicId" element={<AIJudgeSelectPage />} />
        <Route path="/recharge" element={<RechargePage />} />
        <Route path="/convert-power" element={<RewardsPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/my-favorites" element={<MyFavoritesPage />} />
        <Route path="/browse-history" element={<BrowseHistoryPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-coupons" element={<MyCouponsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/settings/address" element={<SettingsAddressPage />} />
        <Route path="/settings/security" element={<SettingsSecurityPage />} />
        <Route path="/settings/notifications" element={<SettingsNotificationsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </MobileLayout>
  );
}

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
