import { loadServerlessJsonAsync, saveServerlessJson } from './serverless-db';

export interface PendingSyncTask {
  id: string; // unique task id
  action: 'create_wp_post' | 'update_wp_post' | 'delete_wp_post' | 'sync_from_wp';
  entityId: string; // post ID in Next.js or wpPostId
  payload?: any;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncHistoryEvent {
  eventId: string;
  source: 'nextjs' | 'wordpress';
  entityId: string;
  timestamp: number;
}

const SYNC_QUEUE_CONFIG = {
  fileName: 'sync-pending-queue.json',
  localRelativePath: 'src/data/sync-pending-queue.json',
  s3Key: 'tunglamhoaphuc2/database/sync-pending-queue.json',
  defaultData: [] as PendingSyncTask[],
};

// In-memory debounce / loop-breaker tracker (TTL: 60s)
const recentSyncEvents = new Map<string, { source: string; timestamp: number }>();
const processedWebhookEventIds = new Set<string>();

/**
 * 🛡️ Ghi nhận task đồng bộ bị lỗi vào hàng đợi để retry
 */
export async function enqueueSyncTask(
  action: PendingSyncTask['action'],
  entityId: string,
  payload?: any,
  lastError?: string
): Promise<PendingSyncTask> {
  const queue = await loadServerlessJsonAsync<PendingSyncTask[]>(SYNC_QUEUE_CONFIG);
  
  // Nếu đã có task cùng action và entityId, cập nhật payload và lỗi
  const existingIdx = queue.findIndex((t) => t.action === action && t.entityId === entityId);
  const now = new Date().toISOString();

  let task: PendingSyncTask;
  if (existingIdx !== -1) {
    task = {
      ...queue[existingIdx],
      payload: payload ?? queue[existingIdx].payload,
      lastError,
      updatedAt: now,
    };
    queue[existingIdx] = task;
  } else {
    task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action,
      entityId,
      payload,
      retryCount: 0,
      maxRetries: 5,
      lastError,
      createdAt: now,
      updatedAt: now,
    };
    queue.push(task);
  }

  await saveServerlessJson<PendingSyncTask[]>(SYNC_QUEUE_CONFIG, queue);
  return task;
}

/**
 * 🛡️ Lấy danh sách hàng đợi các task đồng bộ thất bại
 */
export async function getPendingSyncTasks(): Promise<PendingSyncTask[]> {
  return loadServerlessJsonAsync<PendingSyncTask[]>(SYNC_QUEUE_CONFIG);
}

/**
 * 🛡️ Xóa task khỏi hàng đợi sau khi retry thành công
 */
export async function removeSyncTask(taskId: string): Promise<void> {
  const queue = await loadServerlessJsonAsync<PendingSyncTask[]>(SYNC_QUEUE_CONFIG);
  const filtered = queue.filter((t) => t.id !== taskId);
  if (filtered.length !== queue.length) {
    await saveServerlessJson<PendingSyncTask[]>(SYNC_QUEUE_CONFIG, filtered);
  }
}

/**
 * 🛡️ Đánh dấu nguồn thay đổi vừa thực hiện để chống vòng lặp phản hồi (Loop Prevention)
 */
export function markRecentSync(entityId: string, source: 'nextjs' | 'wordpress'): void {
  const key = `${source}:${entityId}`;
  recentSyncEvents.set(key, { source, timestamp: Date.now() });

  // Cleanup sau 60 giây
  setTimeout(() => {
    recentSyncEvents.delete(key);
  }, 60000);
}

/**
 * 🛡️ Kiểm tra xem sự kiện đồng bộ này có phải là loop phản hồi từ chính mình vừa gửi không
 */
export function isRecentSyncLoop(entityId: string, incomingSource: 'nextjs' | 'wordpress'): boolean {
  // Nếu incoming là wordpress, kiểm tra xem Next.js có vừa cập nhật entity này trong vòng 45s qua không
  const oppositeSource = incomingSource === 'wordpress' ? 'nextjs' : 'wordpress';
  const oppositeKey = `${oppositeSource}:${entityId}`;
  const existing = recentSyncEvents.get(oppositeKey);

  if (existing && Date.now() - existing.timestamp < 45000) {
    return true; // Vòng lặp phản xạ! Bỏ qua
  }
  return false;
}

/**
 * 🛡️ Chống trùng lặp Webhook (Idempotency Key)
 */
export function isDuplicateWebhookEvent(eventId: string): boolean {
  if (!eventId) return false;
  if (processedWebhookEventIds.has(eventId)) {
    return true;
  }
  processedWebhookEventIds.add(eventId);
  // Dọn dẹp sau 30 phút
  setTimeout(() => {
    processedWebhookEventIds.delete(eventId);
  }, 30 * 60 * 1000);
  return false;
}
