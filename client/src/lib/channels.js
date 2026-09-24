/** Live channels only. Instagram stays hidden until that agent goes live. */
export const liveChannelIds = ['whatsapp', 'web', 'voice']

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
