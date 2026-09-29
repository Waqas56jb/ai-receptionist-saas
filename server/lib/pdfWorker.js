// Parses one PDF off the main thread. Some PDFs make pdf-parse spin for minutes or balloon
// in memory; in a worker the API keeps serving and the parent can simply terminate us.
const { parentPort, workerData } = require('worker_threads')

let pdf
try {
  pdf = require('pdf-parse/lib/pdf-parse.js')
} catch {
  pdf = require('pdf-parse')
}

pdf(Buffer.from(workerData.buffer))
  .then((parsed) => parentPort.postMessage({ text: String(parsed.text || ''), pages: parsed.numpages || 0 }))
  .catch((error) => parentPort.postMessage({ error: error.message || 'PDF parse failed' }))
