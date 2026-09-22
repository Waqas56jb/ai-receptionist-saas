import { useEffect, useState } from 'react'
import { Copy, Loader2, QrCode, RefreshCw, Unplug } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Input } from '../ui/Field'
import { useToast } from '../../context/ToastContext'
import { api, isApiOfflineError, whatsappEventSource } from '../../services/api'

export default function WhatsAppQrConnect() {
  const toast = useToast()
  const [state, setState] = useState({
    status: 'loading',
    qr: null,
    phone: null,
    connected: false,
    host: 'node',
    mode: 'qr',
    webhookUrl: '',
    phoneNumberId: '',
    tokenPreview: '',
  })
  const [busy, setBusy] = useState(false)
  const [cloud, setCloud] = useState({ phoneNumberId: '', accessToken: '', displayPhone: '' })

  const apply = (payload) => {
    setState((prev) => ({
      ...prev,
      ...payload,
      connected: payload.status === 'connected' || payload.connected,
    }))
    if (payload.phoneNumberId) {
      setCloud((prev) => ({ ...prev, phoneNumberId: prev.phoneNumberId || payload.phoneNumberId }))
    }
  }

  const startQr = async () => {
    setBusy(true)
    try {
      apply(await api('/whatsapp/qr', { method: 'POST' }))
    } catch (error) {
      toast.error(isApiOfflineError(error) ? 'Start the Node server to show a live QR code.' : error.message)
    } finally {
      setBusy(false)
    }
  }

  const connectCloud = async () => {
    if (!cloud.phoneNumberId.trim() || !cloud.accessToken.trim()) {
      toast.error('Enter the WhatsApp Phone Number ID and access token.')
      return
    }
    setBusy(true)
    try {
      apply(
        await api('/whatsapp/cloud', {
          method: 'POST',
          body: {
            phoneNumberId: cloud.phoneNumberId.trim(),
            accessToken: cloud.accessToken.trim(),
            displayPhone: cloud.displayPhone.trim(),
          },
        }),
      )
      setCloud((prev) => ({ ...prev, accessToken: '' }))
      toast.success('WhatsApp Cloud API connected. Incoming messages are answered from your knowledge and ChatGPT.')
    } catch (error) {
      toast.error(error.message || 'Could not connect WhatsApp Cloud API.')
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

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(state.webhookUrl)
      toast.success('Webhook URL copied.')
    } catch {
      toast.info(state.webhookUrl)
    }
  }

  useEffect(() => {
    let source
    api('/whatsapp/status')
      .then((status) => {
        apply(status)
        const needsQr = !status.connected && status.host !== 'vercel' && status.status !== 'cloud_required'
        if (needsQr) startQr()
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

  const cloudMode = state.host === 'vercel' || state.mode === 'cloud' || state.status === 'cloud_required'

  return (
    <Card>
      <CardHeader
        icon={QrCode}
        title={cloudMode ? 'WhatsApp Cloud API' : 'WhatsApp QR connection'}
        description={
          cloudMode
            ? 'Production uses Meta WhatsApp Cloud API so messages work on Vercel. Paste your Phone Number ID and permanent token.'
            : 'Scan once with the business phone. Closing this page does not drop the live session — only Disconnect does.'
        }
        action={
          <Badge tone={state.connected ? 'success' : 'neutral'} dot>
            {state.connected ? 'Live' : cloudMode ? 'Cloud setup' : state.status === 'qr' ? 'Waiting for scan' : state.status}
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        {state.connected ? (
          <div className="rounded-2xl border border-primary-400/30 bg-primary-500/10 p-4">
            <p className="text-[0.82rem] font-semibold text-primary-400">Connected and staying live</p>
            <p className="mt-1 text-[0.8rem] text-muted">Number: {state.phone || 'WhatsApp session saved'}</p>
            <p className="mt-2 text-[0.75rem] text-subtle">
              Incoming text and voice notes are answered from this account&apos;s knowledge base first. Questions outside
              the knowledge base are answered by ChatGPT.
            </p>
            <Button as="button" variant="outline" size="sm" className="mt-4" loading={busy} onClick={disconnect}>
              <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
              Disconnect
            </Button>
          </div>
        ) : cloudMode ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-canvas-soft/60 p-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-subtle">Callback URL for Meta</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate text-[0.75rem] text-ink">{state.webhookUrl || 'https://ai-receptionist-saas-server.vercel.app/api/whatsapp/webhook'}</code>
                <Button as="button" variant="ghost" size="xs" onClick={copyWebhook}>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy
                </Button>
              </div>
              <p className="mt-2 text-[0.72rem] text-muted">
                In Meta Developer → WhatsApp → Configuration, set this webhook and use verify token{' '}
                <span className="font-semibold text-ink">devmark-whatsapp</span> unless you set WHATSAPP_VERIFY_TOKEN on
                the server.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Phone Number ID"
                value={cloud.phoneNumberId}
                onChange={(e) => setCloud((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                placeholder="123456789012345"
                required
              />
              <Input
                label="Display phone (optional)"
                value={cloud.displayPhone}
                onChange={(e) => setCloud((prev) => ({ ...prev, displayPhone: e.target.value }))}
                placeholder="+253 77 00 00 00"
              />
              <Input
                className="sm:col-span-2"
                label="Permanent access token"
                type="password"
                value={cloud.accessToken}
                onChange={(e) => setCloud((prev) => ({ ...prev, accessToken: e.target.value }))}
                placeholder={state.tokenPreview || 'EAAG…'}
                required
              />
            </div>
            <Button as="button" size="sm" loading={busy} onClick={connectCloud}>
              Connect WhatsApp
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
              <Button as="button" variant="secondary" size="sm" loading={busy} onClick={startQr}>
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
