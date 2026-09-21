/** Live channels only. Voice, Instagram and Twilio stay hidden until those agents go live. */
export const liveChannelIds = ['whatsapp', 'web']

export const isLiveChannel = (id) => liveChannelIds.includes(id)

/** Display names for channel ids — avoids "Whatsapp" from CSS capitalisation. */
export const channelLabels = {
  voice: 'Voice',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  web: 'Website',
}

export const channelLabel = (id) => channelLabels[id] || id

export default channelLabel
