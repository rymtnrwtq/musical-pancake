addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Прокси: берём URL из параметра `url`,
 * фетчим его, добавляем CORS‑заголовок и возвращаем.
 */
async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')
  if (!target) {
    console.log('❌ Нет параметра url')
    return new Response('Missing url parameter', { status: 400 })
  }

  console.log('➡️ Fetching target:', target)
  let res
  try {
    res = await fetch(target)
  } catch (err) {
    console.error('⚠️ Fetch error:', err)
    return new Response('Error fetching target', { status: 502 })
  }

  // Копируем оригинальные заголовки и добавляем CORS
  const headers = new Headers(res.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', '*')
  console.log(`✅ Responding with status ${res.status}`)
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers
  })
}
