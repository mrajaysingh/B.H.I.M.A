import React from 'react';
import { motion } from 'framer-motion';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="relative flex flex-col items-center w-full max-w-[280px] px-4 sm:max-w-none">
        {/* Main circle */}
        <motion.div
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-indigo-600/30 dark:border-indigo-500/30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Spinning gradient arc */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Pulsing dots */}
        <div className="mt-8 flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-600 dark:bg-indigo-500"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            B.H.I.M.A.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Loading your AI assistant...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Preloader; 