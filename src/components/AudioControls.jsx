import React from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Volume1,
  Mic,
  MicOff
} from 'lucide-react';

const AudioControls = ({ 
  isEnabled, 
  isSpeaking, 
  volume, 
  onToggle, 
  onStop, 
  onChangeVolume 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Toggle Audio */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-lg transition-colors ${
          isEnabled 
            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
        title={isEnabled ? 'Desactivar audio' : 'Activar audio'}
      >
        {isEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </motion.button>

      {/* Stop Speaking */}
      {isSpeaking && (
        <motion.button
          onClick={onStop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Parar audio"
        >
          <Pause className="w-4 h-4" />
        </motion.button>
      )}

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume1 className="w-4 h-4 text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          disabled={!isEnabled}
        />
        <span className="text-xs text-gray-500 w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${
          isSpeaking 
            ? 'bg-green-500 animate-pulse' 
            : isEnabled 
              ? 'bg-blue-500' 
              : 'bg-gray-400'
        }`} />
        <span className="text-xs text-gray-500">
          {isSpeaking ? 'Hablando...' : isEnabled ? 'Audio ON' : 'Audio OFF'}
        </span>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default AudioControls;