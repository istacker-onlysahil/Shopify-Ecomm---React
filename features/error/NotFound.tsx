
import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="relative mb-8">
        <h1 className="text-[120px] md:text-[180px] font-serif font-bold text-gray-100 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl md:text-2xl font-medium tracking-widest uppercase text-gray-900 mt-8">
            Lost in Space
          </p>
        </div>
      </div>
      
      <p className="max-w-md text-gray-500 mb-12 text-sm md:text-base font-light">
        The page you're looking for seems to have vanished into another collection.
        Check the URL or return to our shop.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onBack}
          className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
        >
          <Home size={16} />
          Return to Home
        </button>
        <button 
          onClick={() => window.location.href = '#'}
          className="flex items-center justify-center gap-2 border border-gray-200 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Collections
        </button>
      </div>
    </div>
  );
};

export default NotFound;
