import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, Brain, Zap, Heart, Smile, Frown, Meh } from 'lucide-react';

const AnimatedAvatar = ({ isTyping, isThinking, mood = 'neutral', size = 'large' }) => {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [showParticles, setShowParticles] = useState(false);

  // Cambiar expresión según el estado
  useEffect(() => {
    if (isTyping) {
      setCurrentExpression('typing');
    } else if (isThinking) {
      setCurrentExpression('thinking');
    } else {
      setCurrentExpression(mood);
    }
  }, [isTyping, isThinking, mood]);

  // Mostrar partículas cuando responde
  useEffect(() => {
    if (!isTyping && !isThinking && mood !== 'neutral') {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping, isThinking, mood]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const getExpressionIcon = () => {
    switch (currentExpression) {
      case 'happy':
        return <Smile className="w-6 h-6 text-yellow-400" />;
      case 'sad':
        return <Frown className="w-6 h-6 text-blue-400" />;
      case 'thinking':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'typing':
        return <MessageCircle className="w-6 h-6 text-green-400" />;
      case 'excited':
        return <Zap className="w-6 h-6 text-yellow-500" />;
      case 'love':
        return <Heart className="w-6 h-6 text-red-400" />;
      default:
        return <Bot className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (currentExpression) {
      case 'happy':
        return 'from-yellow-400 to-orange-500';
      case 'sad':
        return 'from-blue-400 to-blue-600';
      case 'thinking':
        return 'from-purple-400 to-purple-600';
      case 'typing':
        return 'from-green-400 to-green-600';
      case 'excited':
        return 'from-yellow-500 to-red-500';
      case 'love':
        return 'from-pink-400 to-red-500';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  return (
    <div className="relative">
      {/* Partículas de fondo */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                  x: Math.cos(i * 45 * Math.PI / 180) * 60,
                  y: Math.sin(i * 45 * Math.PI / 180) * 60
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Avatar principal */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center shadow-lg relative overflow-hidden`}
        animate={{
          scale: isTyping ? [1, 1.05, 1] : 1,
          rotate: isThinking ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: isTyping ? 0.6 : 2,
          repeat: isTyping ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Ojos animados */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <motion.div
            className="w-1 h-1 bg-white rounded-full"
            animate={{
              scale: isTyping ? [1, 1.2, 1] : 1,
              opacity: isTyping ? [1, 0.5, 1] : 1
            }}
            transition={{
              duration: 0.5,
              repeat: isTyping ? Infinity : 0
            }}
          />
          <motion.div
            className="w-1 h-1 bg-white rounded-full"
            animate={{
              scale: isTyping ? [1, 1.2, 1] : 1,
              opacity: isTyping ? [1, 0.5, 1] : 1
            }}
            transition={{
              duration: 0.5,
              repeat: isTyping ? Infinity : 0,
              delay: 0.1
            }}
          />
        </div>

        {/* Icono de expresión */}
        <motion.div
          animate={{
            scale: currentExpression === 'excited' ? [1, 1.2, 1] : 1,
            rotate: currentExpression === 'thinking' ? [0, 10, -10, 0] : 0
          }}
          transition={{
            duration: currentExpression === 'excited' ? 0.3 : 1,
            repeat: currentExpression === 'excited' ? Infinity : 0
          }}
        >
          {getExpressionIcon()}
        </motion.div>

        {/* Efecto de pulso cuando está pensando */}
        {isThinking && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Efecto de ondas cuando está escribiendo */}
        {isTyping && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Indicador de estado */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
          >
            Escribiendo...
          </motion.div>
        )}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
          >
            Pensando...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedAvatar;
