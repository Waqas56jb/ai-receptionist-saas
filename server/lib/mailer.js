const nodemailer = require('nodemailer')

const FROM = process.env.MAIL_FROM || `DEVMARK <${process.env.MAIL_USER || 'noreply@localhost'}>`

function transport() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return null
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 465),
    secure: String(process.env.MAIL_SECURE || 'true') !== 'false',
    auth: {
      user: process.env.MAIL_USER,
      pass: String(process.env.MAIL_PASS).replace(/\s+/g, ''),
    },
  })
}

function layout(title, body) {
  return `<!doctype html>
<html>
<body style="margin:0;background:#f4f7f6;font-family:Arial,sans-serif;color:#12352d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d7e4df;">
        <tr><td style="background:#0f3d34;color:#ffffff;padding:22px 28px;font-size:20px;font-weight:700;">DEVMARK Receptionist</td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 12px;font-size:22px;">${title}</h1>
          <div style="font-size:15px;line-height:1.6;color:#35574e;">${body}</div>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f4f7f6;font-size:12px;color:#6b817a;">This email was sent for your DEVMARK account. If you did not request it, you can ignore it.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function sendMail({ to, subject, title, html, text }) {
  const mailer = transport()
  const payload = {
    from: FROM,
    to,
    subject,
    text: text || title,
    html: html || layout(title, text || ''),
  }
  if (!mailer) {
    console.warn('Mailer not configured — email skipped:', subject, to)
    return { skipped: true }
  }
  await mailer.sendMail(payload)
  return { ok: true }
}

async function sendWelcome({ to, name, businessName }) {
  const who = name || 'there'
  return sendMail({
    to,
    subject: `Welcome to DEVMARK, ${who}`,
    title: 'Congratulations — your account is ready',
    text: `Hi ${who}, your AI receptionist account for ${businessName || 'your business'} is live. Sign in to train knowledge, connect WhatsApp and embed the website widget.`,
    html: layout(
      'Congratulations — your account is ready',
      `<p>Hi ${who},</p>
       <p>Your AI receptionist for <strong>${businessName || 'your business'}</strong> is now active.</p>
       <p>Next steps:</p>
       <ul>
         <li>Add your knowledge base</li>
         <li>Connect WhatsApp</li>
         <li>Embed the website widget</li>
       </ul>
       <p>You can sign in any time with this email address.</p>`,
    ),
  })
}

async function sendResetLink({ to, name, link }) {
  return sendMail({
    to,
    subject: 'Reset your DEVMARK password',
    title: 'Reset your password',
    text: `Hi ${name || 'there'}, use this link within 30 minutes to choose a new password: ${link}`,
    html: layout(
      'Reset your password',
      `<p>Hi ${name || 'there'},</p>
       <p>We received a request to reset the password for this account.</p>
       <p><a href="${link}" style="display:inline-block;background:#0f3d34;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">Choose a new password</a></p>
       <p>This link expires in 30 minutes. If you did not ask for this, you can ignore the email.</p>`,
    ),
  })
}

async function sendOtp({ to, name, code, reason }) {
  return sendMail({
    to,
    subject: `Your DEVMARK verification code is ${code}`,
    title: 'Your verification code',
    text: `Hi ${name || 'there'}, your ${reason} code is ${code}. It expires in 10 minutes.`,
    html: layout(
      'Your verification code',
      `<p>Hi ${name || 'there'},</p>
       <p>Use this code to ${reason}:</p>
       <p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#0f3d34;margin:18px 0;">${code}</p>
       <p>This code expires in 10 minutes. Do not share it with anyone.</p>`,
    ),
  })
}

async function sendTeamInvite({ to, name, businessName, role }) {
  return sendMail({
    to,
    subject: `You were invited to ${businessName || 'a DEVMARK account'}`,
    title: 'Team invitation',
    text: `${name || 'A teammate'} invited you to ${businessName || 'a business'} on DEVMARK as ${role}.`,
    html: layout(
      'You have been invited',
      `<p>You were added to <strong>${businessName || 'a business'}</strong> as <strong>${role}</strong>.</p>
       <p>Ask the owner to share the sign-in details if you do not already have an account.</p>`,
    ),
  })
}

module.exports = { sendMail, sendWelcome, sendResetLink, sendOtp, sendTeamInvite }
