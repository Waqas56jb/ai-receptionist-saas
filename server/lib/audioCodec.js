function decodeMulawSample(mu) {
  mu = ~mu & 0xff
  const sign = mu & 0x80
  const exponent = (mu >> 4) & 0x07
  const mantissa = mu & 0x0f
  let sample = ((mantissa << 3) + 0x84) << exponent
  sample -= 0x84
  return sign ? -sample : sample
}

function encodeMulawSample(sample) {
  const CLIP = 32635
  let sign = 0
  if (sample < 0) {
    sign = 0x80
    sample = -sample
  }
  if (sample > CLIP) sample = CLIP
  sample += 0x84
  let exponent = 7
  for (let mask = 0x4000; exponent > 0 && !(sample & mask); exponent -= 1) mask >>= 1
  const mantissa = (sample >> (exponent + 3)) & 0x0f
  return ~(sign | (exponent << 4) | mantissa) & 0xff
}

function mulawToPcm16(buf) {
  const out = Buffer.alloc(buf.length * 2)
  for (let i = 0; i < buf.length; i += 1) out.writeInt16LE(decodeMulawSample(buf[i]), i * 2)
  return out
}

function pcm16ToMulaw(buf) {
  const count = Math.floor(buf.length / 2)
  const out = Buffer.alloc(count)
  for (let i = 0; i < count; i += 1) out[i] = encodeMulawSample(buf.readInt16LE(i * 2))
  return out
}

function upsample8kTo24k(pcm16) {
  const samples = Math.floor(pcm16.length / 2)
  const out = Buffer.alloc(samples * 3 * 2)
  for (let i = 0; i < samples; i += 1) {
    const a = pcm16.readInt16LE(i * 2)
    const b = i + 1 < samples ? pcm16.readInt16LE((i + 1) * 2) : a
    out.writeInt16LE(a, i * 6)
    out.writeInt16LE(((a * 2 + b) / 3) | 0, i * 6 + 2)
    out.writeInt16LE(((a + b * 2) / 3) | 0, i * 6 + 4)
  }
  return out
}

function downsample24kTo8k(pcm16) {
  const frames = Math.floor(pcm16.length / 6)
  const out = Buffer.alloc(frames * 2)
  for (let i = 0; i < frames; i += 1) {
    const a = pcm16.readInt16LE(i * 6)
    const b = pcm16.readInt16LE(i * 6 + 2)
    const c = pcm16.readInt16LE(i * 6 + 4)
    out.writeInt16LE(((a + b + c) / 3) | 0, i * 2)
  }
  return out
}

function twilioMulawToOpenAiPcm(base64Mulaw) {
  return upsample8kTo24k(mulawToPcm16(Buffer.from(base64Mulaw, 'base64')))
}

function openAiPcmToTwilioMulaw(base64Pcm) {
  return pcm16ToMulaw(downsample24kTo8k(Buffer.from(base64Pcm, 'base64')))
}

module.exports = {
  twilioMulawToOpenAiPcm,
  openAiPcmToTwilioMulaw,
}
