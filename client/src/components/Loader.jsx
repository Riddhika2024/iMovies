import React from 'react';
import { Film } from 'lucide-react';

export const Loader = ({ message = 'Loading blockbusters...' }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-sky-950 border-t-[#00A8E1] animate-spin flex items-center justify-center shadow-lg shadow-[#00A8E1]/20"></div>
        <Film className="w-6 h-6 text-[#00A8E1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
