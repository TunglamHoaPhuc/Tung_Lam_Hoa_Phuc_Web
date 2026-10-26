/**
 * 🧪 BỘ KIỂM THỬ TOÀN DIỆN ĐỒNG BỘ HAI CHIỀU WORDPRESS - NEXT.JS
 * Chạy trực tiếp qua: node scripts/test-two-way-sync.mjs
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${detail}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ ĐỒNG BỘ HAI CHIỀU WORDPRESS - NEXT.JS');
  console.log('====================================================\n');

  // Test 1: Kiểm tra cấu hình môi trường không hard-code credentials
  const envConfigModule = await import('../src/lib/env-config.ts');
  const s3Config = envConfigModule.getS3Config(false);
  assert(
    s3Config !== null && s3Config.bucketName === 'media-tunglamhoaphuc',
    'Test 1.1: getS3Config() đọc đúng cấu hình từ môi trường hoặc .env.local',
    JSON.stringify(s3Config)
  );

  const wpConfig = envConfigModule.getWpConfig(false);
  assert(
    wpConfig.baseUrl === 'https://admin.tunglamhoaphuc.com',
    'Test 1.2: getWpConfig() đọc đúng WP_ADMIN_BASE_URL',
    wpConfig.baseUrl
  );

  // Test 2: Kiểm tra Auth Guard (Bảo vệ API CUD)
  const authGuardModule = await import('../src/lib/auth-guard.ts');
  const mockUnauthReq = new Request('http://localhost:3000/api/admin/posts', {
    method: 'POST',
    headers: {},
  });
  const unauthCheck = authGuardModule.checkAdminAuth(mockUnauthReq);
  assert(
    unauthCheck.authorized === false,
    'Test 2.1: Request không có cookie/token bị từ chối 401 Unauthorized'
  );

  const mockAuthReq = new Request('http://localhost:3000/api/admin/posts', {
    method: 'POST',
    headers: {
      cookie: 'admin_auth=true',
    },
  });
  const authCheck = authGuardModule.checkAdminAuth(mockAuthReq);
  assert(
    authCheck.authorized === true,
    'Test 2.2: Request có cookie admin_auth=true được cho phép thực thi'
  );

  // Test 3: Chống vòng lặp đồng bộ (Loop Prevention) & Chống trùng Webhook (Idempotency)
  const syncQueueModule = await import('../src/lib/sync-queue.ts');
  const testEntityId = `test-post-${Date.now()}`;

  // Đánh dấu Next.js vừa sync sang WP
  syncQueueModule.markRecentSync(testEntityId, 'nextjs');

  // WordPress bắn ngược webhook lại ngay sau đó
  const isLoop = syncQueueModule.isRecentSyncLoop(testEntityId, 'wordpress');
  assert(
    isLoop === true,
    'Test 3.1: Phát hiện và chặn đứng vòng lặp phản xạ từ WordPress khi Next.js vừa gửi sang'
  );

  const eventId = `evt-${Date.now()}`;
  const firstCheck = syncQueueModule.isDuplicateWebhookEvent(eventId);
  const secondCheck = syncQueueModule.isDuplicateWebhookEvent(eventId);
  assert(
    firstCheck === false && secondCheck === true,
    'Test 3.2: Chống gửi lặp Webhook (Idempotency) - Bỏ qua lần gửi thứ hai'
  );

  // Test 4: Gutenberg Block Converter (Chuyển đổi nội dung chuẩn xác sang WP Gutenberg)
  const wpAdminClient = await import('../src/lib/wp-admin-client.ts');
  const testHtml = '### Tiêu đề phụ\n\nNội dung đoạn văn.\n\n> Lời dạy trích dẫn';
  const gutenbergBlocks = wpAdminClient.convertToGutenbergBlocks(testHtml);
  assert(
    gutenbergBlocks.includes('<!-- wp:heading') &&
    gutenbergBlocks.includes('<!-- wp:paragraph') &&
    gutenbergBlocks.includes('<!-- wp:quote'),
    'Test 4.1: Chuyển đổi đầy đủ Markdown/HTML sang các khối WordPress Gutenberg chuẩn'
  );

  // Test 5: Chuẩn hóa ngày xuất bản sang múi giờ Việt Nam (UTC+7)
  const formattedDate = wpAdminClient.formatWpDate('2026-10-24');
  assert(
    formattedDate.startsWith('2026-10-24T'),
    'Test 5.1: Chuẩn hóa ngày YYYY-MM-DD sang định dạng WordPress ISO 8601 (UTC+7)',
    formattedDate
  );

  // Test 6: Retry Queue cho các tác vụ đồng bộ thất bại
  const enqueued = await syncQueueModule.enqueueSyncTask(
    'delete_wp_post',
    '999999',
    null,
    'Simulated network timeout'
  );
  assert(
    enqueued.id && enqueued.action === 'delete_wp_post' && enqueued.entityId === '999999',
    'Test 6.1: Đưa tác vụ thất bại vào hàng đợi pending retry an toàn'
  );

  await syncQueueModule.removeSyncTask(enqueued.id);
  const pendingAfterRemove = await syncQueueModule.getPendingSyncTasks();
  assert(
    !pendingAfterRemove.some((t) => t.id === enqueued.id),
    'Test 6.2: Xóa tác vụ thành công sau khi retry hoàn tất'
  );

  // Test 7: Kiểm tra an toàn sao lưu dữ liệu (Data Backup Integrity)
  const backupPostPath = path.resolve(process.cwd(), 'src/data/backups/posts-database.backup.json');
  assert(
    fs.existsSync(backupPostPath) && fs.statSync(backupPostPath).size > 1000,
    'Test 7.1: Bản sao lưu dữ liệu gốc posts-database.backup.json được tạo an toàn'
  );

  console.log('\n====================================================');
  console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passed} PASSED / ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});
