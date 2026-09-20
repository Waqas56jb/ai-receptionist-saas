import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout, { ProtectedRoute, RequirePermission } from './components/layout/AdminLayout'

/* Auth is eager (it is the entry point); everything else is code-split. */
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))

const Businesses = lazy(() => import('./pages/businesses/Businesses'))
const BusinessDetail = lazy(() => import('./pages/businesses/BusinessDetail'))
const Users = lazy(() => import('./pages/users/Users'))
const UserDetail = lazy(() => import('./pages/users/UserDetail'))
const Admins = lazy(() => import('./pages/admins/Admins'))
const AdminCreate = lazy(() => import('./pages/admins/AdminCreate'))
const AdminDetail = lazy(() => import('./pages/admins/AdminDetail'))

const Subscriptions = lazy(() => import('./pages/revenue/Subscriptions'))
const SubscriptionDetail = lazy(() => import('./pages/revenue/SubscriptionDetail'))
const Plans = lazy(() => import('./pages/revenue/Plans'))
const Payments = lazy(() => import('./pages/revenue/Payments'))
const Invoices = lazy(() => import('./pages/revenue/Invoices'))

const AIAgents = lazy(() => import('./pages/ai/AIAgents'))
const AIAgentDetail = lazy(() => import('./pages/ai/AIAgentDetail'))

const Profile = lazy(() => import('./pages/account/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * The grouped page files export several screens; these thin wrappers let each
 * one be lazily loaded and routed individually.
 */
const named = (loader, key) => lazy(() => loader().then((mod) => ({ default: mod[key] })))

const VoiceChannels = named(() => import('./pages/ai/Channels'), 'VoiceChannels')
const WhatsAppChannels = named(() => import('./pages/ai/Channels'), 'WhatsAppChannels')
const InstagramChannels = named(() => import('./pages/ai/Channels'), 'InstagramChannels')

const Conversations = named(() => import('./pages/comms/Communication'), 'Conversations')
const Calls = named(() => import('./pages/comms/Communication'), 'Calls')
const Messages = named(() => import('./pages/comms/Communication'), 'Messages')
const Transcripts = named(() => import('./pages/comms/Communication'), 'Transcripts')

const PlatformAnalytics = named(() => import('./pages/analytics/Analytics'), 'PlatformAnalytics')
const RevenueAnalytics = named(() => import('./pages/analytics/Analytics'), 'RevenueAnalytics')
const UsageAnalytics = named(() => import('./pages/analytics/Analytics'), 'UsageAnalytics')
const AIUsage = named(() => import('./pages/analytics/Analytics'), 'AIUsage')

const SupportTickets = named(() => import('./pages/support/Support'), 'SupportTickets')
const TicketDetail = named(() => import('./pages/support/Support'), 'TicketDetail')
const Announcements = named(() => import('./pages/support/Support'), 'Announcements')

const AuditLogs = named(() => import('./pages/security/Security'), 'AuditLogs')
const SecurityCentre = named(() => import('./pages/security/Security'), 'SecurityCentre')

const PlatformSettings = named(() => import('./pages/system/System'), 'PlatformSettings')
const Integrations = named(() => import('./pages/system/System'), 'Integrations')
const FeatureFlags = named(() => import('./pages/system/System'), 'FeatureFlags')
const Maintenance = named(() => import('./pages/system/System'), 'Maintenance')

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary-400" />
        <span className="text-sm">Loading…</span>
      </span>
    </div>
  )
}

/** Wraps a page in its permission gate. */
const gated = (permission, element) => <RequirePermission permission={permission}>{element}</RequirePermission>

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Platform */}
          <Route path="businesses" element={gated('businesses.view', <Businesses />)} />
          <Route path="businesses/:id" element={gated('businesses.view', <BusinessDetail />)} />
          <Route path="users" element={gated('users.view', <Users />)} />
          <Route path="users/:id" element={gated('users.view', <UserDetail />)} />
          <Route path="admins" element={gated('system.admins', <Admins />)} />
          <Route path="admins/create" element={gated('system.admins', <AdminCreate />)} />
          <Route path="admins/:id" element={gated('system.admins', <AdminDetail />)} />

          {/* Revenue */}
          <Route path="subscriptions" element={gated('subscriptions.view', <Subscriptions />)} />
          <Route path="subscriptions/:id" element={gated('subscriptions.view', <SubscriptionDetail />)} />
          <Route path="plans" element={gated('billing.plans', <Plans />)} />
          <Route path="payments" element={gated('billing.payments', <Payments />)} />
          <Route path="invoices" element={gated('billing.invoices', <Invoices />)} />

          {/* AI & communication */}
          <Route path="ai-agents" element={gated('ai.viewConfig', <AIAgents />)} />
          <Route path="ai-agents/:id" element={gated('ai.viewConfig', <AIAgentDetail />)} />
          <Route path="ai-usage" element={gated('ai.viewUsage', <AIUsage />)} />
          <Route path="voice" element={gated('channels.voice', <VoiceChannels />)} />
          <Route path="whatsapp" element={gated('channels.whatsapp', <WhatsAppChannels />)} />
          <Route path="instagram" element={gated('channels.instagram', <InstagramChannels />)} />
          <Route path="conversations" element={gated('analytics.business', <Conversations />)} />
          <Route path="calls" element={gated('analytics.business', <Calls />)} />
          <Route path="messages" element={gated('analytics.business', <Messages />)} />
          <Route path="transcripts" element={gated('analytics.business', <Transcripts />)} />

          {/* Analytics */}
          <Route path="analytics" element={gated('analytics.platform', <PlatformAnalytics />)} />
          <Route path="analytics/revenue" element={gated('analytics.revenue', <RevenueAnalytics />)} />
          <Route path="analytics/usage" element={gated('analytics.usage', <UsageAnalytics />)} />

          {/* Support */}
          <Route path="support" element={gated('support.view', <SupportTickets />)} />
          <Route path="support/:id" element={gated('support.view', <TicketDetail />)} />
          <Route path="announcements" element={gated('support.announce', <Announcements />)} />

          {/* Security */}
          <Route path="audit-logs" element={gated('system.audit', <AuditLogs />)} />
          <Route path="security" element={gated('system.security', <SecurityCentre />)} />

          {/* System */}
          <Route path="settings" element={gated('system.settings', <PlatformSettings />)} />
          <Route path="settings/integrations" element={gated('system.settings', <Integrations />)} />
          <Route path="settings/features" element={gated('system.features', <FeatureFlags />)} />
          <Route path="settings/maintenance" element={gated('system.maintenance', <Maintenance />)} />

          {/* Account */}
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
