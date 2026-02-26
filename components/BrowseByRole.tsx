"use client";

import { fadeInUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";
import DeveloperIcon from "@/assets/icons/developer-icon.svg";
import DesignerIcon from "@/assets/icons/designer-icon.svg";
import MarketerIcon from "@/assets/icons/marketer-icon.svg";
import FounderIcon from "@/assets/icons/founder-icon.svg";
import WriterIcon from "@/assets/icons/writer-icon.svg";
import ProductManagerIcon from "@/assets/icons/product-manager-icon.svg";

const ROLES = [
  { icon: DeveloperIcon, label: "Developer" },
  { icon: DesignerIcon, label: "Designer" },
  { icon: MarketerIcon, label: "Marketer" },
  { icon: FounderIcon, label: "Founder" },
  { icon: WriterIcon, label: "Writer" },
  { icon: ProductManagerIcon, label: "Product Manager" },
];

const BrowseByRole = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-2xl font-bold text-white">Browse by Role</h2>
          <a
            href="#"
            className="text-sm text-primary transition-colors hover:text-primary-dark"
          >
            View all roles →
          </a>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6"
        >
          {ROLES.map((role) => (
            <div
              key={role.label}
              className="card-glow flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 transition-all"
            >
              <span className="text-3xl">
                <Image src={role.icon} alt="icon" />
              </span>
              <span className="text-sm font-medium text-white">
                {role.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrowseByRole;
