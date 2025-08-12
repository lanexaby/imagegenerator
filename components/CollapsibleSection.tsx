
import React, { useState, ReactNode } from 'react';

// Chevron Icon for indicating open/closed state
const IconChevronDown = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  startOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-red-900/40 border border-red-700/50 rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-pink-200 hover:bg-red-900/60 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-')}`}
      >
        <span>{title}</span>
        <IconChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      <div
        id={`collapsible-content-${title.replace(/\s+/g, '-')}`}
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ overflow: 'hidden' }}
      >
        <div className="p-3 border-t border-red-700/50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
