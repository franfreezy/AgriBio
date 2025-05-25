import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
       <div className="flex items-center justify-center gap-2">
        {/* Red Box */}
        <div className="w-3 h-3 bg-red-500 animate-blink"></div>
        {/* Green Box */}
        <div className="w-3 h-3 bg-[#2c5530] animate-blink [animation-delay:0.33s]"></div>
        {/* Black Box */}
        <div className="w-3 h-3 bg-black animate-blink [animation-delay:0.66s]"></div>
      </div>
    </div>
  );
};

export default Loading;
