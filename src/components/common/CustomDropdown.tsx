'use client';

import React, { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  id: string;
  name: string;
}

export interface CustomDropdownProps {
  labelPrefix?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  panelWidthClass?: string;
}

export const CustomDropdown: FC<CustomDropdownProps> = ({
  labelPrefix,
  value,
  options,
  onChange,
  placeholder = 'Tất cả',
  className = '',
  panelWidthClass = 'min-w-[220px]',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);
  const displayText = selectedOption ? selectedOption.name : placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative select-none ${className}`}>
      {/* Trigger Button with Warm Gradient & Gold Hover */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="appearance-none bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 hover:border-[#F2C14E] rounded-xl px-3.5 py-1.5 pr-8 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(242,193,78,0.25)] flex items-center justify-between gap-2 shrink-0 group shadow-sm w-full"
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
      >
        <span className="truncate max-w-[200px]">
          {labelPrefix ? `${labelPrefix}: ` : ''}
          <span className="font-semibold text-white group-hover:text-[#FFE5A3]">{displayText}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#F2C14E] transition-transform duration-300 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Flyout Menu Panel with Gradient, Soft Dividers and Gold-Brown Hover */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 z-50 ${panelWidthClass} max-h-[320px] overflow-y-auto rounded-xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#2F1F15]/98 via-[#23150D]/98 to-[#160C07]/98 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-1.5 scrollbar-thin scrollbar-thumb-[#F2C14E]/40 animate-in fade-in zoom-in-95 duration-150`}
        >
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between border-b border-[#F2C14E]/10 last:border-b-0 ${
                  isSelected
                    ? 'bg-[#5C3F28]/80 text-[#FFE5A3] font-bold border-l-2 border-l-[#F2C14E]'
                    : 'text-[#e3d2c1] hover:bg-gradient-to-r hover:from-[#5C3F28] hover:to-[#3E2919] hover:text-[#FFE5A3] hover:translate-x-1'
                }`}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span className="truncate">{opt.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#F2C14E] shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
