require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8')
const urls = [process.env.DATABASE_DIRECT_URL, process.env.DATABASE_URL].filter(Boolean)

async function apply(url) {
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query(sql)
  const tables = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('accounts','admins','knowledge_items','conversations','messages','whatsapp_connections')
    order by table_name
  `)
  await client.end()
  return tables.rows.map((row) => row.table_name)
}

async function main() {
  let lastError
  for (const url of urls) {
    try {
      const tables = await apply(url)
      console.log('Schema applied. Tables:', tables.join(', ') || '(none)')
      return
    } catch (error) {
      lastError = error
      console.error('Could not apply schema via', url.replace(/:[^:@/]+@/, ':****@'), error.message)
    }
  }
  throw lastError || new Error('No DATABASE_URL configured')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
