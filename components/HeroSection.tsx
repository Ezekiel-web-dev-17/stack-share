"use client";

import { fadeInUp } from "@/lib/animations";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROTATING_WORDS = [
  "Intelligent Stacks",
  "AI Workflows",
  "Smart Tools",
  "Creative Pipelines",
];

const TRENDING_TAGS = [
  "SEO Writing",
  "Code Refactoring",
  "Logo Design",
  "Podcast Editing",
];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-150 w-200 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Announcement badge */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <div className="size-2 bg-accent-green rounded-full" /> Over 1,200
            new workflows added this week
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Supercharge your
          <br />
          workflow with{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="animated-gradient inline-block"
            >
              {ROTATING_WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
        >
          Discover the perfect AI stack for your next project. Browse thousands
          of proven workflows shared by top professionals.
        </motion.p>

        {/* Search bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="glow-blue flex items-center gap-2 rounded-xl border border-border-light bg-surface px-4 py-3">
            <svg
              className="h-5 w-5 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="How do I automate social media posts?"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Trending tags */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted">Trending:</span>
          {TRENDING_TAGS.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(14,165,233,0.15)",
              }}
              className="rounded-full border border-border bg-surface-light/50 px-3 py-1 text-xs text-muted transition-colors hover:text-white"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
