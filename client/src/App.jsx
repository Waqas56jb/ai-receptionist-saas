import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Landing from './pages/Landing'
import ProtectedRoute from './components/layout/ProtectedRoute'

const AppLayout = lazy(() => import('./components/layout/AppLayout'))

/**
 * The portal is code-split away from the public site: a visitor landing on `/`
 * never downloads the dashboard, charts or the mock data layer.
 */
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'))

const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const AIOverview = lazy(() => import('./pages/app/ai/AIOverview'))
const AITraining = lazy(() => import('./pages/app/ai/AITraining'))
const PromptConfiguration = lazy(() => import('./pages/app/ai/PromptConfiguration'))
const KnowledgeBase = lazy(() => import('./pages/app/ai/KnowledgeBase'))
const AIConfigurationMode = lazy(() => import('./pages/app/ai/AIConfigurationMode'))
const AITest = lazy(() => import('./pages/app/ai/AITest'))

const VoiceAgent = lazy(() => import('./pages/app/agents/VoiceAgent'))
const WhatsAppAgent = lazy(() => import('./pages/app/agents/WhatsAppAgent'))
const InstagramAgent = lazy(() => import('./pages/app/agents/InstagramAgent'))
const Channels = lazy(() => import('./pages/app/channels/Channels'))
const CalendarIntegration = lazy(() => import('./pages/app/channels/CalendarIntegration'))

const Conversations = lazy(() => import('./pages/app/comms/Conversations'))
const Calls = lazy(() => import('./pages/app/comms/Calls'))
const Messages = lazy(() => import('./pages/app/comms/Messages'))
const Transcripts = lazy(() => import('./pages/app/comms/Transcripts'))

const Contacts = lazy(() => import('./pages/app/crm/Contacts'))
const ContactDetail = lazy(() => import('./pages/app/crm/ContactDetail'))
const Leads = lazy(() => import('./pages/app/crm/Leads'))
const Bookings = lazy(() => import('./pages/app/crm/Bookings'))

const Analytics = lazy(() => import('./pages/app/insights/Analytics'))
const Usage = lazy(() => import('./pages/app/insights/Usage'))

const Subscription = lazy(() => import('./pages/app/account/Subscription'))
const BusinessSettings = lazy(() => import('./pages/app/account/BusinessSettings'))
const ProfileSettings = lazy(() => import('./pages/app/account/ProfileSettings'))
const NotificationSettings = lazy(() => import('./pages/app/account/NotificationSettings'))
const Team = lazy(() => import('./pages/app/account/Team'))
const Security = lazy(() => import('./pages/app/account/Security'))
const Help = lazy(() => import('./pages/app/account/Help'))
const NotificationCentre = lazy(() => import('./pages/app/Notifications'))

const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        <span className="text-sm">Loading…</span>
      </span>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Business portal */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* AI receptionist */}
          <Route path="ai-agent" element={<AIOverview />} />
          <Route path="ai-training" element={<AITraining />} />
          <Route path="ai-training/prompts" element={<PromptConfiguration />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="ai-config" element={<AIConfigurationMode />} />
          <Route path="ai-test" element={<AITest />} />

          {/* Channel agents */}
          <Route path="voice-agent" element={<VoiceAgent />} />
          <Route path="whatsapp-agent" element={<WhatsAppAgent />} />
          <Route path="instagram-agent" element={<InstagramAgent />} />

          {/* Communication */}
          <Route path="conversations" element={<Conversations />} />
          <Route path="calls" element={<Calls />} />
          <Route path="messages" element={<Messages />} />
          <Route path="transcripts" element={<Transcripts />} />

          {/* CRM */}
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetail />} />
          <Route path="leads" element={<Leads />} />
          <Route path="bookings" element={<Bookings />} />

          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="usage" element={<Usage />} />

          {/* Integrations */}
          <Route path="channels" element={<Channels />} />
          <Route path="integrations/phone" element={<VoiceAgent />} />
          <Route path="integrations/whatsapp" element={<WhatsAppAgent />} />
          <Route path="integrations/instagram" element={<InstagramAgent />} />
          <Route path="integrations/calendar" element={<CalendarIntegration />} />

          {/* Account */}
          <Route path="subscription" element={<Subscription />} />
          <Route path="settings/business" element={<BusinessSettings />} />
          <Route path="settings/profile" element={<ProfileSettings />} />
          <Route path="settings/notifications" element={<NotificationSettings />} />
          <Route path="settings/team" element={<Team />} />
          <Route path="settings/security" element={<Security />} />
          <Route path="notifications" element={<NotificationCentre />} />
          <Route path="help" element={<Help />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
