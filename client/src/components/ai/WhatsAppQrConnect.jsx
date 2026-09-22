import { useEffect, useState } from 'react'
import { Loader2, QrCode, RefreshCw, Unplug } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Input } from '../ui/Field'
import { useToast } from '../../context/ToastContext'
import { api, isApiOfflineError, whatsappEventSource } from '../../services/api'

function formatPairingCode(code) {
  const digits = String(code || '').replace(/\s/g, '')
  return digits.length === 8 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
}

export default function WhatsAppQrConnect() {
  const toast = useToast()
  const [state, setState] = useState({ status: 'loading', qr: null, phone: null, connected: false, pairingCode: null })
  const [busy, setBusy] = useState(false)
  const [pairPhone, setPairPhone] = useState('')

  const apply = (payload) => {
    if (!payload || typeof payload !== 'object') return
    setState((prev) => ({
      ...prev,
      ...payload,
      connected: payload.status === 'connected' || payload.connected,
    }))
  }

  const start = async (force = false) => {
    setBusy(true)
    try {
      apply(await api('/whatsapp/qr', { method: 'POST', body: { force } }))
    } catch (error) {
      toast.error(isApiOfflineError(error) ? 'Start the Node server to show a live QR code.' : error.message)
    } finally {
      setBusy(false)
    }
  }

  const pair = async () => {
    setBusy(true)
    try {
      apply(await api('/whatsapp/pair', { method: 'POST', body: { phone: pairPhone } }))
      toast.success('Enter the code on the phone: Linked devices → Link with phone number.')
    } catch (error) {
      toast.error(error.message)
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
    let poll
    api('/whatsapp/status')
      .then((status) => {
        apply(status)
        if (!status.connected) start(true)
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

    poll = setInterval(() => {
      api('/whatsapp/status')
        .then(apply)
        .catch(() => {})
    }, 2500)

    return () => {
      source?.close()
      clearInterval(poll)
    }
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
              Incoming text and voice notes are answered from this account&apos;s knowledge first. Questions outside the
              knowledge base are answered by ChatGPT.
            </p>
            <Button as="button" variant="outline" size="sm" className="mt-4" loading={busy} onClick={disconnect}>
              <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="grid h-[20.5rem] w-[20.5rem] place-items-center rounded-2xl border border-line bg-white p-4">
                {state.qr ? (
                  <img
                    src={state.qr}
                    alt="WhatsApp QR code"
                    className="h-72 w-72 bg-white"
                    style={{ imageRendering: 'pixelated' }}
                  />
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
                <p>3. Scan this code. It refreshes automatically — wait for a new code if WhatsApp says it is invalid.</p>
                <p className="text-[0.75rem] text-subtle">
                  If the phone says it cannot link new devices, wait a minute, tap Refresh QR, then scan the new code.
                </p>
                <Button as="button" variant="secondary" size="sm" loading={busy} onClick={() => start(true)}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Refresh QR
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <p className="text-[0.82rem] font-semibold text-ink">Cannot scan? Link with phone number</p>
              <p className="mt-1 text-[0.75rem] text-muted">
                Same WhatsApp connection, without the camera. Use the business number with country code.
              </p>
              {state.pairingCode ? (
                <p className="mt-3 font-mono text-2xl tracking-[0.2em] text-ink">{formatPairingCode(state.pairingCode)}</p>
              ) : null}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                <Input
                  label="WhatsApp number"
                  value={pairPhone}
                  onChange={(e) => setPairPhone(e.target.value)}
                  placeholder="25377123456"
                  help="Digits only, including country code."
                  className="flex-1"
                />
                <Button as="button" variant="secondary" size="sm" loading={busy} onClick={pair}>
                  Get pairing code
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
