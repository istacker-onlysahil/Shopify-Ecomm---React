import React, { useEffect } from 'react';
import { Check, AlertCircle, X, Info } from 'lucide-react';
import { ToastMessage } from '../../types/index';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <Check size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-white border-green-100',
    error: 'bg-white border-red-100',
    info: 'bg-white border-blue-100'
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center justify-center pointer-events-none">
      <div className={`
        flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border 
        ${bgColors[toast.type]} 
        animate-slide-up pointer-events-auto
        min-w-[280px] sm:min-w-[320px] max-w-md
      `}>
        <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-green-50' : toast.type === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
          {icons[toast.type]}
        </div>
        <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
