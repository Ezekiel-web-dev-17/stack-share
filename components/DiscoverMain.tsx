"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import bookmarkLogo from "../assets/icons/Bookmark.svg";
import bookmarkedLogo from "../assets/icons/Boorkmarked.svg";
import logoFlow from "../assets/icons/logoFlow.svg";
import star from "../assets/icons/Star.svg";
import starredIcon from "../assets/icons/Starred.svg";
import InsightIcon from "@/assets/icons/insightIcon.svg";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "./pagination";
import { useDiscover } from "./DiscoverContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const tabs = [
  "New & NoteWorthy",
  "Editor's Pick",
  "Community Favorites",
  "Trending Now",
];

// Tab → backend sortBy mapping
const TAB_SORT: Record<string, { sortBy: string; order: string }> = {
  "New & NoteWorthy":     { sortBy: "createdAt", order: "desc" },
  "Editor's Pick":        { sortBy: "rating",    order: "desc" },
  "Community Favorites":  { sortBy: "rateCount", order: "desc" },
  "Trending Now":         { sortBy: "rateCount", order: "desc" },
};

const SORT_UI_MAP: Record<string, { sortBy: string; order: string }> = {
  Recommended:      { sortBy: "rating",    order: "desc" },
  "Top Rated":      { sortBy: "rating",    order: "desc" },
  "Most Popular":   { sortBy: "rateCount", order: "desc" },
  "Newest Arrivals":{ sortBy: "createdAt", order: "asc"  },
};

const DEBOUNCE_MS = 300;

// ─── Animation variants ───────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
} as const;

const card = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const tabUnderline = {
  inactive: { opacity: 0 },
  active: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tool {
  id: number;
  name: string;
  image: string | null;
  description?: string;
  category?: string;
  bestUseCases?: string[];
  pricing?: { pricingTitle: string; price: number; per: string }[];
  websiteUrl?: string;
  rating?: number | string;
  rateCount?: number | string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPricingLabel(pricing?: Tool["pricing"]) {
  if (!pricing || pricing.length === 0) return null;
  const hasFree = pricing.some((p) => p.price === 0 || p.per?.toLowerCase() === "free");
  const hasPaid = pricing.some((p) => p.price > 0);
  const hasTrial = pricing.some((p) =>
    p.pricingTitle?.toLowerCase().includes("trial")
  );
  if (hasFree && hasPaid) return { label: "Freemium", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };
  if (hasFree) return { label: "Free", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };
  if (hasTrial) return { label: "Trial", color: "text-amber-400 bg-amber-400/10 border-amber-400/30" };
  if (hasPaid) return { label: "Paid", color: "text-[#0D93F2] bg-[#0D93F2]/10 border-[#0D93F2]/30" };
  return null;
}

/** Map frontend price filter labels → what we can infer from the API */
function buildPriceFilter(prices: string[]): string | undefined {
  // We pass the raw filter labels as a comma-separated string;
  // actual filtering happens client-side after fetch (pricing data is returned).
  return prices.length > 0 ? prices.join(",") : undefined;
}

function matchesPriceFilter(tool: Tool, prices: string[]): boolean {
  if (prices.length === 0) return true;
  return prices.some((fp) => {
    if (fp === "Free")
      return (
        !tool.pricing?.length ||
        tool.pricing.some((p) => p.price === 0 || p.per?.toLowerCase() === "free")
      );
    if (fp === "Paid") return tool.pricing?.some((p) => p.price > 0);
    if (fp === "Trial")
      return tool.pricing?.some((p) =>
        p.pricingTitle?.toLowerCase().includes("trial")
      );
    return false;
  });
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="border-2 border-[#223949] rounded-2xl flex flex-col animate-pulse">
      <div className="p-5 flex flex-col gap-4 bg-[#0D93F2]/5 rounded-t-2xl flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#1E293B]" />
            <div className="flex flex-col gap-2 pt-1">
              <div className="h-4 w-28 rounded bg-[#1E293B]" />
              <div className="h-3 w-16 rounded bg-[#1E293B]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-[#1E293B]" />
          <div className="h-3 w-4/5 rounded bg-[#1E293B]" />
        </div>
        <div className="h-14 rounded-lg bg-[#101B22]/60 mt-auto" />
      </div>
      <div className="h-14 rounded-b-2xl bg-[#040c11]" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DiscoverMain() {
  const { activeTab, setActiveTab, searchQuery, filters } = useDiscover();

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Recommended");
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [starred, setStarred] = useState<Record<number, boolean>>({});

  // ─── Debounced search query ───────────────────────────────────────────────
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to page 1 on every new search
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  // Reset page when filters or tab change
  useEffect(() => {
    setPage(1);
  }, [activeTab, filters]);

  // ─── Fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    setLoading(true);
    setError(null);

    // Build query params
    const tabSort = TAB_SORT[activeTab] ?? TAB_SORT["New & NoteWorthy"];
    const uiSort = SORT_UI_MAP[sortBy] ?? SORT_UI_MAP["Recommended"];

    // UI sort takes priority over tab sort when the user explicitly changes it
    const resolvedSortBy = sortBy === "Recommended" ? tabSort.sortBy : uiSort.sortBy;
    const resolvedOrder  = sortBy === "Recommended" ? tabSort.order  : uiSort.order;

    const params = new URLSearchParams({
      page:   String(page),
      limit:  "9",
      sortBy: resolvedSortBy,
      order:  resolvedOrder,
    });

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    fetch(`/api/tools?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tools");
        return res.json();
      })
      .then((data) => {
        const meta = data.meta ?? {};
        setTools(data.data || []);
        setTotalPages(meta.totalPages ?? 1);
        setTotalResults(meta.total ?? 0);
        setHasNext(meta.hasNext ?? false);
        setHasPrevious(meta.hasPrev ?? false);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        console.error("[tools]", err);
        setError("Failed to load tools. Please try again.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [activeTab, page, sortBy, debouncedSearch, filters]);

  // ─── Client-side price filter (applied after fetch) ──────────────────────
  // Name/description search is server-side. Price filtering is done here
  // because the backend doesn't expose a pricing filter param yet.
  const displayedTools =
    filters.prices.length > 0 && filters.prices.length < 3
      ? tools.filter((t) => matchesPriceFilter(t, filters.prices))
      : tools;

  const toggleBookmark = (id: number) =>
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleStar = (id: number) =>
    setStarred((prev) => ({ ...prev, [id]: !prev[id] }));

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <motion.main
      className="flex flex-col border-2 border-[#223949] w-full p-0"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Tabs */}
      <div className="px-3 sm:px-10 border-b-2 border-[#223949] overflow-hidden">
        <div className="inner-container flex items-start justify-start gap-3 sm:gap-10 overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative border-b-4 pt-4 pb-3 text-center text-[14px] font-bold cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "border-primary text-white"
                    : "border-transparent text-muted hover:text-white/70"
                }`}
              >
                {tab}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="underline"
                      variants={tabUnderline}
                      initial="inactive"
                      animate="active"
                      exit="inactive"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-10">
        {/* Header row */}
        <motion.div
          className="flex items-center justify-between flex-col sm:flex-row gap-3 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-[14px] self-start">
            <span className="text-muted">Tools</span>
            {" / "}
            <span className="text-white font-medium">
              {loading ? "Loading…" : `${totalResults} results`}
            </span>
            {debouncedSearch && (
              <span className="text-muted">
                {" "}
                for &ldquo;<span className="text-[#0D93F2]">{debouncedSearch}</span>&rdquo;
              </span>
            )}
          </div>
          <div className="flex gap-3 items-center self-end sm:self-auto">
            <p className="text-sm">Sort By:</p>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-[#162430] text-white rounded-lg px-3 py-1.5 text-sm appearance-none outline-none border border-[#223949] cursor-pointer"
            >
              <option value="Recommended">Recommended</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
            </select>
          </div>
        </motion.div>

        <div className="overflow-y-auto h-[calc(100vh-16.25em)]">
          {/* Loading — skeleton grid */}
          {loading && (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <p className="text-red-400 font-semibold">{error}</p>
              <button
                onClick={() => setActiveTab(activeTab)}
                className="px-5 py-2 rounded-lg bg-[#0D93F2]/10 text-[#0D93F2] text-sm font-semibold hover:bg-[#0D93F2]/20 transition-colors cursor-pointer "
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && displayedTools.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center text-3xl">
                🔍
              </div>
              <p className="text-lg font-semibold text-[#F1F5F9]">No tools found</p>
              <p className="text-sm text-[#64748B] max-w-xs">
                Try adjusting your search term or clearing some filters.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && displayedTools.length > 0 && (
            <motion.div
              className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
              key={`${activeTab}-${page}-${debouncedSearch}`}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {displayedTools.map((tool) => {
                const pricingBadge = getPricingLabel(tool.pricing);
                return (
                  <motion.div
                    key={tool.id}
                    className="border-2 border-[#223949] rounded-2xl flex flex-col justify-between group"
                    variants={card}
                    whileHover={{ y: -3, borderColor: "rgba(13,147,242,0.35)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Card body */}
                    <div className="p-5 flex flex-col gap-4 bg-[#0D93F2]/5 rounded-t-2xl flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 place-content-center bg-[#1E293B] border border-[#223949]">
                            {tool.image ? (
                              <Image
                                src={tool.image}
                                alt={tool.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Image
                                src={InsightIcon}
                                alt="Tool icon"
                                className="w-6 h-6 object-cover mx-auto"
                              />
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-base leading-tight">{tool.name}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {tool.category && (
                                <span className="text-[10px] font-medium text-muted bg-[#1E293B] px-2 py-0.5 rounded-full">
                                  {tool.category}
                                </span>
                              )}
                              {pricingBadge && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pricingBadge.color}`}
                                >
                                  {pricingBadge.label}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          className="cursor-pointer shrink-0 mt-0.5"
                          onClick={() => toggleBookmark(tool.id)}
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.1 }}
                          aria-label="Toggle bookmark"
                        >
                          <Image
                            src={bookmarked[tool.id] ? bookmarkedLogo : bookmarkLogo}
                            alt="Bookmark"
                          />
                        </motion.button>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-6 font-normal text-muted line-clamp-2">
                        {tool.description ||
                          `Automate your tasks with ${tool.name} — one of the best AI tools for professionals.`}
                      </p>

                      {/* Best use-case chips */}
                      {tool.bestUseCases && tool.bestUseCases.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tool.bestUseCases.slice(0, 3).map((uc) => (
                            <span
                              key={uc}
                              className="text-[10px] font-medium text-[#90B2CB] bg-[#0D93F2]/5 border border-[#223949] px-2 py-0.5 rounded-lg"
                            >
                              {uc}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Top workflow banner */}
                      <div className="bg-[#101B22]/60 rounded-lg p-3 mt-auto border border-[#162430]">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-muted text-[10px] leading-3.5 font-bold tracking-wide">
                            TOP WORKFLOW
                          </p>
                          <Image src={logoFlow} alt="workflow icon" />
                        </div>
                        <p className="text-sm leading-6 font-bold text-white truncate max-w-full">
                          Idea ⇢{" "}
                          <span className="text-[#0D93F2]">{tool.name}</span>{" "}
                          ⇢ Solution
                        </p>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between bg-[#040c11] rounded-b-2xl px-5 py-4 shrink-0">
                      <div className="flex gap-2 items-center">
                        <motion.button
                          type="button"
                          onClick={() => toggleStar(tool.id)}
                          whileHover={{ rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Star tool"
                        >
                          <Image
                            src={starred[tool.id] ? starredIcon : star}
                            className="cursor-pointer"
                            alt="Star"
                          />
                        </motion.button>
                        <p className="text-muted text-xs font-normal">
                          <span className="text-white text-sm font-bold">
                            {tool.rating ?? "—"}
                          </span>{" "}
                          ({tool.rateCount ?? 0})
                        </p>
                      </div>

                      {tool.websiteUrl ? (
                        <a
                          href={tool.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#0D93F2] bg-[#0D93F2]/10 hover:bg-[#0D93F2]/20 transition-colors px-3 py-1.5 rounded-lg"
                        >
                          View Tool ↗
                        </a>
                      ) : (
                        <motion.button
                          className="text-xs font-medium text-[#0D93F2] bg-[#0D93F2]/10 hover:bg-[#0D93F2]/20 transition-colors px-3 py-1.5 rounded-lg cursor-pointer"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          View Tool
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </div>
      </div>
    </motion.main>
  );
}
