import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain,
  Database,
  FileText,
  Globe,
  Loader2,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Tabs from '../../../components/ui/Tabs'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import { Input, Textarea } from '../../../components/ui/Field'
import { EmptyState, ErrorState } from '../../../components/ui/States'
import { ConfirmDialog } from '../../../components/ui/Modal'
import CrudList from '../../../components/business/CrudList'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import businessService from '../../../services/businessService'
import knowledgeService from '../../../services/knowledgeService'
import aiService from '../../../services/aiService'
import { formatBytes, formatDate } from '../../../lib/format'

const tabs = [
  { id: 'knowledge', label: 'Business knowledge', icon: Brain },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'website', label: 'Website', icon: Globe },
]

export default function AITraining() {
  const toast = useToast()
  const [tab, setTab] = useState('knowledge')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const fileRef = useRef(null)

  const business = useAsync(() => businessService.getBusiness(), [])
  const services = useAsync(() => businessService.list('services'), [])
  const products = useAsync(() => businessService.list('products'), [])
  const policies = useAsync(() => businessService.list('policies'), [])
  const bookingRules = useAsync(() => businessService.list('bookingRules'), [])
  const documents = useAsync(() => knowledgeService.listDocuments(), [])
  const websites = useAsync(() => knowledgeService.listWebsiteSources(), [])

  const setField = (key) => (e) => business.setData((prev) => ({ ...prev, [key]: e.target.value }))

  const saveBusiness = async () => {
    setSaving(true)
    try {
      await businessService.updateBusiness(business.data)
      await aiService.retrain()
      toast.success('Business knowledge saved — the AI has been retrained.')
    } finally {
      setSaving(false)
    }
  }

  const upload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      documents.setData(await knowledgeService.uploadDocument(file))
    }
    toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded and queued for processing.`)
    event.target.value = ''
  }

  const importWebsite = async () => {
    if (!websiteUrl.trim()) return
    setImporting(true)
    try {
      websites.setData(await knowledgeService.importWebsite(websiteUrl.trim()))
      setWebsiteUrl('')
      toast.success('Import started — pages will appear once they are indexed.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="AI Training"
        description="Everything your AI receptionist knows about your business lives here."
        actions={
          <>
            <Button as={Link} to="/app/ai-training/prompts" variant="secondary" size="sm">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Prompt configuration
            </Button>
            <Button as={Link} to="/app/knowledge-base" size="sm">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Knowledge base
            </Button>
          </>
        }
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" />

      {tab === 'knowledge' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              icon={Brain}
              title="Business information"
              description="The AI introduces itself with this and uses it to answer general questions."
            />
            <CardBody>
              {business.loading && <div className="h-64 animate-pulse rounded-xl bg-slate-100" />}
              {business.error && <ErrorState onRetry={business.reload} />}
              {business.data && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Business name" value={business.data.name} onChange={setField('name')} />
                  <Input label="Business type" value={business.data.type} onChange={setField('type')} />
                  <Textarea
                    className="sm:col-span-2"
                    label="Business description"
                    rows={4}
                    value={business.data.description}
                    onChange={setField('description')}
                    help="Describe what you offer, who you serve and anything that makes you different."
                  />
                  <Input label="Website" value={business.data.website || ''} onChange={setField('website')} />
                  <Input label="Email" value={business.data.email} onChange={setField('email')} />
                  <Input label="Phone" value={business.data.phone} onChange={setField('phone')} />
                  <Input label="Address" value={business.data.address} onChange={setField('address')} />
                </div>
              )}
            </CardBody>
            <CardFooter>
              <Button as="button" size="sm" loading={saving} onClick={saveBusiness}>
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save and retrain
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader title="Services and pricing" description="Quoted by the AI exactly as written here." />
            <CardBody>
              <CrudList
                items={services.data || []}
                addLabel="Add service"
                emptyIcon={Database}
                fields={[
                  { key: 'name', label: 'Name' },
                  { key: 'price', label: 'Price', type: 'number' },
                  { key: 'unit', label: 'Unit', placeholder: 'per night' },
                  { key: 'description', label: 'Description', type: 'textarea' },
                ]}
                renderMeta={(item) => (item.price ? <Badge tone="brand" size="sm">{item.price} {item.unit}</Badge> : null)}
                onCreate={async (item) => services.setData(await businessService.create('services', item))}
                onUpdate={async (id, patch) => services.setData(await businessService.update('services', id, patch))}
                onDelete={async (id) => services.setData(await businessService.remove('services', id))}
                onToggle={async (id, active) => services.setData(await businessService.update('services', id, { active }))}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Products and extras" />
            <CardBody>
              <CrudList
                items={products.data || []}
                addLabel="Add product"
                emptyIcon={Database}
                fields={[
                  { key: 'name', label: 'Name' },
                  { key: 'price', label: 'Price', type: 'number' },
                  { key: 'unit', label: 'Unit' },
                  { key: 'description', label: 'Description', type: 'textarea' },
                ]}
                renderMeta={(item) => (item.price ? <Badge tone="brand" size="sm">{item.price} {item.unit}</Badge> : null)}
                onCreate={async (item) => products.setData(await businessService.create('products', item))}
                onUpdate={async (id, patch) => products.setData(await businessService.update('products', id, patch))}
                onDelete={async (id) => products.setData(await businessService.remove('products', id))}
                onToggle={async (id, active) => products.setData(await businessService.update('products', id, { active }))}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Policies and FAQs" />
            <CardBody>
              <CrudList
                items={policies.data || []}
                titleKey="title"
                bodyKey="body"
                addLabel="Add policy"
                emptyIcon={Database}
                fields={[
                  { key: 'title', label: 'Title' },
                  { key: 'body', label: 'Details', type: 'textarea', rows: 4 },
                ]}
                onCreate={async (item) => policies.setData(await businessService.create('policies', item))}
                onUpdate={async (id, patch) => policies.setData(await businessService.update('policies', id, patch))}
                onDelete={async (id) => policies.setData(await businessService.remove('policies', id))}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Booking rules" description="Constraints the AI must respect when taking a booking." />
            <CardBody>
              <CrudList
                items={bookingRules.data || []}
                titleKey="title"
                bodyKey="body"
                addLabel="Add rule"
                emptyIcon={Database}
                fields={[
                  { key: 'title', label: 'Title' },
                  { key: 'body', label: 'Rule', type: 'textarea', rows: 3 },
                ]}
                onCreate={async (item) => bookingRules.setData(await businessService.create('bookingRules', item))}
                onUpdate={async (id, patch) => bookingRules.setData(await businessService.update('bookingRules', id, patch))}
                onDelete={async (id) => bookingRules.setData(await businessService.remove('bookingRules', id))}
                onToggle={async (id, active) => bookingRules.setData(await businessService.update('bookingRules', id, { active }))}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'documents' && (
        <Card>
          <CardHeader
            icon={FileText}
            title="Documents"
            description="PDF, DOC, DOCX, TXT and CSV files are read and indexed so the AI can quote them."
            action={
              <Button as="button" size="sm" onClick={() => fileRef.current?.click()}>
                <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
                Upload documents
              </Button>
            }
          />
          <CardBody>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv"
              onChange={upload}
              className="sr-only"
              aria-label="Upload documents"
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-8 text-center transition-colors hover:border-primary-400/40 hover:bg-primary-500/10"
            >
              <UploadCloud className="h-6 w-6 text-brand-500" aria-hidden="true" />
              <span className="mt-3 text-[0.88rem] font-semibold text-ink-900">Drop files here or click to upload</span>
              <span className="mt-1 text-[0.78rem] text-slate-500">PDF, DOC, DOCX, TXT or CSV · up to 20 MB each</span>
            </button>

            {documents.loading && <div className="mt-5 h-40 animate-pulse rounded-xl bg-slate-100" />}
            {documents.error && <ErrorState onRetry={documents.reload} />}

            {documents.data && documents.data.length === 0 && (
              <EmptyState
                compact
                className="mt-4"
                icon={FileText}
                title="No documents yet"
                description="Upload your first document to train your AI."
              />
            )}

            {documents.data && documents.data.length > 0 && (
              <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {documents.data.map((doc) => (
                  <li key={doc.id} className="flex flex-wrap items-center gap-3 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.85rem] font-semibold text-ink-900">{doc.name}</p>
                      <p className="text-[0.75rem] text-slate-500">
                        {doc.type} · {formatBytes(doc.size)} · uploaded {formatDate(doc.uploadedAt)}
                        {doc.pages ? ` · ${doc.pages} pages` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {doc.status === 'Processing' ? (
                        <Badge tone="info" size="sm">
                          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                          Processing
                        </Badge>
                      ) : (
                        <StatusBadge status={doc.status} size="sm" />
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          documents.setData(await knowledgeService.reprocessDocument(doc.id))
                          toast.success('Reprocessing started.')
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
                        aria-label={`Reprocess ${doc.name}`}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(doc)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${doc.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}

      {tab === 'website' && (
        <Card>
          <CardHeader
            icon={Globe}
            title="Website knowledge"
            description="Import pages from your site so the AI answers with the same wording your customers already read."
          />
          <CardBody>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                className="flex-1"
                label="Website URL"
                placeholder="https://yourbusiness.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <Button as="button" size="md" loading={importing} onClick={importWebsite}>
                Import Website
              </Button>
            </div>

            {websites.loading && <div className="mt-5 h-24 animate-pulse rounded-xl bg-slate-100" />}

            {websites.data && websites.data.length === 0 && (
              <EmptyState
                compact
                className="mt-4"
                icon={Globe}
                title="No website imported yet"
                description="Add your website address above and we will read the public pages."
              />
            )}

            {websites.data && websites.data.length > 0 && (
              <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {websites.data.map((site) => (
                  <li key={site.id} className="flex flex-wrap items-center gap-3 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                      <Globe className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.85rem] font-semibold text-ink-900">{site.url}</p>
                      <p className="text-[0.75rem] text-slate-500">
                        {site.pages} pages · imported {formatDate(site.importedAt)}
                      </p>
                    </div>
                    <StatusBadge status={site.status} size="sm" />
                    <button
                      type="button"
                      onClick={async () => {
                        websites.setData(await knowledgeService.removeWebsiteSource(site.id))
                        toast.success('Website source removed.')
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${site.url}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          documents.setData(await knowledgeService.deleteDocument(deleting.id))
          setDeleting(null)
          toast.success('Document deleted.')
        }}
        title="Delete this document?"
        description={`“${deleting?.name}” will be removed and the AI will stop using its contents.`}
        confirmLabel="Delete"
      />
    </>
  )
}
