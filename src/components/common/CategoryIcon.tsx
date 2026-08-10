'use client';

import React, { FC, ReactNode } from "react";
import {
  Heart,
  Sun,
  Compass,
  Flower2,
  Sparkles,
  BookOpen,
  Scroll,
  HandHeart,
  Landmark,
  Calendar,
  Volume2,
  Video,
  Tag,
  HelpCircle,
} from "lucide-react";
import { getCategoryInfo } from "@/data/taxonomy";

export interface CategoryIconProps {
  categoryName?: string;
  iconName?: string;
  iconUrl?: string; // WordPress CMS custom SVG/PNG image URL
  iconNode?: ReactNode;
  className?: string;
}

// Icon dictionary lookup map for Lucide iconName string
const LUCIDE_ICON_MAP: Record<string, FC<{ className?: string }>> = {
  Heart,
  Sun,
  Compass,
  Flower2,
  Sparkles,
  BookOpen,
  Scroll,
  HandHeart,
  Landmark,
  Calendar,
  Volume2,
  Video,
  Tag,
  HelpCircle,
};

/**
 * Flexible Category/Taxonomy Icon component ready for WordPress CMS integration.
 * Priority rendering:
 * 1. iconUrl: If WordPress CMS SVG/PNG URL exists -> renders <img src={iconUrl} />
 * 2. iconNode: If custom ReactNode provided -> renders iconNode
 * 3. iconName: If Lucide iconName string provided -> renders matched Lucide icon
 * 4. categoryName: If categoryName provided -> queries taxonomy mapping getCategoryInfo
 */
export function getCategory1Icon(
  categoryName?: string,
  iconUrl?: string,
  iconNode?: ReactNode,
  className: string = "w-3.5 h-3.5 text-[#F2C14E] shrink-0",
  iconName?: string
): ReactNode {
  // 1. WordPress CMS Custom Icon URL (SVG/PNG)
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={categoryName || "category icon"}
        className={`object-contain shrink-0 ${className}`}
      />
    );
  }

  // 2. Direct ReactNode Icon
  if (iconNode) {
    return iconNode;
  }

  // 3. Lucide Icon Name String
  if (iconName && LUCIDE_ICON_MAP[iconName]) {
    const DynamicIcon = LUCIDE_ICON_MAP[iconName];
    return <DynamicIcon className={className} />;
  }

  // 4. Taxonomy Name Lookup Fallback
  const { IconComponent, iconUrl: taxUrl } = getCategoryInfo(categoryName);
  if (taxUrl) {
    return (
      <img
        src={taxUrl}
        alt={categoryName || "category icon"}
        className={`object-contain shrink-0 ${className}`}
      />
    );
  }

  return <IconComponent className={className} />;
}

export const CategoryIcon: FC<CategoryIconProps> = ({
  categoryName,
  iconName,
  iconUrl,
  iconNode,
  className = "w-3.5 h-3.5 text-[#F2C14E] shrink-0",
}) => {
  return (
    <>
      {getCategory1Icon(categoryName, iconUrl, iconNode, className, iconName)}
    </>
  );
};

export default CategoryIcon;
