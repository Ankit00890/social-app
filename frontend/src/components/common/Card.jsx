import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={twMerge(clsx('bg-white rounded-xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100', className))}
        >
            {children}
        </motion.div>
    );
};

export default Card;
