require('dotenv').config()
const { Client } = require('pg')
const { createClient } = require('@supabase/supabase-js')

const OWNER = process.env.TWILIO_OWNER_NUMBER || '+923107443144'
const BUSINESS = process.env.TWILIO_BUSINESS_NUMBER || '+25377492748'

async function main() {
  const pg = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await pg.connect()
  await pg.query("alter table account_settings add column if not exists voice jsonb default '{}'::jsonb")
  await pg.end()

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  await supabase.from('accounts').update({ phone: BUSINESS }).eq('id', 'acc_muc8evmomfe36h')

  const { data: accounts, error: accountError } = await supabase.from('accounts').select('id, email')
  if (accountError) throw accountError

  for (const account of accounts || []) {
    const { data: rows } = await supabase.from('account_settings').select('account_id, voice').eq('account_id', account.id)
    const current = rows?.[0]?.voice || {}
    const businessNumber = account.email === 'abdiqadirxassano@gmail.com' ? BUSINESS : current.businessNumber || OWNER
    const voice = { ...current, businessNumber, callerId: OWNER, enabled: true }
    if (rows?.[0]) {
      const { error } = await supabase
        .from('account_settings')
        .update({ voice, updated_at: new Date().toISOString() })
        .eq('account_id', account.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('account_settings').insert({
        account_id: account.id,
        voice,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
    }
    console.log('saved', account.email, businessNumber)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
