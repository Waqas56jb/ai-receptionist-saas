import { Instagram } from 'lucide-react'
import MessagingAgentPage from '../../../components/ai/MessagingAgentPage'

const automationLabels = {
  dmAutoReply: { label: 'DM auto reply', description: 'Answer direct messages as soon as they arrive.' },
  faqResponses: { label: 'FAQ responses', description: 'Answer common questions from your knowledge base.' },
  leadCapture: { label: 'Lead capture', description: 'Collect contact details from interested followers.' },
  productEnquiries: { label: 'Product & service enquiries', description: 'Answer questions about what you offer and what it costs.' },
  bookingEnquiries: { label: 'Booking enquiries', description: 'Take booking requests raised in a DM.' },
  humanEscalation: { label: 'Human escalation', description: 'Hand the conversation to your team when needed.' },
}

export default function InstagramAgent() {
  return (
    <MessagingAgentPage
      channelId="instagram"
      title="Instagram Agent"
      description="Handle Instagram direct messages with the same AI that answers your calls."
      icon={Instagram}
      identifierField={{ key: 'accountHandle', label: 'Instagram account', placeholder: '@yourbusiness' }}
      automationLabels={automationLabels}
      connectHelp="Connect the professional Instagram account linked to your Facebook Page. Access tokens are handled by your backend."
    />
  )
}
