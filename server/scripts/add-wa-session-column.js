require('dotenv').config()
const { Client } = require('pg')

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query('alter table whatsapp_connections add column if not exists session jsonb')
  const rows = await client.query(
    "select column_name from information_schema.columns where table_name = 'whatsapp_connections' order by ordinal_position",
  )
  console.log(rows.rows.map((row) => row.column_name).join(','))
  await client.end()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
