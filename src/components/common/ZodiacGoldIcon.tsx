import React, { FC } from 'react';

interface ZodiacGoldIconProps {
  sign: string; // TÝ, SỬU, DẦN, MÃO, THÌN, TỲ, NGỌ, MÙI, THÂN, DẬU, TUẤT, HỢI
  className?: string;
}

export const ZodiacGoldIcon: FC<ZodiacGoldIconProps> = ({ sign, className = "w-5 h-5 text-[#F2C14E] inline-block" }) => {
  const normSign = (sign || '').toUpperCase().trim();

  // Vector Badge based on Zodiac Sign
  return (
    <span className={`inline-flex items-center justify-center font-bold px-1.5 py-0.5 rounded bg-[#F2C14E]/15 border border-[#F2C14E]/50 text-[#F2C14E] text-[11px] leading-none shadow-[0_0_8px_rgba(242,193,78,0.3)] ${className}`}>
      {normSign.includes('TÝ') && '🐭 TÝ'}
      {normSign.includes('SỬU') && '🐂 SỬU'}
      {normSign.includes('DẦN') && '🐅 DẦN'}
      {normSign.includes('MÃO') && '🐈 MÃO'}
      {normSign.includes('THÌN') && '🐉 THÌN'}
      {normSign.includes('TỲ') && '🐍 TỲ'}
      {normSign.includes('NGỌ') && '🐎 NGỌ'}
      {normSign.includes('MÙI') && '🐐 MÙI'}
      {normSign.includes('THÂN') && '🐒 THÂN'}
      {normSign.includes('DẬU') && '🐓 DẬU'}
      {normSign.includes('TUẤT') && '🐕 TUẤT'}
      {normSign.includes('HỢI') && '🐖 HỢI'}
      {!['TÝ', 'SỬU', 'DẦN', 'MÃO', 'THÌN', 'TỲ', 'NGỌ', 'MÙI', 'THÂN', 'DẬU', 'TUẤT', 'HỢI'].some(s => normSign.includes(s)) && '✨'}
    </span>
  );
};
