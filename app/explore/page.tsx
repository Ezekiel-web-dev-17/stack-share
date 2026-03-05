"use client";

import Footer from "@/components/Footer";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState, useOptimistic, startTransition, useCallback, useMemo, useRef } from "react";
import likes from "../../assets/icons/likeIcon.svg";
import views from "../../assets/icons/viewsEye.svg";
import Person from "../../assets/icons/personIcon.svg";
import enterArrow from "../../assets/icons/arrow-right.svg";
import Image from "next/image";
import Pagination from "@/components/pagination";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface Tool {
  id: number;
  name: string;
  image: string | null;
}

interface Workflow {
  id: string;
  title: string;
  role: string;
  description: string;
  toolStack: string[];
  insight: string;
  isDraft: boolean;
  likes: number;
  views: number;
  clones: number;
  author: Author;
  setupTime: string;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: string[] = [
  "All",
  "Marketing",
  "Engineering",
  "Operations",
  "Creative",
  "Research",
  "Video Editor",
];

const SORT_BY: string[] = ["Trending", "Newest", "Top Rated"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n > 999_999) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n > 999) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  const y = Math.floor(mo / 12);
  if (y > 0) return `${y} yr${y > 1 ? "s" : ""} ago`;
  if (mo > 0) return `${mo} mth${mo > 1 ? "s" : ""} ago`;
  if (d > 0) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h > 0) return `${h} hr${h > 1 ? "s" : ""} ago`;
  if (m > 0) return `${m} min${m > 1 ? "s" : ""} ago`;
  return "just now";
}

function buildWorkflowUrl(base: string, tab: string, order: string, page: number): string {
  const params = new URLSearchParams({
    orderBy: order.toLowerCase().replace(" ", "-"),
    page: String(page),
  });
  if (tab !== "All") params.set("role", tab);
  const endpoint = tab === "All" ? "/workflows" : "/workflows/search";
  return `${base}${endpoint}?${params.toString()}`;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
} as const;

const headerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 } },
} as const;

const cardListVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Explore() {
  const [currentTab, setCurrentTab] = useState("All");
  const [currentOrder, setCurrentOrder] = useState("Trending");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Stable headers — rebuilt only when env vars change (they don't at runtime, but
  // useMemo keeps the object reference stable so it can safely be in dep arrays).
  const headers = useMemo<HeadersInit>(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    }),
    []
  );

  // ─── Optimistic likes ─────────────────────────────────────────────────────

  const [optimisticWorkflows, addOptimisticWorkflowUpdate] = useOptimistic(
    workflows,
    (state: Workflow[], update: { id: string }) =>
      state.map((wf) =>
        wf.id === update.id ? { ...wf, likes: wf.likes + 1 } : wf
      )
  );

  const updateLike = useCallback(
    (id: string) => {
      startTransition(() => {
        addOptimisticWorkflowUpdate({ id });
      });

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${id}/like`, {
        method: "POST",
        headers: {
          ...headers,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Like failed");
          return res.json() as Promise<{ data: Workflow }>;
        })
        .then(({ data }) =>
          setWorkflows((prev) => prev.map((w) => (w.id === data.id ? data : w)))
        )
        .catch((err) => console.error("[like]", err));
    },
    [headers, addOptimisticWorkflowUpdate]
  );

  // ─── Fetch tools once ─────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools`, {
      headers,
      cache: "force-cache",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tools");
        return res.json() as Promise<{ data: Tool[] }>;
      })
      .then(({ data }) => setTools(data))
      .catch((err) => console.error("[tools]", err));
  }, [headers]);

  // ─── Fetch workflows (tab / order / page) ─────────────────────────────────

  // Keep an AbortController ref so we can cancel in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  const fetchWorkflows = useCallback(
    (tab: string, order: string, pg: number) => {
      // Cancel any stale request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const url = buildWorkflowUrl(
        process.env.NEXT_PUBLIC_API_URL ?? "",
        tab,
        order,
        pg
      );

      fetch(url, { headers, signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Server error ${res.status}`);
          return res.json() as Promise<{ data: Workflow[]; meta: { totalPages: number } }>;
        })
        .then(({ data, meta }) => {
          setWorkflows(data);
          setTotalPages(meta.totalPages);
        })
        .catch((err) => {
          if ((err as Error).name === "AbortError") return; // stale request — ignore
          console.error("[workflows]", err);
          setError((err as Error).message ?? "Something went wrong");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    },
    [headers]
  );

  useEffect(() => {
    fetchWorkflows(currentTab, currentOrder, page);
    // Cleanup on unmount
    return () => abortRef.current?.abort();
  }, [currentTab, currentOrder, page, fetchWorkflows]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen bg-background ${spaceGrotesk.variable}`}>
      <Navbar />
      <motion.main
        className="p-4 lg:p-8"
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header
          className="mb-2"
          variants={headerVariants}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-4xl font-bold text-white">Explore All Workflows</h1>
          <p className="font-normal text-lg text-[#94A3B8] mt-1">
            Find and share the ultimate AI tool stacks for modern digital work.
          </p>
        </motion.header>

        <div className="flex justify-center items-center flex-col py-8 gap-8">
          {/* ── Filter bar ── */}
          <div className="flex flex-col lg:flex-row items-start justify-start gap-2 lg:gap-0 lg:justify-between lg:items-center w-full border-b border-[#1E293B] pb-2">
            <nav aria-label="Category filter" className="overflow-x-scroll w-full">
              <div className="flex gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`py-1 lg:py-2 px-2 lg:px-4 font-bold text-xs lg:text-sm cursor-pointer transition-colors duration-200 ${
                      tab === currentTab
                        ? "border-b-2 border-[#0D93F2] text-white"
                        : "text-[#64748B] hover:text-[#94A3B8]"
                    }`}
                    onClick={() => {
                      if (tab === currentTab) return;
                      setCurrentTab(tab);
                      setPage(1); // reset to first page on tab change
                    }}
                    aria-current={tab === currentTab ? "true" : undefined}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </nav>

            <div
              role="group"
              aria-label="Sort options"
              className="flex justify-between w-full lg:w-fit lg:gap-2 bg-[#182934] p-1 rounded-lg"
            >
              {SORT_BY.map((sort) => (
                <motion.button
                  key={sort}
                  className={`${
                    currentOrder === sort
                      ? "text-white bg-[#101B22]"
                      : "text-[#90B2CB]"
                  } font-semibold text-sm cursor-pointer rounded-md px-4 py-0.5 lg:py-1.5 text-nowrap transition-colors duration-200`}
                  onClick={() => {
                    if (sort === currentOrder) return;
                    setCurrentOrder(sort);
                    setPage(1); // reset to first page on order change
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {sort}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="flex flex-col gap-10 w-full animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col lg:flex-row justify-between relative gap-6 p-5 border border-[#1E293B] rounded-xl bg-transparent"
                >
                  <div className="flex flex-col gap-2 w-full lg:w-3/4">
                    <div className="gap-3 flex items-center mb-1">
                      <div className="rounded-full bg-[#1E293B] h-5 w-24" />
                      <div className="rounded-full bg-[#1E293B] h-5 w-5" />
                      <div className="h-4 w-40 bg-[#1E293B] rounded" />
                    </div>
                    <div className="h-7 w-3/4 lg:w-1/2 bg-[#1E293B] rounded mt-2" />
                    <div className="h-4 w-full bg-[#1E293B] rounded mt-3" />
                    <div className="h-4 w-5/6 bg-[#1E293B] rounded mt-1" />
                  </div>
                  <div className="flex flex-row lg:flex-col items-end justify-between border-t lg:border-t-0 lg:border-l border-[#1E293B] w-full lg:w-35 pt-2 lg:pt-0">
                    <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-3 w-full lg:w-auto mt-2 lg:mt-0 lg:pl-4">
                      <div className="h-5 w-16 bg-[#1E293B] rounded" />
                      <div className="h-5 w-16 bg-[#1E293B] rounded" />
                    </div>
                    <div className="h-10 w-10 bg-[#1E293B] rounded-lg lg:ml-4" />
                  </div>
                  <div className="absolute gap-2 flex items-center -bottom-6">
                    <div className="flex -gap-4 relative">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-8 w-8 bg-[#1E293B] rounded-lg border-l-2 border-background"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-red-400 text-lg font-semibold">Failed to load workflows</p>
              <p className="text-sm text-[#94A3B8]">{error}</p>
              <button
                onClick={() => fetchWorkflows(currentTab, currentOrder, page)}
                className="mt-2 px-5 py-2 rounded-lg bg-[#0D93F2]/10 text-[#0D93F2] text-sm font-semibold hover:bg-[#0D93F2]/20 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── Workflow list ── */}
          {!loading && !error && (
            <AnimatePresence mode="wait">
              <motion.ul
                key={`${currentTab}-${currentOrder}-${page}`}
                className="flex flex-col gap-10 w-full list-none p-0 m-0"
                variants={cardListVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {optimisticWorkflows.length > 0 ? (
                  optimisticWorkflows.map((workflow) => {
                    const extraTools = workflow.toolStack.length - 3;
                    return (
                      <motion.li
                        key={workflow.id}
                        variants={cardVariants}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      >
                        <article className="flex flex-col lg:flex-row justify-between relative gap-6 p-5 border border-[#1E293B] rounded-xl hover:border-[#315168] transition-colors duration-300">
                          <div className="flex flex-col gap-2">
                            <div className="gap-3 flex items-center">
                              <span className="rounded-full bg-[#0D93F2]/10 px-2.5 py-0.5 text-xs text-[#0D93F2] font-bold place-content-center">
                                {workflow.role.toUpperCase()}
                              </span>
                              <Image src={Person} alt="person icon" />
                              <p className="text-sm text-[#94A3B8]">
                                @{workflow.author.name}&nbsp;•&nbsp;{timeAgo(workflow.createdAt)}
                              </p>
                            </div>
                            <h2 className="text-[#F1F5F9] text-xl font-bold cursor-pointer hover:text-[#0D93F2] transition-colors duration-200">
                              {workflow.title}
                            </h2>
                            <p className="text-sm font-normal text-[#94A3B8] max-w-3/4">
                              {workflow.description}
                            </p>
                          </div>

                          {/* Tools & actions */}
                          <div className="flex flex-row lg:flex-col items-end justify-between border-t lg:border-t-0 lg:border-l border-[#1E293B] w-full lg:w-35 pt-2 lg:pt-0">
                            <div className="flex flex-row lg:flex-col justify-between gap-4 lg:gap-1">
                              <div
                                className="flex gap-1.5 items-center cursor-pointer text-sm font-medium text-[#94A3B8]"
                                title={`${workflow.views} view${workflow.views !== 1 ? "s" : ""}`}
                              >
                                <Image src={views} className="w-4" alt="views" />
                                {formatCount(workflow.views)}
                              </div>
                              <button
                                type="button"
                                aria-label={`Like this workflow (${workflow.likes} likes)`}
                                className="text-[#0D93F2] flex gap-1.5 items-center cursor-pointer text-sm font-bold bg-transparent border-none p-0"
                                onClick={() => updateLike(workflow.id)}
                              >
                                <Image src={likes} className="w-4" alt="likes" />
                                {formatCount(workflow.likes)}
                              </button>
                            </div>

                            <motion.span
                              className="p-2 place-content-center bg-[#1E293B] hover:bg-transparent rounded-lg cursor-pointer"
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.93 }}
                              transition={{ duration: 0.18 }}
                            >
                              <Image src={enterArrow} alt="Open workflow" />
                            </motion.span>
                          </div>

                          {/* Tool chips */}
                          <div className="absolute gap-2 flex items-center -bottom-9">
                            <div className="flex -gap-4 relative">
                              {workflow.toolStack.slice(0, 3).map((toolName, i) => {
                                const matchedTool = tools.find((t) => t.name === toolName);
                                return (
                                  <div
                                    key={`${toolName}-${i}`}
                                    className="px-2 py-2 bg-[#1E293B] rounded-lg border-l-2 border-background z-0 place-content-center"
                                    title={toolName}
                                  >
                                    {matchedTool?.image ? (
                                      <Image
                                        src={matchedTool.image}
                                        width={15}
                                        height={15}
                                        alt={toolName}
                                        className="max-w-3.75 max-h-3.75"
                                      />
                                    ) : (
                                      <span className="w-3.75 h-3.75 rounded bg-border-light inline-block" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {extraTools > 0 && (
                              <p className="text-xs text-[#64748B] font-medium">
                                {extraTools === 1
                                  ? `+${workflow.toolStack[3]}`
                                  : `+${extraTools} more`}
                              </p>
                            )}
                          </div>
                        </article>
                      </motion.li>
                    );
                  })
                ) : (
                  <motion.div
                    className="flex flex-col items-center gap-3 py-20 text-center"
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <p className="text-lg font-semibold text-[#F1F5F9]">No workflows found</p>
                    <p className="text-sm text-[#64748B]">
                      Try a different category or sort order.
                    </p>
                  </motion.div>
                )}
              </motion.ul>
            </AnimatePresence>
          )}
        </div>

        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </motion.main>

      <Footer />
    </div>
  );
}
