'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostFormEditor } from '@/components/admin/PostFormEditor';
import { PostRecord } from '@/app/api/admin/posts/route';
import { RefreshCw } from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<PostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/posts/${id}`);
        const data = await res.json();
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setError(data.error || 'Không tìm thấy bài viết');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#F2C14E] space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#1C120A] border border-red-500/30 rounded-2xl p-10 text-center space-y-3">
        <h3 className="text-lg text-red-400 font-bold">Lỗi: {error || 'Không tìm thấy bài viết'}</h3>
      </div>
    );
  }

  return <PostFormEditor initialData={post} isEditing={true} />;
}
