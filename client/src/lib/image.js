/**
 * Shrinks a phone photo before upload: a 4–12 MB camera image becomes a ~0.3–0.8 MB JPEG
 * that still reads fine for text extraction. Anything the browser cannot decode (HEIC on
 * some phones, SVG, GIF) or that is already small is returned unchanged.
 */
export async function compressImage(file, { maxSide = 2000, quality = 0.82, minBytes = 900 * 1024 } = {}) {
  if (!file?.type?.startsWith('image/') || file.size < minBytes || /svg|gif/i.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file
    const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified })
  } catch {
    return file
  }
}

export default compressImage
