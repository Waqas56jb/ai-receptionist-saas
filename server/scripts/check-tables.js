require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { Client } = require('pg')

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  const tables = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('account_settings','widget_connections','knowledge_items','conversations','messages','whatsapp_connections')
    order by table_name
  `)
  const columns = await client.query(`
    select column_name
    from information_schema.columns
    where table_name = 'messages' and column_name in ('channel','visitor_key')
    order by column_name
  `)
  console.log(JSON.stringify({ tables: tables.rows.map((row) => row.table_name), messageColumns: columns.rows.map((row) => row.column_name) }))
  await client.end()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
