require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { sendWelcome } = require('../lib/mailer')

sendWelcome({
  to: process.env.MAIL_USER,
  name: 'DEVMARK',
  businessName: 'Mailer check',
})
  .then((result) => {
    console.log(result.ok ? 'test email sent' : 'test email skipped')
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
