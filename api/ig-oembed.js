export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const appId = process.env.FB_APP_ID;
    const appSecret = process.env.FB_APP_SECRET;
    if (!appId || !appSecret) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const endpoint = new URL('https://graph.facebook.com/v19.0/instagram_oembed');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('access_token', `${appId}|${appSecret}`);
    endpoint.searchParams.set('omitscript', 'true');
    endpoint.searchParams.set('maxwidth', '540');

    const r = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    const data = await r.json();

    if (!r.ok) return res.status(r.status).json({ error: data?.error || data });

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error' });
  }
}
