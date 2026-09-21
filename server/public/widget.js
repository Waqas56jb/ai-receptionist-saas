(function () {
  var script = document.currentScript
  if (!script) return
  var token = script.getAttribute('data-widget')
  if (!token) return
  var origin
  try {
    origin = new URL(script.src).origin
  } catch {
    return
  }

  var iframe = document.createElement('iframe')
  iframe.src = origin + '/widget/' + encodeURIComponent(token)
  iframe.title = 'Website chat'
  iframe.setAttribute('allow', 'microphone; autoplay; clipboard-write')
  iframe.style.cssText =
    'position:fixed;right:16px;bottom:16px;width:80px;height:80px;border:0;z-index:2147483647;background:transparent;overflow:hidden;'

  function applySize(payload) {
    var open = Boolean(payload && payload.open)
    var voice = Boolean(payload && payload.voice)
    var mobile = window.innerWidth < 480
    if (open) {
      iframe.style.width = mobile ? 'calc(100vw - 16px)' : voice ? '400px' : '380px'
      iframe.style.height = mobile ? 'min(720px, calc(100vh - 16px))' : voice ? '640px' : '560px'
      iframe.style.right = mobile ? '8px' : '16px'
      iframe.style.bottom = mobile ? '8px' : '16px'
    } else {
      iframe.style.width = '80px'
      iframe.style.height = '80px'
      iframe.style.right = '16px'
      iframe.style.bottom = '16px'
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== origin) return
    if (event.data && event.data.type === 'dm-widget-resize') applySize(event.data)
  })

  if (document.body) document.body.appendChild(iframe)
  else document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(iframe) })
})()
