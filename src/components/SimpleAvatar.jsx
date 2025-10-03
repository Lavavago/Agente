import React from 'react';

const SimpleAvatar = ({ mood = 'neutral', size = 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const getColor = () => {
    switch (mood) {
      case 'happy': return 'bg-yellow-400';
      case 'sad': return 'bg-blue-400';
      case 'thinking': return 'bg-purple-400';
      case 'excited': return 'bg-red-400';
      case 'love': return 'bg-pink-400';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${getColor()} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
      🤖
    </div>
  );
};

export default SimpleAvatar;
