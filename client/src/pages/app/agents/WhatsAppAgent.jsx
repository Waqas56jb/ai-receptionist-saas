import { MessageSquare } from 'lucide-react'
import MessagingAgentPage from '../../../components/ai/MessagingAgentPage'

const automationLabels = {
  autoReply: { label: 'Auto reply', description: 'Answer incoming messages without waiting for your team.' },
  leadCapture: { label: 'Lead capture', description: 'Collect name, contact details and intent, then create a lead.' },
  bookingEnquiries: { label: 'Booking enquiries', description: 'Take booking requests and confirm availability.' },
  faqHandling: { label: 'FAQ handling', description: 'Answer common questions straight from your knowledge base.' },
  humanEscalation: { label: 'Human escalation', description: 'Hand over to your team when the AI is unsure or asked.' },
}

export default function WhatsAppAgent() {
  return (
    <MessagingAgentPage
      channelId="whatsapp"
      title="WhatsApp Agent"
      description="Reply to WhatsApp conversations automatically, using your business knowledge."
      icon={MessageSquare}
      identifierField={{ key: 'businessNumber', label: 'Business phone number', placeholder: '+33 6 44 90 11 27' }}
      automationLabels={automationLabels}
      connectHelp="Connect your WhatsApp Business account through Meta. Tokens and secrets are stored by your backend, never in this app."
    />
  )
}
