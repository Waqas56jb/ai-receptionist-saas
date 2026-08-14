import { Instagram, MessageSquare, Mic } from 'lucide-react'
import ChannelPage from './ChannelPage'

export function VoiceChannels() {
  return (
    <ChannelPage
      kind="voice"
      title="Voice"
      description="Every connected phone number, its provider and how much it is being used."
      icon={Mic}
      identifierHeader="Phone number"
      volumeHeader="Calls"
      volumeKey="calls"
      permission="channels.voice"
      extraColumns={[{ key: 'provider', header: 'Provider', sortable: true, hideOnMobile: true }]}
    />
  )
}

export function WhatsAppChannels() {
  return (
    <ChannelPage
      kind="whatsapp"
      title="WhatsApp"
      description="Connected WhatsApp Business accounts and their message volume."
      icon={MessageSquare}
      identifierHeader="Number"
      volumeHeader="Messages"
      volumeKey="messages"
      permission="channels.whatsapp"
      extraColumns={[{ key: 'account', header: 'Account', hideOnMobile: true }]}
    />
  )
}

export function InstagramChannels() {
  return (
    <ChannelPage
      kind="instagram"
      title="Instagram"
      description="Connected Instagram professional accounts and their message volume."
      icon={Instagram}
      identifierHeader="Account"
      volumeHeader="Messages"
      volumeKey="messages"
      permission="channels.instagram"
    />
  )
}
