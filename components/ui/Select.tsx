
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select option",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    // Close on resize or scroll to avoid detached dropdowns
    const handleResize = () => setIsOpen(false);
    const handleScroll = () => setIsOpen(false); 
    
    if (isOpen) {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true); 
    }
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking outside the button (dropdown clicks stop propagation, so they won't trigger this)
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isOpen && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setCoords({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width
          });
      }
      setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={containerRef}
        type="button"
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="h-3 w-3 opacity-50 ml-1 flex-shrink-0" />
      </button>

      {isOpen && createPortal(
        <div 
            className="absolute z-[9999] mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white text-gray-900 shadow-md animate-scale-in"
            style={{ 
                top: coords.top, 
                left: coords.left, 
                width: coords.width 
            }}
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={(e) => e.stopPropagation()} 
        >
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                }}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-[10px] md:text-xs outline-none hover:bg-gray-100 hover:text-gray-900 ${
                  value === option.value ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {value === option.value && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
