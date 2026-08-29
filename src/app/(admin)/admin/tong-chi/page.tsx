'use client';

import React from 'react';
import { SpreadsheetTongChi } from '@/components/admin/SpreadsheetTongChi';

export default function AdminTongChiListPage() {
  return (
    <div className="w-full">
      {/* EXCEL SPREADSHEET VIEW */}
      <SpreadsheetTongChi />
    </div>
  );
}
