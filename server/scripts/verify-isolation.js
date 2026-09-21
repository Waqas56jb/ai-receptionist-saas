require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
const anon = process.env.SUPABASE_ANON_KEY

if (!url || !secret) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const pub = anon ? createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } }) : null

async function main() {
  const service = await admin.from('accounts').select('id').limit(1)
  if (service.error) throw new Error(`Service role cannot read accounts: ${service.error.message}`)
  console.log('Service role can reach tenant tables')

  if (pub) {
    const blocked = await pub.from('accounts').select('id,email,password_hash').limit(5)
    const blockedKb = await pub.from('knowledge_items').select('id,title,body').limit(5)
    const anonSawAccounts = (blocked.data || []).length
    const anonSawKnowledge = (blockedKb.data || []).length
    if (!blocked.error && anonSawAccounts > 0) {
      throw new Error('Publishable key can read accounts — RLS is not blocking clients')
    }
    if (!blockedKb.error && anonSawKnowledge > 0) {
      throw new Error('Publishable key can read knowledge — RLS is not blocking clients')
    }
    console.log('Publishable key is blocked from tenant tables')
  }

  const stamp = Date.now().toString(36)
  const a = {
    id: `acc_iso_a_${stamp}`,
    name: 'Isolation A',
    email: `iso-a-${stamp}@example.test`,
    password_hash: 'x',
    business_name: 'Business A',
  }
  const b = {
    id: `acc_iso_b_${stamp}`,
    name: 'Isolation B',
    email: `iso-b-${stamp}@example.test`,
    password_hash: 'x',
    business_name: 'Business B',
  }
  const { error: accError } = await admin.from('accounts').insert([a, b])
  if (accError) throw new Error(`Could not insert test accounts: ${accError.message}`)

  const { error: kbError } = await admin.from('knowledge_items').insert([
    { id: `kb_iso_a_${stamp}`, account_id: a.id, title: 'A secret hours', body: 'Business A opens at 08:00', status: 'Active' },
    { id: `kb_iso_b_${stamp}`, account_id: b.id, title: 'B secret hours', body: 'Business B opens at 22:00', status: 'Active' },
  ])
  if (kbError) throw new Error(`Could not insert test knowledge: ${kbError.message}`)

  const aRows = await admin.from('knowledge_items').select('title,body').eq('account_id', a.id)
  const bRows = await admin.from('knowledge_items').select('title,body').eq('account_id', b.id)
  const aHasB = (aRows.data || []).some((row) => String(row.body || '').includes('Business B'))
  const bHasA = (bRows.data || []).some((row) => String(row.body || '').includes('Business A'))
  if (aHasB || bHasA) throw new Error('Account-scoped knowledge query leaked another tenant')
  if ((aRows.data || []).length !== 1 || (bRows.data || []).length !== 1) {
    throw new Error('Account-scoped knowledge counts are wrong')
  }
  console.log('Knowledge rows stay on their own account_id')

  await admin.from('knowledge_items').delete().in('id', [`kb_iso_a_${stamp}`, `kb_iso_b_${stamp}`])
  await admin.from('accounts').delete().in('id', [a.id, b.id])
  console.log('Isolation checks passed')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
