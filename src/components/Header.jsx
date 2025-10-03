import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ServicioAgente
        </h1>
        <p className="text-gray-600">
          ¿En qué puedo ayudarte hoy?
        </p>
      </motion.div>
    </motion.header>
  );
}