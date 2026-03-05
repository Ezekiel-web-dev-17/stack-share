"use client";

import Image from "next/image";
import arrowIcon from "../assets/icons/arrow-icon.svg";
import SearchTool from "../assets/icons/SearchTool.svg";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Role = { name: string; total: number; checked: boolean };
type Task = { name: string; checked: boolean };
type Price = { name: string; checked: boolean };

const rolesArr: Role[] = [
  { name: "Designer", total: 234, checked: true },
  { name: "Developer", total: 86, checked: true },
  { name: "Marketer", total: 210, checked: true },
  { name: "Product Manager", total: 45, checked: true },
];

const tasksArr: Task[] = [
  { name: "Code Generation", checked: true },
  { name: "Copywriting", checked: true },
  { name: "Image Synthesis", checked: true },
  { name: "Video Editing", checked: true },
];

const pricesArr: Price[] = [
  { name: "Free", checked: true },
  { name: "Paid", checked: true },
  { name: "Trial", checked: true },
];

const accordionVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: -4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } },
} as const;

export default function DiscoverAside() {
  const [activePrice, setActivePrice] = useState(true);
  const [activeTask, setActiveTask] = useState(true);
  const [activeRole, setActiveRole] = useState(true);

  const [tasks, setTasks] = useState<Task[]>(tasksArr);
  const [roles, setRoles] = useState<Role[]>(rolesArr);
  const [prices, setPrices] = useState<Price[]>(pricesArr);

  const resetAll = () => {
    setActivePrice(true);
    setActiveTask(true);
    setActiveRole(true);

    setTasks(tasksArr);
    setRoles(rolesArr);
    setPrices(pricesArr);
  };

  const handlePriceChange = (priceName: string) => {
    setPrices((prev) =>
      prev.map((p) =>
        p.name === priceName ? { ...p, checked: !p.checked } : p,
      ),
    );
  };

  const handleTaskChange = (taskName: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.name === taskName ? { ...t, checked: !t.checked } : t,
      ),
    );
  };

  const handleRoleChange = (roleName: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.name === roleName ? { ...r, checked: !r.checked } : r,
      ),
    );
  };

  return (
    <motion.aside
      className=" max-w-72 min-h-screen-18.25 border-2 border-[#223949] text-muted h-screen"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <form className="p-4 pb-2 lg:hidden">
        <input
          type="text"
          placeholder="Search tools..."
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-white transition-colors dark:bg-background-dark dark:text-white focus:outline-none w-full ps-10"
        />
        <Image
          src={SearchTool}
          alt="Search tool"
          className="absolute top-7 ms-3 w-4 h-4 opacity-75 cursor-pointer"
        />
      </form>

      <hr className="my-3 lg:my-6 text-[#223949] lg:hidden" />

      <div className="flex items-center justify-between p-5 pb-4 lg:pb-6">
        <h2 className="text-white font-medium lg:font-bold text-base lg:text-lg">
          Filters
        </h2>
        <button
          type="button"
          className="border-0 text-[#0D93F2]  font-normal  lg:font-bold text-sm lg:text-base cursor-pointer"
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>

      <div className="px-4">
        {/* Role */}
        <div className="space-y-3 lg:space-y-4">
          <button
            type="button"
            className="w-full flex items-center justify-between"
            onClick={() => setActiveRole((v) => !v)}
          >
            <h5 className="font-medium text-sm">Role</h5>
            <motion.span
              animate={{ rotate: activeRole ? 180 : 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Image src={arrowIcon} alt="arrow-icon" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activeRole ? (
              <motion.div
                key="role"
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {roles.map((role) => (
                    <motion.label
                      key={role.name}
                      className="flex items-center gap-4 py-0.5 lg:py-1"
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        className={role.checked ? "accent-[#0D93F2]" : ""}
                        checked={role.checked}
                        onChange={() => handleRoleChange(role.name)}
                      />
                      <div className="flex justify-between items-center w-full">
                        <h6 className="font-normal text-sm">{role.name}</h6>
                        <span className="text-xs text-muted">{role.total}</span>
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <hr className="my-3 lg:my-6 text-[#223949]" />

        {/* Task */}
        <div className="space-y-3 lg:space-y-4">
          <button
            type="button"
            className="w-full flex items-center justify-between"
            onClick={() => setActiveTask((v) => !v)}
          >
            <h5 className="font-medium text-sm">Task</h5>
            <motion.span
              animate={{ rotate: activeTask ? 180 : 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Image src={arrowIcon} alt="arrow-icon" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activeTask ? (
              <motion.div
                key="task"
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {tasks.map((task) => (
                    <motion.label
                      key={task.name}
                      className="flex items-center gap-4 py-0 lg:py-1"
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        className={task.checked ? "accent-[#0D93F2]" : ""}
                        checked={task.checked}
                        onChange={() => handleTaskChange(task.name)}
                      />
                      <div className="flex justify-between items-center">
                        <h6>{task.name}</h6>
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <hr className="my-3 lg:my-6 text-[#223949]" />

        {/* Price */}
        <div className="space-y-3 lg:space-y-4">
          <button
            type="button"
            className="w-full flex items-center justify-between"
            onClick={() => setActivePrice((v) => !v)}
          >
            <h5>Price</h5>
            <motion.span
              animate={{ rotate: activePrice ? 180 : 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Image src={arrowIcon} alt="arrow-icon" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {activePrice ? (
              <motion.div
                key="price"
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  className="flex items-center justify-between gap-2"
                  variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {prices.map((price) => (
                    <motion.button
                      key={price.name}
                      type="button"
                      variants={itemVariants}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ y: -1 }}
                      className={`border ${
                        price.checked
                          ? "border-[#0D93F2] text-[#0D93F2]"
                          : "border-[#90B2CB] text-[#90B2CB]"
                      } rounded-md px-2 py-1 lg:px-3 lg:py-2 w-18.25 font-normal lg:font-medium text-sm lg:text-base cursor-pointer`}
                      onClick={() => handlePriceChange(price.name)}
                    >
                      {price.name}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
