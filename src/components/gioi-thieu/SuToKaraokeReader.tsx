'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BookOpen,
  LayoutGrid,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';

export interface SuToKaraokeReaderProps {
  rawContent: string;
  title: string;
  subtitle?: string;
  autoPlay?: boolean;
  speedMultiplier?: number;
  onComplete?: () => void;
}

interface KaraokeSegment {
  id: number;
  kind: 'heading' | 'bullet' | 'list' | 'prose';
  label?: string;
  text: string;
  words: string[];
  spokenText: string;
}

interface TtsClause {
  text: string;
  wordCount: number;
}

function stripMarkdown(input: string): string {
  return input
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

function parseBiographySegments(raw: string): KaraokeSegment[] {
  const lines = raw.split(/\r?\n/);
  const segments: KaraokeSegment[] = [];
  let idCounter = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    if (/^#{1,4}\s+/.test(trimmed)) {
      const headingText = stripMarkdown(trimmed.replace(/^#{1,4}\s+/, ''));
      const words = headingText.split(/\s+/).filter(Boolean);
      segments.push({
        id: idCounter++,
        kind: 'heading',
        text: headingText,
        words,
        spokenText: headingText,
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const body = trimmed.replace(/^[-*]\s+/, '');
      const boldMatch = body.match(/^\*\*(.+?)\*\*\s*(.*)$/);
      if (boldMatch) {
        const label = stripMarkdown(boldMatch[1]);
        const rest = stripMarkdown(boldMatch[2]);
        const combined = rest ? `${label} ${rest}` : label;
        segments.push({
          id: idCounter++,
          kind: 'bullet',
          label,
          text: rest,
          words: combined.split(/\s+/).filter(Boolean),
          spokenText: combined,
        });
      } else {
        const clean = stripMarkdown(body);
        segments.push({
          id: idCounter++,
          kind: 'bullet',
          text: clean,
          words: clean.split(/\s+/).filter(Boolean),
          spokenText: clean,
        });
      }
      continue;
    }

    const listMatch = trimmed.match(/^(\d+[.)])\s+(.*)$/);
    if (listMatch) {
      const numLabel = listMatch[1];
      const clean = stripMarkdown(listMatch[2]);
      const spoken = clean;
      const displayWords = `${numLabel} ${clean}`.split(/\s+/).filter(Boolean);
      segments.push({
        id: idCounter++,
        kind: 'list',
        label: numLabel,
        text: clean,
        words: displayWords,
        spokenText: spoken,
      });
      continue;
    }

    const proseClean = stripMarkdown(trimmed);
    if (proseClean) {
      segments.push({
        id: idCounter++,
        kind: 'prose',
        text: proseClean,
        words: proseClean.split(/\s+/).filter(Boolean),
        spokenText: proseClean,
      });
    }
  }

  return segments;
}

function splitIntoTtsClauses(spokenText: string, maxChars = 165): TtsClause[] {
  const words = spokenText.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const clauses: TtsClause[] = [];
  let buf: string[] = [];

  const flush = () => {
    if (buf.length > 0) {
      clauses.push({ text: buf.join(' '), wordCount: buf.length });
      buf = [];
    }
  };

  for (const w of words) {
    const candidate = buf.length > 0 ? `${buf.join(' ')} ${w}` : w;
    if (candidate.length > maxChars && buf.length > 0) {
      flush();
      buf.push(w);
      continue;
    }
    buf.push(w);
    if (/[.;!?]$/.test(w) && candidate.length >= 60) {
      flush();
    } else if (/[,:]$/.test(w) && candidate.length >= 110) {
      flush();
    }
  }
  flush();
  return clauses;
}

export function SuToKaraokeReader({
  rawContent,
  title,
  subtitle,
  autoPlay = false,
  speedMultiplier = 1,
  onComplete,
}: SuToKaraokeReaderProps) {
  const segments = useMemo(() => parseBiographySegments(rawContent), [rawContent]);

  const [viewMode, setViewMode] = useState<'karaoke' | 'infographic'>('karaoke');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [highlightedWordCount, setHighlightedWordCount] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<0.9 | 1.0 | 1.2>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioBlocked, setAudioBlocked] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const effectiveRate = playbackRate * speedMultiplier;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setIsPlaying(autoPlay);
    if (autoPlay) {
      setIsCompleted(false);
    }
  }, [autoPlay]);

  // Smoothly center the currently spoken segment inside the scroll box without jumping the outer window
  useEffect(() => {
    if (viewMode !== 'karaoke') return;
    const container = scrollContainerRef.current;
    const targetEl = segmentRefs.current[activeIdx];
    if (!container || !targetEl) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const desiredTop =
      container.scrollTop +
      (targetRect.top - containerRect.top) -
      container.clientHeight / 2 +
      targetRect.height / 2;

    container.scrollTo({
      top: Math.max(0, desiredTop),
      behavior: 'smooth',
    });
  }, [activeIdx, viewMode]);

  const advanceToNextSegment = useCallback(() => {
    setActiveIdx((prev) => {
      if (prev + 1 < segments.length) {
        setHighlightedWordCount(0);
        return prev + 1;
      }
      setIsPlaying(false);
      setIsCompleted(true);
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 1500);
      return prev;
    });
  }, [segments.length]);

  // Core synchronized Audio TTS + Fallback Karaoke Timer
  useEffect(() => {
    if (viewMode !== 'karaoke' || !isPlaying || segments.length === 0) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const segment = segments[activeIdx];
    if (!segment) return;

    let cancelled = false;
    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();

    const runTimerFallback = (startWord = 0) => {
      const totalWords = segment.words.length || 1;
      const msPerWord = Math.max(115, Math.round(215 / Math.max(0.5, effectiveRate)));
      let currentWord = startWord;

      const tick = () => {
        if (cancelled) return;
        currentWord += 1;
        setHighlightedWordCount(currentWord);
        if (currentWord >= totalWords) {
          timerId = setTimeout(() => {
            if (!cancelled) advanceToNextSegment();
          }, segment.kind === 'heading' ? 500 : 280);
        } else {
          timerId = setTimeout(tick, msPerWord);
        }
      };

      setHighlightedWordCount(Math.max(1, startWord));
      timerId = setTimeout(tick, msPerWord);
    };

    const runAudioSequence = async () => {
      if (isMuted || audioBlocked) {
        runTimerFallback(0);
        return;
      }

      const clauses = splitIntoTtsClauses(segment.spokenText, 165);
      if (clauses.length === 0) {
        runTimerFallback(0);
        return;
      }

      const wordScale =
        segment.words.length > 0
          ? segment.words.length /
            Math.max(1, clauses.reduce((sum, c) => sum + c.wordCount, 0))
          : 1;

      let cumulativeClauseWords = 0;

      for (let cIdx = 0; cIdx < clauses.length; cIdx++) {
        if (cancelled) return;
        const clause = clauses[cIdx];
        const url = `/api/tts/vi?text=${encodeURIComponent(clause.text)}`;

        try {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.playbackRate = Math.min(2, Math.max(0.65, effectiveRate));

          const playedCleanly = await new Promise<'ended' | 'blocked' | 'error'>((resolve) => {
            let settled = false;
            const settle = (status: 'ended' | 'blocked' | 'error') => {
              if (settled) return;
              settled = true;
              cancelAnimationFrame(rafId);
              audio.onended = null;
              audio.onerror = null;
              resolve(status);
            };

            const syncWords = () => {
              if (cancelled || settled) return;
              const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
              if (dur > 0) {
                const frac = Math.min(1, audio.currentTime / dur);
                const mapped = Math.round(
                  (cumulativeClauseWords + frac * clause.wordCount) * wordScale
                );
                setHighlightedWordCount(Math.min(segment.words.length, Math.max(1, mapped)));
              }
              rafId = requestAnimationFrame(syncWords);
            };

            audio.onended = () => {
              const mapped = Math.round(
                (cumulativeClauseWords + clause.wordCount) * wordScale
              );
              setHighlightedWordCount(Math.min(segment.words.length, mapped));
              settle('ended');
            };

            audio.onerror = () => settle('error');

            controller.signal.addEventListener('abort', () => {
              audio.pause();
              settle('error');
            });

            audio
              .play()
              .then(() => {
                if (!cancelled) {
                  rafId = requestAnimationFrame(syncWords);
                }
              })
              .catch((err: unknown) => {
                if (err instanceof Error && err.name === 'NotAllowedError') {
                  settle('blocked');
                } else {
                  settle('error');
                }
              });
          });

          if (cancelled) return;

          if (playedCleanly === 'blocked') {
            setAudioBlocked(true);
            runTimerFallback(Math.round(cumulativeClauseWords * wordScale));
            return;
          }

          if (playedCleanly === 'error') {
            runTimerFallback(Math.round(cumulativeClauseWords * wordScale));
            return;
          }

          cumulativeClauseWords += clause.wordCount;
        } catch {
          if (!cancelled) {
            runTimerFallback(Math.round(cumulativeClauseWords * wordScale));
          }
          return;
        }
      }

      if (!cancelled) {
        timerId = setTimeout(() => {
          if (!cancelled) advanceToNextSegment();
        }, segment.kind === 'heading' ? 450 : 250);
      }
    };

    runAudioSequence();

    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [
    viewMode,
    isPlaying,
    activeIdx,
    segments,
    effectiveRate,
    isMuted,
    audioBlocked,
    advanceToNextSegment,
  ]);

  const handleTogglePlay = () => {
    setAudioBlocked(false);
    if (isCompleted) {
      setIsCompleted(false);
      setActiveIdx(0);
      setHighlightedWordCount(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleRestart = () => {
    setAudioBlocked(false);
    setIsCompleted(false);
    setActiveIdx(0);
    setHighlightedWordCount(0);
    setIsPlaying(true);
  };

  const handleUnlockAudio = () => {
    setIsMuted(false);
    setAudioBlocked(false);
    if (!isPlaying) setIsPlaying(true);
  };

  const renderKaraokeWords = (segment: KaraokeSegment, isCurrent: boolean, isPast: boolean) => {
    return segment.words.map((word, wIdx) => {
      const lit = isCurrent ? wIdx < Math.max(1, highlightedWordCount) : isPast;
      return (
        <span
          key={`${segment.id}-${wIdx}`}
          className={`transition-colors duration-150 ${
            isCurrent
              ? lit
                ? 'text-[#FFDE59] drop-shadow-[0_0_8px_rgba(255,222,89,0.55)] font-semibold'
                : 'text-[#e3d2c1]/55'
              : isPast
              ? 'text-[#FFE5A3]/75'
              : 'text-[#e3d2c1]/85'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const progressPercent =
    segments.length > 0 ? Math.round(((activeIdx + 1) / segments.length) * 100) : 0;

  return (
    <div style={{ fontFamily: "'UTM Avo', sans-serif" }} className="flex flex-col h-full min-h-0 gap-4">
      {/* Top Sticky Karaoke & View Toolbar */}
      <div className="shrink-0 rounded-xl border border-[#F2C14E]/35 bg-[#120A05]/95 p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {viewMode === 'karaoke' ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F2C14E] text-[#140C07] text-xs font-extrabold uppercase tracking-wider hover:bg-[#FFDE59] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Tạm Dừng Đọc' : isCompleted ? 'Đọc Lại' : 'Nghe Đọc Bài'}</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                aria-label="Đọc lại từ đầu"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#F2C14E]/40 bg-[#1D120B] text-[#FFE5A3] text-xs font-bold uppercase tracking-wider hover:border-[#FFDE59] hover:text-[#FFDE59] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Từ Đầu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudioBlocked(false);
                  setIsMuted((m) => !m);
                }}
                aria-label={isMuted ? 'Bật tiếng giọng đọc' : 'Tắt tiếng'}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isMuted
                    ? 'border-amber-500/40 bg-amber-950/50 text-amber-200'
                    : 'border-[#F2C14E]/40 bg-[#1D120B] text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="flex items-center rounded-lg border border-[#F2C14E]/35 bg-[#1A1009] p-0.5 text-[11px] font-bold">
                {([0.9, 1.0, 1.2] as const).map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-[#F2C14E] text-[#140C07]'
                        : 'text-[#e3d2c1]/70 hover:text-[#FFDE59]'
                    }`}
                  >
                    {rate === 1 ? '1.0x' : `${rate}x`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFDE59]">
              <BookOpen className="w-4 h-4" />
              <span>Chế Độ Thẻ Infographic</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (viewMode === 'karaoke') {
                setIsPlaying(false);
                setViewMode('infographic');
              } else {
                setViewMode('karaoke');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#F2C14E]/45 bg-[#23150C] text-[#FFDE59] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
          >
            {viewMode === 'karaoke' ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Xem Dạng Infographic</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Chế Độ Karaoke Giọng Đọc</span>
              </>
            )}
          </button>
        </div>

        {viewMode === 'karaoke' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#FFE5A3]/80">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-[#FFDE59] animate-pulse' : 'bg-[#F2C14E]/40'
                  }`}
                />
                <span>
                  {isPlaying
                    ? 'Đang đọc toàn văn tiểu sử (Nhấp vào bất kỳ dòng nào để nghe tại đó)'
                    : isCompleted
                    ? 'Đã đọc trọn vẹn toàn văn tiểu sử Sư Tổ'
                    : 'Nhấn Nghe Đọc Bài hoặc chọn một dòng bên dưới'}
                </span>
              </span>
              <span className="font-bold text-[#FFDE59]">
                Dòng {activeIdx + 1} / {segments.length}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#2A190F] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B67E1E] via-[#F2C14E] to-[#FFDE59] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {audioBlocked && !isMuted && (
              <button
                type="button"
                onClick={handleUnlockAudio}
                className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[#FFDE59]/70 bg-[#2C1B0F] text-[#FFDE59] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Trình duyệt đang tạm khóa âm thanh tự động — Bấm để bật tiếng giọng đọc</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Scrollable Reader Body */}
      {viewMode === 'karaoke' ? (
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-2.5 max-h-[60dvh]"
        >
          {segments.map((seg, idx) => {
            const isCurrent = idx === activeIdx && (isPlaying || highlightedWordCount > 0);
            const isPast = idx < activeIdx;

            if (seg.kind === 'heading') {
              return (
                <div
                  key={seg.id}
                  ref={(el) => {
                    segmentRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    setActiveIdx(idx);
                    setHighlightedWordCount(0);
                    setIsCompleted(false);
                    setIsPlaying(true);
                  }}
                  className={`mt-4 first:mt-0 px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#2E1C10] border-[#FFDE59] shadow-[0_0_24px_rgba(255,222,89,0.3)] scale-[1.01]'
                      : 'bg-[#1D120B]/70 border-[#F2C14E]/25 hover:border-[#F2C14E]/60'
                  }`}
                >
                  <h4
                    style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                    className="text-2xl sm:text-3xl uppercase tracking-wider leading-snug"
                  >
                    {renderKaraokeWords(seg, isCurrent, isPast)}
                  </h4>
                </div>
              );
            }

            return (
              <div
                key={seg.id}
                ref={(el) => {
                  segmentRefs.current[idx] = el;
                }}
                onClick={() => {
                  setActiveIdx(idx);
                  setHighlightedWordCount(0);
                  setIsCompleted(false);
                  setIsPlaying(true);
                }}
                className={`px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer text-sm sm:text-base md:text-[17px] leading-relaxed ${
                  isCurrent
                    ? 'bg-[#28180E] border-[#FFDE59] shadow-[0_0_22px_rgba(242,193,78,0.28)] scale-[1.01]'
                    : isPast
                    ? 'bg-[#140C07]/60 border-[#F2C14E]/12 opacity-80 hover:opacity-100'
                    : 'bg-[#170E09]/80 border-[#F2C14E]/15 hover:border-[#F2C14E]/50'
                } ${seg.kind === 'bullet' || seg.kind === 'list' ? 'pl-5' : ''}`}
              >
                {renderKaraokeWords(seg, isCurrent, isPast)}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto max-h-[62dvh] pr-1">
          <InfographicArticleRenderer rawContent={rawContent} title={title} subtitle={subtitle} />
        </div>
      )}
    </div>
  );
}
