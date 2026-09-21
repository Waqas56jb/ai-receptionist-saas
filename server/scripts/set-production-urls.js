const { spawnSync } = require('child_process')

const vars = [
  {
    project: 'ai-receptionist-saas-server',
    name: 'PUBLIC_API_URL',
    value: 'https://ai-receptionist-saas-server.vercel.app',
  },
  {
    project: 'ai-receptionist-saas-server',
    name: 'CLIENT_APP_URL',
    value: 'https://ai-receptionist-saas-nu.vercel.app',
  },
  {
    project: 'ai-receptionist-saas-server',
    name: 'CORS_ORIGINS',
    value: 'https://ai-receptionist-saas-nu.vercel.app,https://ai-receptionist-saas-admin-psi.vercel.app',
  },
  {
    project: 'ai-receptionist-saas',
    name: 'VITE_API_URL',
    value: 'https://ai-receptionist-saas-server.vercel.app/api',
  },
  {
    project: 'ai-receptionist-saas-admin',
    name: 'VITE_API_URL',
    value: 'https://ai-receptionist-saas-server.vercel.app/api',
  },
]

for (const item of vars) {
  const result = spawnSync(
    'npx',
    ['vercel', 'env', 'add', item.name, 'production', '--yes', '--force', '--value', item.value, '--project', item.project, '--scope', 'us-4e8d'],
    { stdio: 'inherit', shell: true },
  )
  if (result.status) process.exit(result.status)
}

console.log('production urls set')
