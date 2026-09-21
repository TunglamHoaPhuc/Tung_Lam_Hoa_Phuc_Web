'use client';

import { useEffect, useState } from 'react';

/**
 * 🪷 Hook đọc một collection JSON từ Backblaze B2 qua API công khai
 * GET /api/public/data/<key> (server đọc S3, có HTTP cache 15s).
 */
export function useS3Collection<T = any>(collection: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(
    fallback == null || (Array.isArray(fallback) && fallback.length === 0)
  );

  useEffect(() => {
    let alive = true;
    fetch(`/api/public/data/${collection}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (alive && json?.success && json.data != null) {
          setData(json.data as T);
        }
      })
      .catch(() => {
        // Giữ fallback khi S3/API không phản hồi
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [collection]);

  return { data, loading };
}