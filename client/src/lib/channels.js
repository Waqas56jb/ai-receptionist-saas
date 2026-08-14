/** Display names for channel ids — avoids "Whatsapp" from CSS capitalisation. */
export const channelLabels = {
  voice: 'Voice',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  web: 'Website',
}

export const channelLabel = (id) => channelLabels[id] || id

export default channelLabel
