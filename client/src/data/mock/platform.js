/** Notification labels. In-app lists start empty. */

export const notifications = []

export const notificationPreferences = {
  email: {
    newLead: true,
    newBooking: true,
    humanEscalation: true,
    aiError: true,
    usageLimit: true,
    weeklySummary: false,
  },
  inApp: {
    newLead: true,
    newBooking: true,
    humanEscalation: true,
    aiError: true,
    usageLimit: true,
  },
}

export const notificationLabels = {
  newLead: { title: 'New lead', description: 'When the AI captures and qualifies a new lead.' },
  newBooking: { title: 'New booking', description: 'When a booking is created from any channel.' },
  humanEscalation: { title: 'Human escalation', description: 'When the AI transfers a conversation to your team.' },
  aiError: { title: 'AI error', description: 'When training fails or a channel stops responding.' },
  usageLimit: { title: 'Usage limit', description: 'When you reach 80% and 100% of a plan allowance.' },
  weeklySummary: { title: 'Weekly summary', description: 'A Monday digest of messages, leads and bookings.' },
}

export const helpArticles = []
export const faqs = []
export const supportChannels = []
