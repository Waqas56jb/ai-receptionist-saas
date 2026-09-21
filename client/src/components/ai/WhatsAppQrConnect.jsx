import { useEffect, useState } from 'react'
import { Loader2, QrCode, RefreshCw, Unplug } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useToast } from '../../context/ToastContext'
import { api, isApiOfflineError, whatsappEventSource } from '../../services/api'

export default function WhatsAppQrConnect() {
  const toast = useToast()
  const [state, setState] = useState({ status: 'loading', qr: null, phone: null, connected: false })
  const [busy, setBusy] = useState(false)

  const apply = (payload) => {
    setState((prev) => ({
      ...prev,
      ...payload,
      connected: payload.status === 'connected' || payload.connected,
    }))
  }

  const start = async () => {
    setBusy(true)
    try {
      apply(await api('/whatsapp/qr', { method: 'POST' }))
    } catch (error) {
      toast.error(isApiOfflineError(error) ? 'Start the Node server to show a live QR code.' : error.message)
    } finally {
      setBusy(false)
    }
  }

  const disconnect = async () => {
    setBusy(true)
    try {
      apply(await api('/whatsapp/disconnect', { method: 'POST' }))
      toast.success('WhatsApp disconnected. History and knowledge stay on this account.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    let source
    api('/whatsapp/status')
      .then((status) => {
        apply(status)
        if (!status.connected) start()
      })
      .catch(() => setState((prev) => ({ ...prev, status: 'offline' })))

    try {
      source = whatsappEventSource()
      source.onmessage = (event) => {
        try {
          apply(JSON.parse(event.data))
        } catch {
          /* ignore malformed frames */
        }
      }
    } catch {
      /* EventSource unavailable */
    }

    return () => source?.close()
  }, [])

  return (
    <Card>
      <CardHeader
        icon={QrCode}
        title="WhatsApp QR connection"
        description="Scan once with the business phone. Closing this page does not drop the live session — only Disconnect does."
        action={
          <Badge tone={state.connected ? 'success' : 'neutral'} dot>
            {state.connected ? 'Live' : state.status === 'qr' ? 'Waiting for scan' : state.status}
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        {state.connected ? (
          <div className="rounded-2xl border border-primary-400/30 bg-primary-500/10 p-4">
            <p className="text-[0.82rem] font-semibold text-primary-400">Connected and staying live</p>
            <p className="mt-1 text-[0.8rem] text-muted">Number: {state.phone || 'WhatsApp session saved'}</p>
            <p className="mt-2 text-[0.75rem] text-subtle">
              Incoming text and voice notes are answered from this account&apos;s knowledge base. Voice notes are
              transcribed and replied to as OpenAI voice messages.
            </p>
            <Button as="button" variant="outline" size="sm" className="mt-4" loading={busy} onClick={disconnect}>
              <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="grid h-64 w-64 place-items-center rounded-2xl border border-line bg-white p-3">
              {state.qr ? (
                <img src={state.qr} alt="WhatsApp QR code" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-muted">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary-400" aria-hidden="true" />
                  <p className="mt-2 text-[0.78rem]">{state.status === 'offline' ? 'Server offline' : 'Preparing QR…'}</p>
                </div>
              )}
            </div>
            <div className="space-y-3 text-[0.82rem] leading-relaxed text-muted">
              <p>1. Open WhatsApp on the business phone.</p>
              <p>2. Go to Linked devices → Link a device.</p>
              <p>3. Scan this code. This account only sees its own chats and knowledge.</p>
              <Button as="button" variant="secondary" size="sm" loading={busy} onClick={start}>
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh QR
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
