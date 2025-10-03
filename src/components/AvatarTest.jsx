import React, { useState } from 'react';
import SimpleAvatar from './SimpleAvatar';

export default function AvatarTest() {
  const [mood, setMood] = useState('neutral');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const moods = ['neutral', 'happy', 'sad', 'thinking', 'excited', 'love', 'typing'];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Avatar Test</h1>
      
      <div className="flex justify-center mb-8">
        <SimpleAvatar 
          mood={mood}
          size="xlarge"
        />
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mood:</label>
          <select 
            value={mood} 
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {moods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsTyping(!isTyping)}
            className={`px-4 py-2 rounded ${isTyping ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Typing: {isTyping ? 'ON' : 'OFF'}
          </button>
          
          <button 
            onClick={() => setIsThinking(!isThinking)}
            className={`px-4 py-2 rounded ${isThinking ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
          >
            Thinking: {isThinking ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Current: {mood} | Typing: {isTyping ? 'Yes' : 'No'} | Thinking: {isThinking ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
}
