import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const WP_BASE_URL = process.env.WP_ADMIN_BASE_URL || 'https://admin.tunglamhoaphuc.com';
const WP_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin_tunglam';
const WP_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'suXWb3nIwNH@B1zshdC#kDrL';

async function testBasicAuth() {
  const token = Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64');
  console.log('Testing Basic Auth with WP_PASSWORD...');
  const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/users/me`, {
    headers: {
      'Authorization': `Basic ${token}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });
  console.log('Basic Auth status:', res.status);
  const text = await res.text();
  console.log('Response:', text.substring(0, 300));
}

testBasicAuth();
