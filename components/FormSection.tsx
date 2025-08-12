import React, { ReactNode } from 'react';

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ icon, title, children, className = '' }) => {
  return (
    <div className={`bg-red-800/30 backdrop-blur-sm border border-red-700/40 rounded-xl shadow-lg p-4 h-full ${className}`}>
      <div className="flex items-center mb-3">
        <div className="mr-3 text-pink-300 w-6 h-6 flex items-center justify-center">{icon}</div>
        <label className="font-semibold text-pink-200 text-md">{title}</label>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default FormSection;