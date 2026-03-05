"use client";

import { fadeInUp } from "@/lib/animations";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  return (
    <section className="py-20">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <svg
            className="h-7 w-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Get the top stacks weekly
        </h2>
        <p className="mt-3 text-sm text-muted">
          Join 50,000+ professionals discovering new ways to work smarter. No
          spam, just pure productivity.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-primary/50 sm:w-72"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:w-auto"
          >
            Subscribe
          </motion.button>
        </div>
        <p className="mt-3 text-xs text-muted/60">Unsubscribe at any time.</p>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
