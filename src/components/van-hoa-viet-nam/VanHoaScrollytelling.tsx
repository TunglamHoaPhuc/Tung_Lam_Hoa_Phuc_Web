'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FileText, Menu, Play, Volume2, VolumeX, X } from 'lucide-react';
import {
  FULL_ESSAY_SECTIONS,
  MUSEUM_YOUTUBE_VIDEO,
  REFERENCE_BOOK,
  VAN_HOA_CHAPTERS,
  type StoryBeat,
  type VanHoaChapter,
} from '@/data/van-hoa-viet-nam-data';
import './van-hoa-story.css';

const TOTAL_CHAPTERS = VAN_HOA_CHAPTERS.length;

/**
 * Brand Guideline Editorial Inline Renderer:
 * Parses ***bold-italic gold***, **bold ivory**, and *italic* cleanly in UTM Avo
 * so citations, book titles, key heritage concepts, and emphasis follow publishing standards.
 */
function renderEditorialText(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('***') && token.endsWith('***') && token.length > 6) {
      // Use UTMAvoItalic (font-normal italic) in luminous gold instead of UTMAvoBoldItalic.ttf
      // because UTMAvoBoldItalic.ttf has a known font glyph bug dropping the circumflex on 'ậ' ("Nhật" -> "Nhạt")!
      return (
        <em key={idx} className="font-normal italic text-[#FFE8AE]">
          {token.slice(3, -3)}
        </em>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#FFF7E2]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={idx} className="italic text-[#F3E6CE]">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

/**
 * Balanced Two-Tier Typography Lockup:
 * - Top line: UTM Niagara (condensed gold display)
 * - Sub line: UTM ClassizismAntiqua (uppercase tracked)
 * Dynamically equalizes visual width of the two lines after font load & resize.
 */
function BalancedTitleLockup({
  top,
  sub,
  align = 'left',
  size = 'stage',
  staggerReveal = false,
}: {
  top: string;
  sub: string;
  align?: 'left' | 'center' | 'right';
  size?: 'stage' | 'intro';
  staggerReveal?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topMeasureRef = useRef<HTMLSpanElement | null>(null);
  const subMeasureRef = useRef<HTMLSpanElement | null>(null);

  const [topTrackingPx, setTopTrackingPx] = useState<number | null>(null);
  const [subTrackingPx, setSubTrackingPx] = useState<number | null>(null);
  const [canKeepSingleLine, setCanKeepSingleLine] = useState<boolean>(true);
  const [dividerWidthPx, setDividerWidthPx] = useState<number | null>(null);

  useEffect(() => {
    let rafId = 0;

    const computeBalance = () => {
      const container = containerRef.current;
      const topEl = topMeasureRef.current;
      const subEl = subMeasureRef.current;
      if (!container || !topEl || !subEl) return;

      const maxW = container.clientWidth;
      const topNaturalW = topEl.getBoundingClientRect().width;
      const subNaturalW = subEl.getBoundingClientRect().width;

      if (maxW <= 0 || topNaturalW <= 0 || subNaturalW <= 0) return;

      if (topNaturalW > maxW || subNaturalW > maxW) {
        setCanKeepSingleLine(false);
        setTopTrackingPx(null);
        setSubTrackingPx(null);
        setDividerWidthPx(Math.min(maxW, 280));
        return;
      }

      setCanKeepSingleLine(true);
      const topChars = Math.max(1, Array.from(top).length - 1);
      const subChars = Math.max(1, Array.from(sub).length - 1);

      const targetW = Math.min(maxW, Math.max(topNaturalW, subNaturalW));
      const topDiff = Math.max(0, targetW - topNaturalW);
      const subDiff = Math.max(0, targetW - subNaturalW);

      const topPerChar = Math.min(topDiff / topChars, 6);
      const subPerChar = Math.min(subDiff / subChars, 11);

      setTopTrackingPx(Number(topPerChar.toFixed(2)));
      setSubTrackingPx(Number(subPerChar.toFixed(2)));

      const finalTopW = topNaturalW + topPerChar * topChars;
      const finalSubW = subNaturalW + subPerChar * subChars;
      setDividerWidthPx(Math.max(170, Math.min(maxW, Math.round(Math.max(finalTopW, finalSubW)))));
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeBalance);
    };

    schedule();
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [top, sub, size]);

  // UTMNiagara.ttf has tall stacked Vietnamese diacritics (ascent 2093 / upm 2048 -> natural 1.30em).
  // Keep line-height >= 1.30 + top breathing room so overflow containers never slice off Ễ, Ổ, Ế, Ề, Ể, Ấ, Ắ...
  const topSizeClass =
    size === 'intro'
      ? 'text-[2.75rem] sm:text-[4.25rem] lg:text-[5.25rem] leading-[1.32] pt-[0.12em]'
      : 'text-[2.35rem] sm:text-[3.25rem] lg:text-[3.95rem] leading-[1.32] pt-[0.12em]';

  const subSizeClass =
    size === 'intro'
      ? 'text-[14px] sm:text-[19px] lg:text-[23px] leading-[1.35]'
      : 'text-[12.5px] sm:text-[16px] lg:text-[18.5px] leading-[1.35]';

  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-start lg:items-end text-left lg:text-right'
        : 'items-start text-left';

  const topCharArray = useMemo(() => Array.from(top), [top]);
  const subCharArray = useMemo(() => Array.from(sub), [sub]);
  const subStartDelayMs = Math.min(900, Math.max(480, topCharArray.length * 42 + 120));
  const dividerDelayMs = subStartDelayMs + Math.min(700, subCharArray.length * 32) + 120;

  return (
    <div ref={containerRef} className={`relative w-full flex flex-col ${alignClass}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none invisible fixed -top-[9999px] left-0 whitespace-nowrap"
      >
        <span
          ref={topMeasureRef}
          className={`inline-block font-['UTM_Niagara',serif] uppercase ${topSizeClass}`}
          style={{ letterSpacing: '0px' }}
        >
          {top}
        </span>
        <span
          ref={subMeasureRef}
          className={`inline-block font-['UTM_ClassizismAntiqua',serif] uppercase ${subSizeClass}`}
          style={{ letterSpacing: '0px' }}
        >
          {sub}
        </span>
      </div>

      <h1
        className={`font-['UTM_Niagara',serif] uppercase text-[#FFE5A3] drop-shadow-[0_6px_26px_rgba(0,0,0,0.88)] ${topSizeClass} ${
          canKeepSingleLine ? 'whitespace-nowrap' : ''
        }`}
        style={
          staggerReveal && canKeepSingleLine
            ? undefined
            : {
                letterSpacing: topTrackingPx !== null ? `${topTrackingPx}px` : '0.03em',
                marginRight:
                  topTrackingPx !== null && (align === 'center' || align === 'right')
                    ? `-${topTrackingPx}px`
                    : undefined,
              }
        }
      >
        {staggerReveal && canKeepSingleLine
          ? topCharArray.map((ch, idx) => (
              <span
                key={`${top}-t-${idx}`}
                className="vh-char-reveal inline-block"
                style={{
                  animationDelay: `${idx * 42}ms`,
                  marginRight:
                    idx < topCharArray.length - 1
                      ? topTrackingPx !== null
                        ? `${topTrackingPx}px`
                        : '0.03em'
                      : '0px',
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))
          : top}
      </h1>

      <p
        className={`mt-0.5 font-['UTM_ClassizismAntiqua',serif] uppercase text-[#F4D99B] drop-shadow-[0_3px_14px_rgba(0,0,0,0.92)] ${subSizeClass} ${
          canKeepSingleLine ? 'whitespace-nowrap' : ''
        }`}
        style={
          staggerReveal && canKeepSingleLine
            ? undefined
            : {
                letterSpacing: subTrackingPx !== null ? `${subTrackingPx}px` : '0.16em',
                marginRight:
                  subTrackingPx !== null && (align === 'center' || align === 'right')
                    ? `-${subTrackingPx}px`
                    : undefined,
              }
        }
      >
        {staggerReveal && canKeepSingleLine
          ? subCharArray.map((ch, idx) => (
              <span
                key={`${sub}-s-${idx}`}
                className="vh-char-reveal inline-block"
                style={{
                  animationDelay: `${subStartDelayMs + idx * 32}ms`,
                  marginRight:
                    idx < subCharArray.length - 1
                      ? subTrackingPx !== null
                        ? `${subTrackingPx}px`
                        : '0.16em'
                      : '0px',
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))
          : sub}
      </p>

      {/* Gold-Gradient Lotus Ornamental Divider (image13) */}
      <div
        className={`relative h-7 sm:h-8 my-3 sm:my-4 transition-[width] duration-300 ${
          staggerReveal ? 'vh-divider-bloom' : ''
        }`}
        style={{
          width: dividerWidthPx ? `${dividerWidthPx}px` : size === 'intro' ? '260px' : '240px',
          maxWidth: '100%',
          animationDelay: staggerReveal ? `${dividerDelayMs}ms` : undefined,
        }}
      >
        <Image
          src="/images/van-hoa-viet-nam/divider-lotus-gold.png"
          alt=""
          fill
          sizes="360px"
          className={
            align === 'center'
              ? 'object-contain object-center'
              : align === 'right'
                ? 'object-contain object-left lg:object-right'
                : 'object-contain object-left'
          }
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * Exact-Fit Feathered Backdrop for Chapter Opening Cards:
 * Hugs the exact aspect ratio of Vua Lý, Phật Hoàng, Bồ-tát Thích Quảng Đức (and all other intro images)
 * so all 4 edges & 4 corners dissolve smoothly like mist with ZERO visible border AND ZERO head cropping!
 */
function IntroBackdropExactFit({
  src,
  orientation,
}: {
  src: string;
  orientation: 'portrait' | 'landscape';
}) {
  const [ratio, setRatio] = useState<number>(orientation === 'portrait' ? 0.67 : 1.5);

  useEffect(() => {
    setRatio(orientation === 'portrait' ? 0.67 : 1.5);
  }, [src, orientation]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const nw = e.currentTarget.naturalWidth;
    const nh = e.currentTarget.naturalHeight;
    if (nw > 0 && nh > 0) {
      setRatio(Number((nw / nh).toFixed(4)));
    }
  };

  return (
    <div className="absolute inset-0 bg-[#090705] overflow-hidden">
      {/* Soft warm ambient blurred color echo */}
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        sizes="20vw"
        className="object-cover object-center opacity-[0.18] blur-3xl scale-110"
        aria-hidden="true"
      />
      {/* Exact-fit uncropped artwork with 4-edge & 4-corner mist mask directly on the photo bounds */}
      <div className="vh-photo-stage-box absolute inset-y-4 inset-x-4 sm:inset-y-6 sm:inset-x-8 flex items-center justify-center">
        <div
          style={{ '--img-ratio': String(ratio) } as React.CSSProperties}
          className="vh-exact-fit-frame vh-feather-photo-all overflow-hidden"
        >
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            priority
            onLoad={handleLoad}
            sizes="100vw"
            className="object-cover opacity-45"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,8,6,0.42)_0%,rgba(9,7,5,0.92)_82%)]" />
    </div>
  );
}

interface MediaLayerItem {
  layerKey: string;
  beat: StoryBeat;
  isInitial?: boolean;
}

/**
 * Full-Frame UNCROPPED Background Visual Layer:
 * - Never crops any artwork (object-contain on both Desktop and Mobile!)
 * - Soft ambient blurred echo + multi-edge feathered masks seamlessly fill empty margins
 * - Directional obsidian reading scrim elevates typography legibility effortlessly
 * - True 0 -> 1 cinema crossfade on mount with zero dark dip
 */
function FullBleedVisualLayer({
  beat,
  isActive,
  isInitial,
  isPriority,
  ytIframeRef,
}: {
  beat: StoryBeat;
  isActive: boolean;
  isInitial?: boolean;
  isPriority: boolean;
  ytIframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const [entered, setEntered] = useState(Boolean(isInitial));
  const isVideo = beat.mediaType === 'youtube' && Boolean(beat.youtubeId);
  const isPortrait = beat.imageOrientation === 'portrait';
  const focalRight = beat.focalSide === 'right';
  const [imgRatio, setImgRatio] = useState<number>(isPortrait ? 0.68 : 1.5);

  useEffect(() => {
    if (entered) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [entered]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const nw = e.currentTarget.naturalWidth;
    const nh = e.currentTarget.naturalHeight;
    if (nw > 0 && nh > 0) {
      setImgRatio(Number((nw / nh).toFixed(4)));
    }
  };

  const ratioStyle = { '--img-ratio': String(imgRatio) } as React.CSSProperties;

  // Simultaneous true cross-dissolve:
  // - Incoming layer smoothly fades IN (0 -> 1 over 1050ms)
  // - Outgoing layer smoothly fades OUT (1 -> 0 over 950ms) so portrait <-> landscape never snaps away!
  const layerOpacity = isActive
    ? entered
      ? 'opacity-100 duration-[1050ms]'
      : 'opacity-0 duration-[1050ms]'
    : 'opacity-0 duration-[950ms] pointer-events-none';

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#0A0806] transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isActive ? 'z-[2]' : 'z-[1]'
      } ${layerOpacity}`}
    >
      {isVideo ? (
        <>
          <iframe
            ref={isActive ? ytIframeRef : undefined}
            title="Video nền Văn hóa Việt Nam – Tùng Lâm Hòa Phúc"
            src={`https://www.youtube.com/embed/${beat.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${beat.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[182%] h-[182%] min-w-full min-h-full border-0"
          />
          <div className="pointer-events-none absolute inset-0 vh-scrim-desktop-text-left" />
        </>
      ) : (
        <>
          {/* Soft ambient blurred color echo fills any empty canvas margins warmly */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Image
              src={beat.imageUrl}
              alt=""
              fill
              unoptimized
              sizes="20vw"
              className="object-cover object-center opacity-[0.22] blur-3xl scale-110 saturate-125"
            />
            <div className="absolute inset-0 bg-[#0A0806]/68" />
          </div>

          {isPortrait ? (
            <>
              {/* MOBILE (< lg): Exact-fit uncropped portrait with all 4 edges & corners dissolved smoothly */}
              <div className="lg:hidden absolute inset-0">
                <div className="vh-photo-stage-box absolute top-[62px] bottom-[84px] inset-x-0 flex items-start justify-center">
                  <div
                    style={ratioStyle}
                    className="vh-exact-fit-frame vh-feather-photo-all overflow-hidden"
                  >
                    <Image
                      src={beat.imageUrl}
                      alt={beat.artifactTitle}
                      fill
                      unoptimized
                      onLoad={handleImageLoad}
                      priority={isPriority}
                      fetchPriority={isPriority ? 'high' : 'auto'}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 vh-scrim-mobile-portrait" />
              </div>

              {/* DESKTOP (>= lg): Exact-fit uncropped portrait anchored left/right with 4-edge & corner mist dissolve */}
              <div className="hidden lg:block absolute inset-0">
                <div
                  className={`vh-photo-stage-box absolute inset-y-4 w-[54vw] xl:w-[52vw] flex items-center ${
                    focalRight ? 'right-4 justify-end' : 'left-4 justify-start'
                  }`}
                >
                  <div
                    style={ratioStyle}
                    className={`vh-exact-fit-frame overflow-hidden ${
                      focalRight ? 'vh-feather-photo-right' : 'vh-feather-photo-left'
                    }`}
                  >
                    <Image
                      src={beat.imageUrl}
                      alt={beat.artifactTitle}
                      fill
                      unoptimized
                      onLoad={handleImageLoad}
                      priority={isPriority}
                      fetchPriority={isPriority ? 'high' : 'auto'}
                      sizes="54vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div
                  className={`pointer-events-none absolute inset-0 ${
                    focalRight ? 'vh-scrim-desktop-text-left' : 'vh-scrim-desktop-text-right'
                  }`}
                />
              </div>
            </>
          ) : (
            <>
              {/* MOBILE (< lg): Exact-fit uncropped landscape with soft mist dissolve on all 4 edges & corners */}
              <div className="lg:hidden absolute inset-0">
                <div className="vh-photo-stage-box absolute top-[72px] inset-x-2 h-[38dvh] flex items-center justify-center">
                  <div
                    style={ratioStyle}
                    className="vh-exact-fit-frame vh-feather-photo-all overflow-hidden"
                  >
                    <Image
                      src={beat.imageUrl}
                      alt={beat.artifactTitle}
                      fill
                      unoptimized
                      onLoad={handleImageLoad}
                      priority={isPriority}
                      fetchPriority={isPriority ? 'high' : 'auto'}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 vh-scrim-mobile-landscape" />
              </div>

              {/* DESKTOP (>= lg): Exact-fit uncropped landscape; shifts fully to focalSide when desktopLayout === 'side' */}
              <div className="hidden lg:block absolute inset-0">
                <div
                  className={
                    beat.desktopLayout === 'side'
                      ? `vh-photo-stage-box absolute inset-y-4 w-[54vw] xl:w-[52vw] flex items-center ${
                          focalRight ? 'right-4 justify-end' : 'left-4 justify-start'
                        }`
                      : 'vh-photo-stage-box absolute inset-y-3 inset-x-3 flex items-center justify-center'
                  }
                >
                  <div
                    style={ratioStyle}
                    className={`vh-exact-fit-frame overflow-hidden ${
                      beat.desktopLayout === 'side'
                        ? focalRight
                          ? 'vh-feather-photo-right'
                          : 'vh-feather-photo-left'
                        : 'vh-feather-photo-all'
                    }`}
                  >
                    <Image
                      src={beat.imageUrl}
                      alt={beat.artifactTitle}
                      fill
                      unoptimized
                      onLoad={handleImageLoad}
                      priority={isPriority}
                      fetchPriority={isPriority ? 'high' : 'auto'}
                      sizes={beat.desktopLayout === 'side' ? '54vw' : '100vw'}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div
                  className={`pointer-events-none absolute inset-0 ${
                    focalRight ? 'vh-scrim-desktop-text-left' : 'vh-scrim-desktop-text-right'
                  }`}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function VanHoaScrollytelling() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);

  const [chapterIntroState, setChapterIntroState] = useState<
    'entering' | 'visible' | 'fading' | 'hidden'
  >('visible');
  const [introChapterIdx, setIntroChapterIdx] = useState(0);

  const [mediaStack, setMediaStack] = useState<MediaLayerItem[]>(() => [
    {
      layerKey: `${VAN_HOA_CHAPTERS[0].beats[0].id}-init`,
      beat: VAN_HOA_CHAPTERS[0].beats[0],
      isInitial: true,
    },
  ]);

  // Smooth text fade-out -> fade-in state (decoupled from activeBeat so progress bar & photo respond immediately)
  const [displayedBeat, setDisplayedBeat] = useState<StoryBeat>(VAN_HOA_CHAPTERS[0].beats[0]);
  const [textFadePhase, setTextFadePhase] = useState<'idle' | 'out-all' | 'out-body'>('idle');

  const [showInteractHint, setShowInteractHint] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [pulseNextChapter, setPulseNextChapter] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);

  const directoryDialogRef = useRef<HTMLDialogElement | null>(null);
  const readerDialogRef = useRef<HTMLDialogElement | null>(null);
  const bookDialogRef = useRef<HTMLDialogElement | null>(null);
  const youtubeDialogRef = useRef<HTMLDialogElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const wheelCooldownRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const introEnterRafRef = useRef<number>(0);
  const introHoldTimerRef = useRef<number | null>(null);
  const introHideTimerRef = useRef<number | null>(null);
  const mediaPruneTimerRef = useRef<number | null>(null);
  const textSwapTimerRef = useRef<number | null>(null);
  const preloadedUrlsRef = useRef<Set<string>>(new Set());
  const layerSeqRef = useRef<number>(1);

  const activeChapter: VanHoaChapter = VAN_HOA_CHAPTERS[chapterIndex] ?? VAN_HOA_CHAPTERS[0];
  const chapterBeats = activeChapter.beats;
  const activeBeat: StoryBeat = chapterBeats[beatIndex] ?? chapterBeats[0];
  const isVideoActive = displayedBeat.mediaType === 'youtube' && Boolean(displayedBeat.youtubeId);
  const isLastBeatInChapter = beatIndex === chapterBeats.length - 1;
  const isTextOnRightDesktop = displayedBeat.focalSide === 'left' && !isVideoActive;

  // Proactive background S3 WebP lookahead preloader:
  // Warms the exact unoptimized S3 URLs for upcoming beats & next chapter so scrolling loads in < 5ms!
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlsToWarm: string[] = [];

    const addUrl = (u?: string) => {
      if (u && !preloadedUrlsRef.current.has(u)) {
        urlsToWarm.push(u);
      }
    };

    // Current chapter: prev beat + next 3 beats
    addUrl(activeChapter.introBackdropUrl);
    for (let offset = -1; offset <= 3; offset++) {
      const b = chapterBeats[beatIndex + offset];
      if (b?.imageUrl) addUrl(b.imageUrl);
    }

    // Next chapter: opening backdrop + first 3 beats
    const nextChap = VAN_HOA_CHAPTERS[chapterIndex + 1];
    if (nextChap) {
      addUrl(nextChap.introBackdropUrl);
      nextChap.beats.slice(0, 3).forEach((b) => addUrl(b.imageUrl));
    }

    // Previous chapter opening backdrop
    const prevChap = VAN_HOA_CHAPTERS[chapterIndex - 1];
    if (prevChap) addUrl(prevChap.introBackdropUrl);

    for (const url of urlsToWarm) {
      preloadedUrlsRef.current.add(url);
      const img = new window.Image();
      img.decoding = 'async';
      img.src = url;
    }
  }, [chapterIndex, beatIndex, activeChapter, chapterBeats]);

  // Smooth text fade-out (240ms) -> swap -> fade-in (780ms)
  useEffect(() => {
    if (displayedBeat.id === activeBeat.id) return;

    if (textSwapTimerRef.current) window.clearTimeout(textSwapTimerRef.current);

    const sameTitle =
      displayedBeat.titleGroupId === activeBeat.titleGroupId &&
      displayedBeat.focalSide === activeBeat.focalSide;
    const sameContent =
      sameTitle &&
      (displayedBeat.contentGroupId ?? displayedBeat.id) ===
        (activeBeat.contentGroupId ?? activeBeat.id);

    // Same title & exact same text (only background photo changed) -> update immediately with zero text flicker
    if (sameContent) {
      setDisplayedBeat(activeBeat);
      setTextFadePhase('idle');
      return;
    }

    // If chapter intro is currently covering the screen, swap immediately underneath without fade delay
    if (chapterIntroState === 'visible' || chapterIntroState === 'entering') {
      setDisplayedBeat(activeBeat);
      setTextFadePhase('idle');
      return;
    }

    setTextFadePhase(sameTitle ? 'out-body' : 'out-all');
    textSwapTimerRef.current = window.setTimeout(() => {
      setDisplayedBeat(activeBeat);
      setTextFadePhase('idle');
    }, 240);

    return () => {
      if (textSwapTimerRef.current) window.clearTimeout(textSwapTimerRef.current);
    };
  }, [activeBeat, displayedBeat, chapterIntroState]);

  // Trigger smooth simultaneous fade-out + fade-in cross-dissolve ONLY when visual media or focal side changes
  useEffect(() => {
    setMediaStack((prev) => {
      const top = prev[prev.length - 1];
      if (
        top &&
        top.beat.mediaType === activeBeat.mediaType &&
        top.beat.imageUrl === activeBeat.imageUrl &&
        top.beat.youtubeId === activeBeat.youtubeId &&
        top.beat.focalSide === activeBeat.focalSide &&
        top.beat.desktopLayout === activeBeat.desktopLayout
      ) {
        return prev;
      }
      const nextKey = `${activeBeat.id}-${layerSeqRef.current++}`;
      const kept = top ? [top] : [];
      return [...kept, { layerKey: nextKey, beat: activeBeat }];
    });

    if (mediaPruneTimerRef.current) window.clearTimeout(mediaPruneTimerRef.current);
    mediaPruneTimerRef.current = window.setTimeout(() => {
      setMediaStack((prev) => (prev.length > 1 ? [prev[prev.length - 1]] : prev));
    }, 1250);

    return () => {
      if (mediaPruneTimerRef.current) window.clearTimeout(mediaPruneTimerRef.current);
    };
  }, [activeBeat]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (introEnterRafRef.current) cancelAnimationFrame(introEnterRafRef.current);
      if (introHoldTimerRef.current) window.clearTimeout(introHoldTimerRef.current);
      if (introHideTimerRef.current) window.clearTimeout(introHideTimerRef.current);
      if (mediaPruneTimerRef.current) window.clearTimeout(mediaPruneTimerRef.current);
      if (textSwapTimerRef.current) window.clearTimeout(textSwapTimerRef.current);
    };
  }, []);

  const markUserInteracted = useCallback(() => {
    setShowInteractHint(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setShowInteractHint(true);
    }, 9000);
  }, []);

  const dismissChapterIntro = useCallback(() => {
    if (introEnterRafRef.current) cancelAnimationFrame(introEnterRafRef.current);
    if (introHoldTimerRef.current) window.clearTimeout(introHoldTimerRef.current);
    if (introHideTimerRef.current) window.clearTimeout(introHideTimerRef.current);
    setChapterIntroState((curr) => (curr === 'hidden' ? curr : 'fading'));
    introHideTimerRef.current = window.setTimeout(() => {
      setChapterIntroState('hidden');
    }, 1050);
  }, []);

  const triggerChapterIntro = useCallback(
    (chapIdx: number, isInitialMount = false) => {
      if (introEnterRafRef.current) cancelAnimationFrame(introEnterRafRef.current);
      if (introHoldTimerRef.current) window.clearTimeout(introHoldTimerRef.current);
      if (introHideTimerRef.current) window.clearTimeout(introHideTimerRef.current);

      setIntroChapterIdx(chapIdx);

      if (isInitialMount) {
        setChapterIntroState('visible');
      } else {
        // Smooth Fade-In (0 -> 1) when transitioning into a new chapter title card
        setChapterIntroState('entering');
        introEnterRafRef.current = requestAnimationFrame(() => {
          introEnterRafRef.current = requestAnimationFrame(() => {
            setChapterIntroState('visible');
          });
        });
      }

      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Calm reading hold so character-by-character reveal & lotus bloom finish gracefully + artwork preloads
      introHoldTimerRef.current = window.setTimeout(
        () => {
          dismissChapterIntro();
        },
        reducedMotion ? 1800 : 4100
      );
    },
    [dismissChapterIntro]
  );

  useEffect(() => {
    triggerChapterIntro(0, true);
  }, [triggerChapterIntro]);

  const goToChapter = useCallback(
    (targetChap: number, targetBeat = 0, playIntro = true) => {
      const clampedChap = Math.max(0, Math.min(TOTAL_CHAPTERS - 1, targetChap));
      const maxBeat = VAN_HOA_CHAPTERS[clampedChap].beats.length - 1;
      const clampedBeat = Math.max(0, Math.min(maxBeat, targetBeat));

      setChapterIndex(clampedChap);
      setBeatIndex(clampedBeat);
      setPulseNextChapter(false);

      if (playIntro && clampedBeat === 0) {
        triggerChapterIntro(clampedChap);
      } else {
        dismissChapterIntro();
      }
    },
    [triggerChapterIntro, dismissChapterIntro]
  );

  const stepBeat = useCallback(
    (delta: number) => {
      markUserInteracted();

      if (chapterIntroState === 'visible' || chapterIntroState === 'entering') {
        dismissChapterIntro();
        return;
      }

      if (delta > 0) {
        if (beatIndex < chapterBeats.length - 1) {
          setBeatIndex((prev) => prev + 1);
          setPulseNextChapter(false);
        } else if (chapterIndex < TOTAL_CHAPTERS - 1) {
          setPulseNextChapter(true);
          setShowInteractHint(true);
        }
      } else if (delta < 0) {
        setPulseNextChapter(false);
        if (beatIndex > 0) {
          setBeatIndex((prev) => prev - 1);
        } else if (chapterIndex > 0) {
          const prevChap = chapterIndex - 1;
          goToChapter(prevChap, VAN_HOA_CHAPTERS[prevChap].beats.length - 1, false);
        }
      }
    },
    [
      markUserInteracted,
      chapterIntroState,
      dismissChapterIntro,
      beatIndex,
      chapterBeats.length,
      chapterIndex,
      goToChapter,
    ]
  );

  const toggleVideoSound = () => {
    const nextMuted = !isVideoMuted;
    setIsVideoMuted(nextMuted);
    try {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: [],
        }),
        '*'
      );
    } catch {
      // Ignore cross-origin postMessage before player ready
    }
  };

  const isAnyDialogOpen = () =>
    Boolean(
      directoryDialogRef.current?.open ||
        readerDialogRef.current?.open ||
        bookDialogRef.current?.open ||
        youtubeDialogRef.current?.open
    );

  const openYoutubePopup = useCallback(() => {
    markUserInteracted();
    setIsYoutubeModalOpen(true);
    youtubeDialogRef.current?.showModal();
  }, [markUserInteracted]);

  // Safari fallback for closedby="any" light-dismiss on native <dialog>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    const dialogs = [
      directoryDialogRef.current,
      readerDialogRef.current,
      bookDialogRef.current,
      youtubeDialogRef.current,
    ].filter((d): d is HTMLDialogElement => d !== null);
    const cleanups: Array<() => void> = [];
    const isOutside = (e: PointerEvent, dialog: HTMLDialogElement) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };
    for (const dialog of dialogs) {
      let pressedOutside = false;
      const onDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e, dialog);
      };
      const onUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e, dialog) && dialog.open) dialog.close();
      };
      dialog.addEventListener('pointerdown', onDown);
      dialog.addEventListener('pointerup', onUp);
      cleanups.push(() => {
        dialog.removeEventListener('pointerdown', onDown);
        dialog.removeEventListener('pointerup', onUp);
      });
    }
    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnyDialogOpen()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        stepBeat(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        stepBeat(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        markUserInteracted();
        if (isLastBeatInChapter && chapterIndex < TOTAL_CHAPTERS - 1) {
          goToChapter(chapterIndex + 1, 0, true);
        } else {
          stepBeat(1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        markUserInteracted();
        if (beatIndex === 0 && chapterIndex > 0) {
          goToChapter(chapterIndex - 1, 0, true);
        } else {
          stepBeat(-1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepBeat, isLastBeatInChapter, chapterIndex, beatIndex, goToChapter, markUserInteracted]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isAnyDialogOpen()) return;
    if (Math.abs(e.deltaY) < 20) return;
    const now = Date.now();
    if (now - wheelCooldownRef.current < 580) return;
    wheelCooldownRef.current = now;
    stepBeat(e.deltaY > 0 ? 1 : -1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAnyDialogOpen()) return;
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const diff = touchStartYRef.current - endY;
    touchStartYRef.current = null;
    if (Math.abs(diff) < 46) return;
    stepBeat(diff > 0 ? 1 : -1);
  };

  const handleTrackInteract = (e: React.MouseEvent<HTMLDivElement>) => {
    markUserInteracted();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (chapterBeats.length - 1));
    setBeatIndex(idx);
    setPulseNextChapter(false);
  };

  const groupedDirectory = useMemo(() => {
    const map = new Map<string, Array<{ chapter: VanHoaChapter; index: number }>>();
    VAN_HOA_CHAPTERS.forEach((chapter, index) => {
      const list = map.get(chapter.directoryGroup) ?? [];
      list.push({ chapter, index });
      map.set(chapter.directoryGroup, list);
    });
    return Array.from(map.entries());
  }, []);

  const beatPercent =
    chapterBeats.length > 1 ? (beatIndex / (chapterBeats.length - 1)) * 100 : 100;

  const introChapter = VAN_HOA_CHAPTERS[introChapterIdx] ?? activeChapter;

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="vh-stage-bg relative w-full h-dvh overflow-hidden text-[#E8DFD3] select-none"
    >
      {/* =====================================================================
          FULL-FRAME UNCROPPED CROSSFADE STAGE
          ===================================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#0A0806]">
        {mediaStack.map((item, idx) => (
          <FullBleedVisualLayer
            key={item.layerKey}
            beat={item.beat}
            isActive={idx === mediaStack.length - 1}
            isInitial={item.isInitial}
            isPriority={chapterIndex === 0 && beatIndex === 0}
            ytIframeRef={ytIframeRef}
          />
        ))}
      </div>

      {/* =====================================================================
          SERENE CHAPTER OPENING INTERSTITIAL CARD
          - Uncropped object-contain backdrop (ZERO head cropping on Vua Lý, Phật Hoàng, Bồ-tát Thích Quảng Đức!)
          - Smooth Fade-In (700ms) -> Calm 3.5s Reading Hold -> Smooth Fade-Out (1050ms)
          ===================================================================== */}
      {chapterIntroState !== 'hidden' && (
        <div
          onClick={() => {
            markUserInteracted();
            dismissChapterIntro();
          }}
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center px-6 sm:px-12 text-center cursor-pointer transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
            chapterIntroState === 'visible'
              ? 'opacity-100 duration-[700ms]'
              : chapterIntroState === 'entering'
                ? 'opacity-0 duration-[700ms]'
                : 'opacity-0 duration-[1050ms] pointer-events-none'
          }`}
        >
          <IntroBackdropExactFit
            src={introChapter.introBackdropUrl}
            orientation={introChapter.introBackdropOrientation}
          />

          <div
            key={`intro-title-${introChapterIdx}`}
            className="relative z-10 w-full max-w-2xl mx-auto"
          >
            <BalancedTitleLockup
              top={introChapter.introTitleTop}
              sub={introChapter.introTitleSub}
              align="center"
              size="intro"
              staggerReveal
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          ULTRA-MINIMAL TOP CHROME
          ===================================================================== */}
      <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-10 pt-4 sm:pt-7 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto font-['UTM_ClassizismAntiqua',serif] text-[10.5px] sm:text-sm tracking-[0.08em] sm:tracking-[0.2em] uppercase text-[#FFE5A3]/90 hover:text-[#FFDE59] transition-colors max-w-[140px] sm:max-w-none truncate drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
        >
          Tùng Lâm Hòa Phúc
        </Link>

        <button
          type="button"
          onClick={() => {
            markUserInteracted();
            directoryDialogRef.current?.showModal();
          }}
          aria-label="Mở mục lục"
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-[#F2C14E]/25 flex items-center justify-center text-[#FFE5A3] hover:border-[#F2C14E]/75 hover:bg-black/75 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-10 flex justify-end">
          {isVideoActive && (
            <button
              type="button"
              onClick={toggleVideoSound}
              aria-label={isVideoMuted ? 'Bật tiếng video nền' : 'Tắt tiếng video nền'}
              className="pointer-events-auto w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FFE5A3] hover:border-[#F2C14E]/70 transition-colors cursor-pointer"
            >
              {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          DISCREET RELOCATED PHOTO CAPTION (Outside <article>, zero statue codes)
          - Mobile: Whisper-quiet single line tucked delicately below top header
          - Desktop: Quiet corner footnote directly beneath the photo half
          ===================================================================== */}
      {!isVideoActive && chapterIntroState !== 'visible' && chapterIntroState !== 'entering' && (
        <>
          <p className="lg:hidden fixed top-[54px] inset-x-5 z-20 text-center font-['UTM_Avo',sans-serif] italic text-[10px] text-[#E6D8C0]/60 truncate pointer-events-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition-opacity duration-500">
            {displayedBeat.artifactTitle}
          </p>
          <p
            className={`hidden lg:block fixed bottom-6 z-20 max-w-[300px] font-['UTM_Avo',sans-serif] italic text-[11px] leading-snug text-[#DDD0BC]/62 pointer-events-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] transition-opacity duration-500 ${
              isTextOnRightDesktop ? 'left-10 text-left' : 'right-12 text-right'
            }`}
          >
            {displayedBeat.artifactTitle}
          </p>
        </>
      )}

      {/* =====================================================================
          EDITORIAL OVERLAY STAGE
          - Zero scrollbars (vh-no-scrollbar)
          - Smooth Fade-Out (240ms) -> Swap -> Fade-In (820ms) on transitions
          - Dedicated Grand Finale Hub Slide ('hub') with 3 in-web Popup Cards
          ===================================================================== */}
      <main
        className={`relative z-10 w-full h-full max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 pt-20 pb-24 lg:pb-24 flex flex-col transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          chapterIntroState === 'visible' || chapterIntroState === 'entering'
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100'
        } ${
          displayedBeat.slideKind === 'hub'
            ? 'justify-center items-center'
            : `justify-end lg:justify-center ${isTextOnRightDesktop ? 'lg:items-end' : 'lg:items-start'}`
        }`}
      >
        {displayedBeat.slideKind === 'hub' ? (
          /* =====================================================================
             DEDICATED FINAL HUB SLIDE: 3 IN-WEB POPUPS (Sách · YouTube · Toàn Văn)
             ===================================================================== */
          <section
            className={`vh-no-scrollbar w-full max-w-5xl max-h-[76dvh] overflow-y-auto overflow-x-hidden px-1 pt-4 pb-2 transition-opacity duration-[240ms] ${
              textFadePhase === 'out-all' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div key={displayedBeat.titleGroupId} className="vh-title-crossfade max-w-2xl mx-auto">
              <BalancedTitleLockup
                top={displayedBeat.headlineTop}
                sub={displayedBeat.headlineSub}
                align="center"
                size="stage"
              />
            </div>

            <div
              key={displayedBeat.id}
              className="vh-body-crossfade mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
            >
              {/* POPUP CARD 1: SÁCH ĐI QUA KHỔ VUI CUỘC ĐỜI – QUYỂN 01 */}
              <button
                type="button"
                onClick={() => {
                  markUserInteracted();
                  bookDialogRef.current?.showModal();
                }}
                className="group text-left rounded-2xl bg-[#120C08]/80 backdrop-blur-xl border border-[#F2C14E]/35 hover:border-[#F2C14E]/85 p-4 sm:p-5 flex md:flex-col items-center md:items-stretch gap-4 transition-all hover:-translate-y-0.5 shadow-[0_14px_36px_rgba(0,0,0,0.65)] cursor-pointer"
              >
                <div className="relative w-20 h-28 md:w-full md:h-44 rounded-xl overflow-hidden border border-[#F2C14E]/35 shrink-0 bg-black/50">
                  <Image
                    src={REFERENCE_BOOK.coverUrl}
                    alt={REFERENCE_BOOK.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 80px, 300px"
                    className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0 flex-1 flex flex-col">
                  <span className="font-['UTM_ClassizismAntiqua',serif] text-[10px] uppercase tracking-[0.18em] text-[#D9B66B]">
                    Ấn Phẩm Tham Khảo
                  </span>
                  <h2 className="font-['UTM_Avo',sans-serif] font-semibold text-sm sm:text-[15px] text-[#FFE5A3] mt-1 leading-snug">
                    {REFERENCE_BOOK.title}
                  </h2>
                  <p className="font-['UTM_Avo',sans-serif] italic text-xs text-[#C7B9A4] mt-1">
                    {REFERENCE_BOOK.author} · {REFERENCE_BOOK.publisher}
                  </p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-['UTM_Avo',sans-serif] text-xs text-[#F2C14E] group-hover:underline">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem chi tiết &amp; trích đoạn</span>
                  </span>
                </div>
              </button>

              {/* POPUP CARD 2: CLIP YOUTUBE BẢO TÀNG VĂN HÓA PHẬT GIÁO */}
              <button
                type="button"
                onClick={openYoutubePopup}
                className="group text-left rounded-2xl bg-[#120C08]/80 backdrop-blur-xl border border-[#F2C14E]/35 hover:border-[#F2C14E]/85 p-4 sm:p-5 flex md:flex-col items-center md:items-stretch gap-4 transition-all hover:-translate-y-0.5 shadow-[0_14px_36px_rgba(0,0,0,0.65)] cursor-pointer"
              >
                <div className="relative w-24 h-20 md:w-full md:h-44 rounded-xl overflow-hidden border border-[#F2C14E]/35 shrink-0 bg-black">
                  <Image
                    src={MUSEUM_YOUTUBE_VIDEO.thumbnailUrl}
                    alt={MUSEUM_YOUTUBE_VIDEO.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 96px, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <span className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#F2C14E]/95 text-[#140C07] flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.75)] group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1 flex flex-col">
                  <span className="font-['UTM_ClassizismAntiqua',serif] text-[10px] uppercase tracking-[0.18em] text-[#D9B66B]">
                    Phim Tư Liệu YouTube
                  </span>
                  <h2 className="font-['UTM_Avo',sans-serif] font-semibold text-sm sm:text-[15px] text-[#FFE5A3] mt-1 leading-snug">
                    {MUSEUM_YOUTUBE_VIDEO.title}
                  </h2>
                  <p className="font-['UTM_Avo',sans-serif] italic text-xs text-[#C7B9A4] mt-1">
                    Không gian di sản &amp; Bảo tượng Tùng Lâm Hòa Phúc
                  </p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-['UTM_Avo',sans-serif] text-xs text-[#F2C14E] group-hover:underline">
                    <Play className="w-3.5 h-3.5" />
                    <span>Xem video ngay tại đây</span>
                  </span>
                </div>
              </button>

              {/* POPUP CARD 3: ĐỌC TOÀN VĂN BÀI VIẾT */}
              <button
                type="button"
                onClick={() => {
                  markUserInteracted();
                  readerDialogRef.current?.showModal();
                }}
                className="group text-left rounded-2xl bg-[#120C08]/80 backdrop-blur-xl border border-[#F2C14E]/35 hover:border-[#F2C14E]/85 p-4 sm:p-5 flex md:flex-col items-center md:items-stretch gap-4 transition-all hover:-translate-y-0.5 shadow-[0_14px_36px_rgba(0,0,0,0.65)] cursor-pointer"
              >
                <div className="relative w-20 h-24 md:w-full md:h-44 rounded-xl overflow-hidden border border-[#F2C14E]/35 shrink-0 bg-gradient-to-br from-[#24180D] via-[#171009] to-[#0E0906] flex flex-col items-center justify-center p-3 text-center">
                  <FileText className="w-9 h-9 md:w-11 md:h-11 text-[#F2C14E]/85 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden md:block font-['UTM_ClassizismAntiqua',serif] text-[11px] uppercase tracking-[0.16em] text-[#FFE5A3]/90">
                    I · II · III · IV · V · VI
                  </span>
                  <span className="hidden md:block font-['UTM_Avo',sans-serif] italic text-[11px] text-[#C7B9A4]/80 mt-1">
                    Nguyên văn chuẩn hóa
                  </span>
                </div>
                <div className="min-w-0 flex-1 flex flex-col">
                  <span className="font-['UTM_ClassizismAntiqua',serif] text-[10px] uppercase tracking-[0.18em] text-[#D9B66B]">
                    Bài Viết Toàn Văn
                  </span>
                  <h2 className="font-['UTM_Avo',sans-serif] font-semibold text-sm sm:text-[15px] text-[#FFE5A3] mt-1 leading-snug">
                    Văn Hóa Soi Đường, Đạo Sáng Non Sông
                  </h2>
                  <p className="font-['UTM_Avo',sans-serif] italic text-xs text-[#C7B9A4] mt-1">
                    Trọn bộ 6 phần lập luận, thi kệ &amp; tư liệu Bảo tàng
                  </p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-['UTM_Avo',sans-serif] text-xs text-[#F2C14E] group-hover:underline">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Mở bản đọc toàn văn</span>
                  </span>
                </div>
              </button>
            </div>
          </section>
        ) : (
          <article
            className={`vh-no-scrollbar w-full lg:w-[46%] xl:w-[45%] max-h-[54dvh] lg:max-h-[76dvh] overflow-y-auto overflow-x-hidden pt-3 sm:pt-4 pr-5 lg:pr-1 pb-1 transition-opacity duration-[240ms] ${
              textFadePhase === 'out-all' ? 'opacity-0' : 'opacity-100'
            } ${isTextOnRightDesktop ? 'lg:text-right' : 'text-left'}`}
          >
            {/* ANCHORED TITLE LOCKUP + LOTUS DIVIDER */}
            <div key={displayedBeat.titleGroupId} className="vh-title-crossfade">
              <BalancedTitleLockup
                top={displayedBeat.headlineTop}
                sub={displayedBeat.headlineSub}
                align={isTextOnRightDesktop ? 'right' : 'left'}
                size="stage"
              />
            </div>

            {/* CROSSFADING BODY / QUOTE REGION */}
            <div
              key={displayedBeat.contentGroupId ?? displayedBeat.id}
              className={`vh-body-crossfade mt-1 select-text transition-opacity duration-[240ms] ${
                textFadePhase === 'out-body' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {displayedBeat.slideKind === 'prose' && displayedBeat.bodyText && (
                <p
                  className={`font-['UTM_Avo',sans-serif] text-[14.5px] sm:text-[16.5px] leading-[1.88] text-[#D8CEC0] text-justify drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
                    isTextOnRightDesktop
                      ? '[text-align-last:left] lg:[text-align-last:right]'
                      : '[text-align-last:left]'
                  }`}
                >
                  {renderEditorialText(displayedBeat.bodyText)}
                </p>
              )}

              {displayedBeat.slideKind === 'quote' && displayedBeat.quote && (
                <div className="group pt-0.5">
                  {displayedBeat.quote.type === 'poem' ? (
                    <div
                      className={`py-1 ${
                        isTextOnRightDesktop
                          ? 'text-left lg:text-right lg:ml-auto lg:mr-0'
                          : 'text-left'
                      }`}
                    >
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-2.5" />
                      <div
                        className={`py-1 ${
                          isTextOnRightDesktop
                            ? 'border-l-2 border-[#F2C14E]/60 pl-4 sm:pl-5 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-5'
                            : 'border-l-2 border-[#F2C14E]/60 pl-4 sm:pl-5'
                        }`}
                      >
                        {displayedBeat.quote.lines.map((line, lIdx) => (
                          <p
                            key={lIdx}
                            className="font-['UTM_Avo',sans-serif] italic text-[14px] sm:text-[17px] leading-[1.95] text-[#FFE8AE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-2.5" />
                      <p
                        className={`mt-2.5 font-['UTM_Avo',sans-serif] italic text-xs sm:text-[13px] text-[#E5C272]/92 ${
                          isTextOnRightDesktop ? 'text-left lg:text-right' : 'text-left'
                        }`}
                      >
                        — {displayedBeat.quote.citation}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={
                        isTextOnRightDesktop
                          ? 'pl-4 sm:pl-5 border-l-2 border-[#F2C14E]/60 text-left lg:pl-0 lg:pr-5 lg:border-l-0 lg:border-r-2 lg:text-right'
                          : 'pl-4 sm:pl-5 border-l-2 border-[#F2C14E]/60 text-left'
                      }
                    >
                      {displayedBeat.quote.lines.map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className={`font-['UTM_Avo',sans-serif] italic text-[14.5px] sm:text-[16.5px] leading-[1.88] text-[#F8EDD4] text-justify drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
                            isTextOnRightDesktop
                              ? '[text-align-last:left] lg:[text-align-last:right]'
                              : '[text-align-last:left]'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                      <p className="mt-2.5 font-['UTM_Avo',sans-serif] italic text-xs sm:text-[13px] text-[#E5C272]/92 text-right">
                        — {displayedBeat.quote.citation}
                      </p>
                    </div>
                  )}

                  {displayedBeat.externalLink && (
                    <div
                      className={`mt-4 ${
                        isTextOnRightDesktop ? 'text-center lg:text-right' : 'text-left'
                      }`}
                    >
                      <a
                        href={displayedBeat.externalLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-['UTM_Avo',sans-serif] italic text-xs sm:text-[13px] text-[#F2C14E] hover:text-[#FFE8AE] underline underline-offset-4 decoration-[#F2C14E]/50 hover:decoration-[#FFE8AE] transition-colors"
                      >
                        <span>{displayedBeat.externalLink.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        )}
      </main>

      {/* =====================================================================
          RIGHT-EDGE MINIMAL VERTICAL PROGRESS BARS
          ===================================================================== */}
      <nav
        aria-label="Tiến trình nội dung"
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5"
      >
        {chapterBeats.map((b, idx) => {
          const isReached = idx <= beatIndex;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                markUserInteracted();
                setBeatIndex(idx);
                setPulseNextChapter(false);
              }}
              aria-label={b.beatLabel}
              className="py-0.5 px-1.5 cursor-pointer"
            >
              <span className="block w-[2px] h-5 sm:h-6 rounded-full bg-white/15 overflow-hidden">
                <span
                  className="block w-full bg-gradient-to-b from-[#FFDE59] to-[#D97706] transition-all duration-700"
                  style={{ height: isReached ? '100%' : '0%' }}
                />
              </span>
            </button>
          );
        })}
      </nav>

      {/* =====================================================================
          BOTTOM-CENTER MINIMAL GLASSMORPHIC NAV PILL
          ===================================================================== */}
      <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100vw-2rem)] max-w-[350px] flex flex-col items-center">
        <div
          className={`mb-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#F2C14E]/25 font-['UTM_Avo',sans-serif] text-[11px] text-[#FFE5A3]/90 transition-opacity duration-700 pointer-events-none ${
            showInteractHint && chapterIntroState === 'hidden' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {pulseNextChapter && chapterIndex < TOTAL_CHAPTERS - 1
            ? 'Bấm → để sang phần tiếp theo'
            : 'Lăn chuột hoặc kéo'}
        </div>

        <div className="vh-nav-pill vh-gentle-float w-full rounded-[22px] px-4 py-2.5 flex items-center gap-3.5">
          <div
            onClick={handleTrackInteract}
            role="slider"
            tabIndex={0}
            aria-label="Thanh tiến trình"
            aria-valuemin={1}
            aria-valuemax={chapterBeats.length}
            aria-valuenow={beatIndex + 1}
            className="flex-1 relative h-6 flex items-center cursor-pointer"
          >
            <div className="w-full h-[2px] rounded-full bg-white/18 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#B45309] via-[#F2C14E] to-[#FFDE59] transition-all duration-700"
                style={{ width: `${beatPercent}%` }}
              />
              {chapterBeats.map((b, idx) => {
                const pct =
                  chapterBeats.length > 1 ? (idx / (chapterBeats.length - 1)) * 100 : 100;
                return (
                  <span
                    key={b.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30"
                    style={{ left: `${pct}%` }}
                  />
                );
              })}
              <span
                className="vh-nav-orb absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-700"
                style={{ left: `${beatPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                markUserInteracted();
                goToChapter(chapterIndex - 1, 0, true);
              }}
              disabled={chapterIndex === 0}
              aria-label="Phần trước"
              className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-[#FFE5A3] hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                markUserInteracted();
                if (chapterIndex < TOTAL_CHAPTERS - 1) {
                  goToChapter(chapterIndex + 1, 0, true);
                } else {
                  readerDialogRef.current?.showModal();
                }
              }}
              aria-label={
                chapterIndex < TOTAL_CHAPTERS - 1 ? 'Phần tiếp theo' : 'Đọc toàn văn'
              }
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[#140C07] transition-all cursor-pointer ${
                pulseNextChapter || isLastBeatInChapter
                  ? 'vh-orb-end-flash bg-[#F2C14E]'
                  : 'bg-[#F2C14E]/85 hover:bg-[#FFDE59]'
              }`}
            >
              {chapterIndex < TOTAL_CHAPTERS - 1 ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          NATIVE <dialog> 1: CLEAN DIRECTORY MODAL
          ===================================================================== */}
      <dialog
        ref={directoryDialogRef}
        aria-labelledby="vh-directory-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="vh-modal-dialog w-full"
      >
        <div className="rounded-2xl bg-[#140E0A] text-[#E8DFD3] border border-[#F2C14E]/25 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2C14E]/15">
            <div>
              <p className="font-['UTM_ClassizismAntiqua',serif] text-xs uppercase tracking-[0.2em] text-[#D9B66B]">
                Mục Lục Triển Lãm
              </p>
              <h2
                id="vh-directory-title"
                className="font-['UTM_Niagara',serif] text-3xl leading-[1.32] pt-1 text-[#FFE5A3] mt-0.5"
              >
                Văn Hóa Soi Đường, Đạo Sáng Non Sông
              </h2>
            </div>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Đóng mục lục"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFE5A3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-h-[68dvh] overflow-y-auto">
            {groupedDirectory.map(([groupTitle, items]) => (
              <div key={groupTitle} className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                <h3 className="font-['UTM_ClassizismAntiqua',serif] text-xs uppercase tracking-wider text-[#F2C14E] mb-3">
                  {groupTitle}
                </h3>
                <ul className="space-y-1.5">
                  {items.map(({ chapter, index }) => {
                    const isCurrent = index === chapterIndex;
                    return (
                      <li key={chapter.id}>
                        <button
                          type="button"
                          onClick={() => {
                            goToChapter(index, 0, true);
                            directoryDialogRef.current?.close();
                          }}
                          className={`w-full text-left rounded-lg px-3 py-2.5 font-['UTM_Avo',sans-serif] transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#F2C14E]/20 border border-[#F2C14E]/45 text-[#FFE5A3]'
                              : 'hover:bg-white/8 text-[#C6B8A3]'
                          }`}
                        >
                          <div className="text-sm leading-snug">{chapter.chapterTitle}</div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-['UTM_Avo',sans-serif] text-xs text-[#B8A994]">
            <span className="italic">Tư liệu: Sa Môn Vô Trí · Đi qua khổ vui cuộc đời (Quyển 01)</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  directoryDialogRef.current?.close();
                  readerDialogRef.current?.showModal();
                }}
                className="text-[#F2C14E] hover:underline cursor-pointer"
              >
                Đọc toàn văn bài viết
              </button>
              <Link href="/vu-tru-phat-giao/tang-kinh-cac" className="text-[#F2C14E] hover:underline">
                Tàng Kinh Các →
              </Link>
            </div>
          </div>
        </div>
      </dialog>

      {/* =====================================================================
          NATIVE <dialog> 2: FULL-ESSAY READER (100% Bài Chốt Sa Môn Vô Trí)
          ===================================================================== */}
      <dialog
        ref={readerDialogRef}
        aria-labelledby="vh-reader-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="vh-modal-dialog w-full"
      >
        <div className="rounded-2xl bg-[#140E0A] text-[#E8DFD3] border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
          <div className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#D4AF37]/20 bg-[#1B130D]">
            <div>
              <p className="font-['UTM_ClassizismAntiqua',serif] text-xs uppercase tracking-[0.2em] text-[#D9B66B]">
                Toàn Văn Bài Viết · Ngày Văn Hóa Việt Nam 24/11
              </p>
              <h2 id="vh-reader-title" className="font-['UTM_Niagara',serif] text-3xl leading-[1.32] pt-1 text-[#FFE5A3]">
                Văn Hóa Soi Đường, Đạo Sáng Non Sông
              </h2>
            </div>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Đóng bản đọc toàn văn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFE5A3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          <article className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8 font-['UTM_Avo',sans-serif]">
            {FULL_ESSAY_SECTIONS.map((sec, secIdx) => (
              <React.Fragment key={sec.heading}>
                {/* Refined YouTube Buddhist Museum Banner right before the Concluding Section (VI.) */}
                {secIdx === FULL_ESSAY_SECTIONS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      readerDialogRef.current?.close();
                      openYoutubePopup();
                    }}
                    className="w-full text-left group/yt flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-gradient-to-r from-[#1D140C] via-[#17100A] to-[#1D140C] border border-[#F2C14E]/40 hover:border-[#F2C14E]/85 p-4 sm:p-5 transition-all shadow-[0_12px_32px_rgba(0,0,0,0.45)] cursor-pointer"
                  >
                    <div className="relative w-full sm:w-52 aspect-video rounded-xl overflow-hidden border border-[#F2C14E]/35 shrink-0">
                      <Image
                        src={MUSEUM_YOUTUBE_VIDEO.thumbnailUrl}
                        alt={MUSEUM_YOUTUBE_VIDEO.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 208px"
                        loading="lazy"
                        className="object-cover group-hover/yt:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-[#F2C14E]/95 text-[#140C07] flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.65)] group-hover/yt:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <p className="font-['UTM_ClassizismAntiqua',serif] text-[11px] uppercase tracking-[0.2em] text-[#D9B66B]">
                        {MUSEUM_YOUTUBE_VIDEO.badge}
                      </p>
                      <h4 className="font-['UTM_ClassizismAntiqua',serif] uppercase text-base sm:text-lg text-[#FFE5A3] mt-1 leading-snug">
                        {MUSEUM_YOUTUBE_VIDEO.title}
                      </h4>
                      <p className="font-['UTM_Avo',sans-serif] italic text-xs sm:text-sm text-[#E5C272]/90 mt-2 inline-flex items-center gap-1.5 group-hover/yt:underline">
                        <span>{MUSEUM_YOUTUBE_VIDEO.subtitle}</span>
                        <Play className="w-3.5 h-3.5 shrink-0" />
                      </p>
                    </div>
                  </button>
                )}

                <section className="space-y-4">
                  <h3 className="font-['UTM_ClassizismAntiqua',serif] uppercase tracking-[0.04em] text-lg sm:text-xl text-[#FFDE59] border-b border-[#F2C14E]/20 pb-2">
                    {sec.heading}
                  </h3>
                {sec.blocks.map((block, bIdx) => {
                  if (block.kind === 'poem') {
                    return (
                      <div
                        key={bIdx}
                        className="group my-5 py-4 px-4 text-center mx-auto max-w-2xl"
                      >
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3" />
                        <div className="border-l-2 border-[#F2C14E]/55 px-5 py-1 inline-block">
                          {block.lines.map((line, lIdx) => (
                            <p
                              key={lIdx}
                              className="italic text-base sm:text-lg leading-loose text-[#FFE5A3]"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3" />
                        <p className="mt-2 text-xs text-[#D4AF5A]/80 italic">— {block.citation}</p>
                      </div>
                    );
                  }
                  if (block.kind === 'quote-prose') {
                    return (
                      <blockquote
                        key={bIdx}
                        className="my-5 pl-5 border-l-2 border-[#F2C14E]/60"
                      >
                        <p className="text-[15px] sm:text-base leading-[1.9] text-[#EFE2C6] italic text-justify [text-align-last:left]">
                          {block.text}
                        </p>
                        <footer className="mt-2 text-xs text-[#D4AF5A]/85 italic text-right">
                          — {block.citation}
                        </footer>
                      </blockquote>
                    );
                  }
                  return (
                    <p
                      key={bIdx}
                      className={`text-[15px] sm:text-base leading-[1.95] text-[#D7CCB8] text-justify [text-align-last:left] ${
                        block.isFirstOfSection
                          ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:font-['UTM_ClassizismAntiqua'] first-letter:text-[#F2C14E] first-letter:leading-[0.82]"
                          : 'indent-6 md:indent-8'
                      }`}
                    >
                      {renderEditorialText(block.text)}
                    </p>
                  );
                })}
                </section>
              </React.Fragment>
            ))}
          </article>
        </div>
      </dialog>

      {/* =====================================================================
          NATIVE <dialog> 3: IN-WEB YOUTUBE VIDEO PLAYER POPUP
          ===================================================================== */}
      <dialog
        ref={youtubeDialogRef}
        onClose={() => setIsYoutubeModalOpen(false)}
        aria-labelledby="vh-youtube-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="vh-modal-dialog w-full"
      >
        <div className="rounded-2xl bg-[#140E0A] text-[#E8DFD3] border border-[#D4AF37]/45 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#1B130D]">
            <div className="min-w-0 pr-3">
              <p className="font-['UTM_ClassizismAntiqua',serif] text-[11px] uppercase tracking-[0.2em] text-[#D9B66B]">
                {MUSEUM_YOUTUBE_VIDEO.badge}
              </p>
              <h2
                id="vh-youtube-title"
                className="font-['UTM_Niagara',serif] text-2xl sm:text-3xl leading-[1.32] pt-1 text-[#FFE5A3] truncate"
              >
                {MUSEUM_YOUTUBE_VIDEO.title}
              </h2>
            </div>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Đóng video"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFE5A3] cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="relative w-full aspect-video bg-black">
            {isYoutubeModalOpen && (
              <iframe
                title={MUSEUM_YOUTUBE_VIDEO.title}
                src={`https://www.youtube.com/embed/${MUSEUM_YOUTUBE_VIDEO.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            )}
          </div>

          <div className="px-6 py-3.5 bg-black/45 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-['UTM_Avo',sans-serif] text-xs text-[#C7B9A4]">
            <span className="italic">Bảo tàng Văn hóa Phật giáo Tùng Lâm Hòa Phúc</span>
            <a
              href={MUSEUM_YOUTUBE_VIDEO.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#F2C14E] hover:underline"
            >
              <span>Mở trên YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </dialog>

      {/* =====================================================================
          NATIVE <dialog> 4: IN-WEB BOOK SHOWCASE POPUP (Đi Qua Khổ Vui Cuộc Đời)
          ===================================================================== */}
      <dialog
        ref={bookDialogRef}
        aria-labelledby="vh-book-title"
        {...({ closedby: 'any' } as Record<string, string>)}
        className="vh-modal-dialog w-full"
      >
        <div className="rounded-2xl bg-[#140E0A] text-[#E8DFD3] border border-[#D4AF37]/45 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#1B130D]">
            <div>
              <p className="font-['UTM_ClassizismAntiqua',serif] text-[11px] uppercase tracking-[0.2em] text-[#D9B66B]">
                Tủ Sách Tàng Kinh Các · Nguồn Tham Khảo Chính
              </p>
              <h2
                id="vh-book-title"
                className="font-['UTM_Niagara',serif] text-2xl sm:text-3xl leading-[1.32] pt-1 text-[#FFE5A3]"
              >
                {REFERENCE_BOOK.title}
              </h2>
            </div>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Đóng thông tin sách"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFE5A3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="overflow-y-auto p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 font-['UTM_Avo',sans-serif]">
            <div className="relative w-44 h-64 mx-auto sm:mx-0 rounded-xl overflow-hidden border border-[#F2C14E]/45 shadow-[0_14px_34px_rgba(0,0,0,0.65)] shrink-0 bg-black/50">
              <Image
                src={REFERENCE_BOOK.coverUrl}
                alt={REFERENCE_BOOK.title}
                fill
                unoptimized
                sizes="176px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <h3 className="font-['UTM_ClassizismAntiqua',serif] uppercase text-lg text-[#FFE5A3]">
                  {REFERENCE_BOOK.title}
                </h3>
                <p className="italic text-sm text-[#D9B66B] mt-1">
                  Tác giả: {REFERENCE_BOOK.author} · {REFERENCE_BOOK.publisher}
                </p>
                <p className="text-xs text-[#B8A994] mt-1">
                  Các trang trích dẫn trong triển lãm: {REFERENCE_BOOK.pagesCited}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <blockquote className="pl-4 border-l-2 border-[#F2C14E]/55 italic text-sm leading-relaxed text-[#F2E5C9]">
                  “Cây có cội, sông có nguồn, con người lấy văn hóa truyền thống làm nền tảng. Nền tảng càng vững càng dễ dàng hội nhập trong bối cảnh toàn cầu hóa.” <span className="text-[#D9B66B]">(tr. 153)</span>
                </blockquote>
                <blockquote className="pl-4 border-l-2 border-[#F2C14E]/55 italic text-sm leading-relaxed text-[#F2E5C9]">
                  “Văn là cái đẹp, cái tốt, cái thiện. Hóa là chuyển hóa, lan toả. Người biết tiếp thu, lắng nghe chuyển hóa bản thân và lan tỏa điều thiện đến người xung quanh gọi là người văn hóa.” <span className="text-[#D9B66B]">(tr. 194)</span>
                </blockquote>
                <blockquote className="pl-4 border-l-2 border-[#F2C14E]/55 italic text-sm leading-relaxed text-[#F2E5C9]">
                  “Đạo nào vượt lên giới hạn của tín ngưỡng, thoát khỏi mặc định của tôn giáo, Đạo đó chính là chỗ con người cần hướng đến.” <span className="text-[#D9B66B]">(tr. 195)</span>
                </blockquote>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={REFERENCE_BOOK.libraryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D97706] via-[#F2C14E] to-[#FFDE59] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#140C07] shadow-[0_6px_20px_rgba(242,193,78,0.35)] hover:brightness-110 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Đọc Ebook / PDF tại Tàng Kinh Các</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
