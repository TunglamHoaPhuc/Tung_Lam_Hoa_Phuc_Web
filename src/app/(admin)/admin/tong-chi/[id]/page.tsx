'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { TongChiEditor } from '@/components/admin/TongChiEditor';

export default function EditTongChiArticlePage() {
  const params = useParams();
  const rawId = params?.id;
  const id = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : '';

  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/tong-chi/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setArticle(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#c9b896]/70">
        Đang tải thông tin bài viết...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-12 text-center text-xs text-red-400">
        Không tìm thấy bài viết yêu cầu.
      </div>
    );
  }

  return <TongChiEditor initialData={article} isEdit={true} />;
}
