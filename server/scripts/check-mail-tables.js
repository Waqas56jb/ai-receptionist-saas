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
      and table_name in ('email_otps','password_resets','account_sessions','login_events','account_settings')
    order by 1
  `)
  const column = await client.query(`
    select column_name
    from information_schema.columns
    where table_name = 'accounts' and column_name = 'two_factor'
  `)
  console.log('tables', tables.rows.map((row) => row.table_name).join(',') || '(none)')
  console.log('two_factor', column.rows.length ? 'yes' : 'no')
  await client.end()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
