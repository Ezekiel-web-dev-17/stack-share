import arrowIcon from "../assets/icons/arrow-icon.svg";
import { motion } from "framer-motion";
import Image from "next/image";

function Pagination() {
  return (
    <motion.div
      className="flex items-center justify-center mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.2 }}
    >
      <div className="gap-3 flex items-center justify-between">
        <motion.button
          className="border-2 border-[#223949] bg-transparent text-[#0D93F2] text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg"
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
        >
          <Image
            src={arrowIcon}
            alt="previous-arrow-icon"
            className="-rotate-90 w-4 h-4"
          />
        </motion.button>

        {Array.from({ length: 5 }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            className={`border-2 border-[#223949] rounded-lg bg-primary text-white text-base font-medium cursor-pointer px-3 py-1 ${
              i === 0
                ? "bg-primary text-white"
                : "bg-transparent text-[#0D93F2]"
            }`}
          >
            {i <= 2 || i === 4 ? i + 1 : "..."}
          </motion.button>
        ))}

        <motion.button
          className="border-2 border-[#223949] rounded-lg bg-transparent text-[#0D93F2] text-base font-medium cursor-pointer p-2"
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
        >
          <Image
            src={arrowIcon}
            alt="next-arrow-icon"
            className="rotate-90 w-4 h-4"
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Pagination;
