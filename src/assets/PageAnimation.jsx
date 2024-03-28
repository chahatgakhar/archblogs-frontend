import React from "react";
import { motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  className,
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      key={keyValue}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
