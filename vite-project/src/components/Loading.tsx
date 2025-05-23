import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-xl font-semibold text-[#2c5530] mb-2">Loading AB DATA...</div>
      <div className="flex items-center justify-center gap-2">
        {/* Red Box */}
        <div className="w-3 h-3 bg-red-500 animate-[blink_1s_ease-in-out_infinite]"></div>
        {/* Green Box */}
        <div className="w-3 h-3 bg-[#2c5530] animate-[blink_1s_ease-in-out_0.33s_infinite]"></div>
        {/* Black Box */}
        <div className="w-3 h-3 bg-black animate-[blink_1s_ease-in-out_0.66s_infinite]"></div>
      </div>
    </div>
  );
};

export default Loading;
