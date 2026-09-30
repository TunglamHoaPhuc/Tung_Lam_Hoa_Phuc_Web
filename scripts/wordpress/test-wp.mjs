import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const WP_BASE_URL = process.env.WP_ADMIN_BASE_URL || 'https://admin.tunglamhoaphuc.com';
const WP_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin_tunglam';
const WP_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'suXWb3nIwNH@B1zshdC#kDrL';

async function testWp() {
  const params = new URLSearchParams();
  params.append('log', WP_USERNAME);
  params.append('pwd', WP_PASSWORD);
  params.append('wp-submit', 'Đăng nhập');
  params.append('redirect_to', `${WP_BASE_URL}/wp-admin/`);
  params.append('testcookie', '1');

  const loginRes = await fetch(`${WP_BASE_URL}/wp-login.php`, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'wordpress_test_cookie=WP%20Cookie%20check',
    },
    body: params.toString(),
    redirect: 'manual'
  });

  const rawCookies = typeof loginRes.headers.getSetCookie === 'function'
    ? loginRes.headers.getSetCookie()
    : [loginRes.headers.get('set-cookie') || ''];

  const cookieHeader = rawCookies
    .filter(Boolean)
    .map(c => c.split(';')[0])
    .join('; ');

  console.log('Login status:', loginRes.status);
  console.log('Has logged_in cookie:', cookieHeader.includes('wordpress_logged_in_'));

  const adminRes = await fetch(`${WP_BASE_URL}/wp-admin/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Cookie: cookieHeader,
    }
  });
  const html = await adminRes.text();
  const matchNonce = html.match(/wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"/);
  console.log('Nonce from wp-admin:', matchNonce ? matchNonce[1] : 'NOT FOUND');

  if (matchNonce) {
    const nonce = matchNonce[1];
    const postRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({ title: 'Test post', status: 'draft' })
    });
    console.log('POST status:', postRes.status);
    const postText = await postRes.text();
    console.log('POST response:', postText.substring(0, 300));
  }
}
testWp();
