import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Database, Globe, RefreshCw } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { Textarea } from '../../../components/ui/Field'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import widgetService from '../../../services/widgetService'

export default function WebsiteWidget() {
  const toast = useToast()
  const widget = useAsync(() => widgetService.get(), [])
  const [copied, setCopied] = useState('')
  const [busy, setBusy] = useState(false)

  const copy = async (value, id) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      toast.success('Copied — paste it on your website.')
      setTimeout(() => setCopied(''), 1600)
    } catch {
      toast.error('Could not copy. Select the snippet and copy it manually.')
    }
  }

  const regenerate = async () => {
    setBusy(true)
    try {
      widget.setData(await widgetService.regenerate())
      toast.success('New widget link created. Update the snippet on your website.')
    } catch (error) {
      toast.error(error.message || 'Could not regenerate the widget link.')
    } finally {
      setBusy(false)
    }
  }

  const data = widget.data

  if (widget.error && !data) {
    return (
      <Card>
        <ErrorState
          title="Could not load your widget link."
          description="The API may be restarting. Retry, or sign in again."
          onRetry={widget.reload}
        />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title="Website widget"
        description="Copy your embed snippet. Visitors can chat or talk to your 3D voice agent, trained only on this account's knowledge base."
        badge={
          data && (
            <Badge tone="success" dot>
              Live for {data.businessName}
            </Badge>
          )
        }
        actions={
          <Button as={Link} to="/app/knowledge-base" variant="secondary" size="sm">
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            Train knowledge
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card>
          <CardHeader
            icon={Globe}
            title="Embed on any website"
            description="Paste this once, anywhere in your site HTML. The chat bubble appears on every page that includes it."
          />
          <CardBody className="space-y-4">
            <div>
              <Textarea label="Widget snippet" value={data?.snippet || ''} readOnly rows={3} />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button as="button" size="sm" onClick={() => copy(data?.snippet || '', 'snippet')} disabled={!data}>
                  {copied === 'snippet' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === 'snippet' ? 'Copied' : 'Copy snippet'}
                </Button>
                <Button as="button" variant="outline" size="sm" onClick={() => copy(data?.frameUrl || '', 'link')} disabled={!data}>
                  {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy widget link
                </Button>
              </div>
            </div>

            <div>
              <Textarea
                label="Optional iframe"
                hint="Use this if your site cannot load an external script."
                value={data?.iframe || ''}
                readOnly
                rows={3}
              />
              <Button
                as="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => copy(data?.iframe || '', 'iframe')}
                disabled={!data}
              >
                {copied === 'iframe' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy iframe
              </Button>
            </div>

            <p className="text-[0.8rem] leading-relaxed text-slate-500">
              Replies come from the knowledge you add in{' '}
              <Link to="/app/knowledge-base" className="font-semibold text-primary-400 underline-offset-4 hover:underline">
                Knowledge Base
              </Link>{' '}
              and{' '}
              <Link to="/app/ai-training" className="font-semibold text-primary-400 underline-offset-4 hover:underline">
                AI Training
              </Link>
              . Website chats land in Conversation history and the dashboard charts.
            </p>

            <Button as="button" variant="outline" size="sm" loading={busy} onClick={regenerate} disabled={!data}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Regenerate link
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Preview" description="This is the same widget visitors will see on your site." />
          <CardBody>
            {data?.frameUrl ? (
              <iframe
                title="Website widget preview"
                src={data.frameUrl}
                allow="microphone; autoplay; clipboard-write"
                className="h-[36rem] w-full rounded-2xl border border-line bg-canvas"
              />
            ) : (
              <div className="h-[34rem] animate-pulse rounded-2xl bg-slate-100" />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
